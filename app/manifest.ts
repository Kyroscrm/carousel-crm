import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Carousel CRM - Elite Edition",
    short_name: "Carousel CRM",
    description: "Enterprise CRM platform with AI-powered insights and visual pipeline management",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    orientation: "portrait-primary",
    categories: ["business", "productivity", "finance"],
    lang: "en",
    dir: "ltr",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshot-narrow.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "View your CRM dashboard",
        url: "/",
        icons: [{ src: "/shortcut-dashboard.png", sizes: "96x96" }],
      },
      {
        name: "Contacts",
        short_name: "Contacts",
        description: "Manage your contacts",
        url: "/contacts",
        icons: [{ src: "/shortcut-contacts.png", sizes: "96x96" }],
      },
      {
        name: "Deals",
        short_name: "Deals",
        description: "View your sales pipeline",
        url: "/deals",
        icons: [{ src: "/shortcut-deals.png", sizes: "96x96" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
