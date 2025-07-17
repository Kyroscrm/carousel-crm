"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase-types"

type Contact = Database["public"]["Tables"]["contacts"]["Row"]
type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"]
type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"]

export function useSupabaseContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setContacts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Create contact
  const createContact = async (contactData: ContactInsert) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("contacts").insert(contactData).select().single()

      if (error) throw error
      setContacts((prev) => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create contact")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update contact
  const updateContact = async (id: number, updates: ContactUpdate) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("contacts")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      setContacts((prev) => prev.map((contact) => (contact.id === id ? data : contact)))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update contact")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete contact
  const deleteContact = async (id: number) => {
    try {
      setLoading(true)
      const { error } = await supabase.from("contacts").delete().eq("id", id)

      if (error) throw error
      setContacts((prev) => prev.filter((contact) => contact.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete contact")
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  return {
    contacts,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts,
  }
}
