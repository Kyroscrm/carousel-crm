import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist"
import { Serwist } from "serwist"

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[]
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    ...defaultCache,
    {
      urlPattern: /^https:\/\/api\.supabase\.co\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "supabase-api-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "supabase-storage-cache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === "image",
      handler: "CacheFirst",
      options: {
        cacheName: "images-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
  ],
})

serwist.addEventListeners()

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Process queued offline actions
  const queuedActions = await getQueuedActions()

  for (const action of queuedActions) {
    try {
      await processAction(action)
      await removeFromQueue(action.id)
    } catch (error) {
      console.error("Failed to sync action:", error)
    }
  }
}

async function getQueuedActions() {
  // Get actions from IndexedDB
  return []
}

async function processAction(action: any) {
  // Process the queued action
  console.log("Processing action:", action)
}

async function removeFromQueue(actionId: string) {
  // Remove processed action from queue
  console.log("Removing action from queue:", actionId)
}

// Push notification handling
self.addEventListener("push", (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    data: data.data,
    actions: [
      {
        action: "view",
        title: "View",
        icon: "/action-view.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/action-dismiss.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "view") {
    event.waitUntil(self.clients.openWindow(event.notification.data.url || "/"))
  }
})
