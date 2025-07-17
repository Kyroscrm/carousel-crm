"use client"

import { useState } from "react"

export interface Deal {
  id: number
  title: string
  company: string
  contact: string
  value: number
  probability: number
  closeDate: string
  stage: "qualified" | "proposal" | "negotiation" | "closed-won" | "closed-lost"
  owner: string
  avatar: string
  tags: string[]
  description?: string
  createdAt: string
  updatedAt: string
}

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDeal = async (dealData: Omit<Deal, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    try {
      const newDeal: Deal = {
        ...dealData,
        id: deals.length > 0 ? Math.max(...deals.map((d) => d.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setDeals((prev) => [...prev, newDeal])
      return newDeal
    } catch (err) {
      setError("Failed to create deal")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateDeal = async (id: number, updates: Partial<Deal>) => {
    setLoading(true)
    try {
      setDeals((prev) =>
        prev.map((deal) => (deal.id === id ? { ...deal, ...updates, updatedAt: new Date().toISOString() } : deal)),
      )
    } catch (err) {
      setError("Failed to update deal")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteDeal = async (id: number) => {
    setLoading(true)
    try {
      setDeals((prev) => prev.filter((deal) => deal.id !== id))
    } catch (err) {
      setError("Failed to delete deal")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const moveDeal = async (id: number, newStage: Deal["stage"]) => {
    await updateDeal(id, { stage: newStage })
  }

  return {
    deals,
    loading,
    error,
    createDeal,
    updateDeal,
    deleteDeal,
    moveDeal,
  }
}
