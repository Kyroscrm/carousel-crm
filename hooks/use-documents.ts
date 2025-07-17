"use client"

import { useState } from "react"

export interface Document {
  id: number
  name: string
  type: "pdf" | "document" | "presentation" | "image" | "video" | "archive"
  size: string
  modified: string
  owner: string
  starred: boolean
  folderId?: number
  url?: string
  createdAt: string
  updatedAt: string
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDocument = async (documentData: Omit<Document, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    try {
      const newDocument: Document = {
        ...documentData,
        id: documents.length > 0 ? Math.max(...documents.map((d) => d.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setDocuments((prev) => [...prev, newDocument])
      return newDocument
    } catch (err) {
      setError("Failed to create document")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateDocument = async (id: number, updates: Partial<Document>) => {
    setLoading(true)
    try {
      setDocuments((prev) =>
        prev.map((document) =>
          document.id === id ? { ...document, ...updates, updatedAt: new Date().toISOString() } : document,
        ),
      )
    } catch (err) {
      setError("Failed to update document")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleStar = async (id: number) => {
    const document = documents.find((d) => d.id === id)
    if (document) {
      await updateDocument(id, { starred: !document.starred })
    }
  }

  const deleteDocument = async (id: number) => {
    setLoading(true)
    try {
      setDocuments((prev) => prev.filter((document) => document.id !== id))
    } catch (err) {
      setError("Failed to delete document")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const uploadDocument = async (file: File, folderId?: number) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Uploading document:", file.name)
    } catch (err) {
      setError("Failed to upload document")
    } finally {
      setLoading(false)
    }
  }

  return {
    documents,
    loading,
    error,
    createDocument,
    updateDocument,
    toggleStar,
    deleteDocument,
    uploadDocument,
  }
}
