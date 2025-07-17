"use client"

import { useEffect } from "react"

import { useState } from "react"

interface QueuedAction {
  id: string
  type: string
  data: any
  timestamp: number
  retries: number
}

class OfflineStorage {
  private dbName = "carousel-crm-offline"
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains("contacts")) {
          db.createObjectStore("contacts", { keyPath: "id" })
        }
        if (!db.objectStoreNames.contains("deals")) {
          db.createObjectStore("deals", { keyPath: "id" })
        }
        if (!db.objectStoreNames.contains("activities")) {
          db.createObjectStore("activities", { keyPath: "id" })
        }
        if (!db.objectStoreNames.contains("queue")) {
          db.createObjectStore("queue", { keyPath: "id" })
        }
      }
    })
  }

  async storeData(storeName: string, data: any[]): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction([storeName], "readwrite")
    const store = transaction.objectStore(storeName)

    for (const item of data) {
      store.put(item)
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  async getData(storeName: string): Promise<any[]> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction([storeName], "readonly")
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async queueAction(action: Omit<QueuedAction, "id" | "timestamp" | "retries">): Promise<void> {
    const queuedAction: QueuedAction = {
      ...action,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      retries: 0,
    }

    await this.storeData("queue", [queuedAction])

    // Register background sync if available
    if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register("background-sync")
    }
  }

  async getQueuedActions(): Promise<QueuedAction[]> {
    return this.getData("queue")
  }

  async removeQueuedAction(id: string): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["queue"], "readwrite")
    const store = transaction.objectStore("queue")
    store.delete(id)

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  async clearStore(storeName: string): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction([storeName], "readwrite")
    const store = transaction.objectStore(storeName)
    store.clear()

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }
}

export const offlineStorage = new OfflineStorage()

// Hook for offline functionality
export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const queueOfflineAction = async (type: string, data: any) => {
    await offlineStorage.queueAction({ type, data })
  }

  return {
    isOnline,
    queueOfflineAction,
  }
}
