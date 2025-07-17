"use client"

import { useState } from "react"

export interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company: string
  title: string
  status: "Lead" | "Customer" | "Prospect" | "Partner"
  source: "Website" | "Referral" | "Cold Call" | "Email Campaign" | "Social Media"
  score: number
  lastActivity: string
  avatar: string
  industry: string
  createdAt: string
  updatedAt: string
}

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    type: "All Contacts",
    source: "All Sources",
    industry: "All Industries",
    status: "All Status",
  })

  const filteredContacts = contacts.filter((contact) => {
    if (filters.type !== "All Contacts" && contact.status !== filters.type) return false
    if (filters.source !== "All Sources" && contact.source !== filters.source) return false
    if (filters.industry !== "All Industries" && contact.industry !== filters.industry) return false
    if (filters.status !== "All Status" && contact.status !== filters.status) return false
    return true
  })

  const createContact = async (contactData: Omit<Contact, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    try {
      const newContact: Contact = {
        ...contactData,
        id: contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setContacts((prev) => [...prev, newContact])
      return newContact
    } catch (err) {
      setError("Failed to create contact")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateContact = async (id: number, updates: Partial<Contact>) => {
    setLoading(true)
    try {
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === id ? { ...contact, ...updates, updatedAt: new Date().toISOString() } : contact,
        ),
      )
    } catch (err) {
      setError("Failed to update contact")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteContact = async (id: number) => {
    setLoading(true)
    try {
      setContacts((prev) => prev.filter((contact) => contact.id !== id))
    } catch (err) {
      setError("Failed to delete contact")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const exportContacts = async (format: "csv" | "excel" | "pdf") => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(`Exporting contacts as ${format}`)
    } catch (err) {
      setError(`Failed to export contacts as ${format}`)
    } finally {
      setLoading(false)
    }
  }

  const importContacts = async (file: File) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Importing contacts from file:", file.name)
    } catch (err) {
      setError("Failed to import contacts")
    } finally {
      setLoading(false)
    }
  }

  return {
    contacts: filteredContacts,
    allContacts: contacts,
    loading,
    error,
    filters,
    setFilters,
    createContact,
    updateContact,
    deleteContact,
    exportContacts,
    importContacts,
  }
}
