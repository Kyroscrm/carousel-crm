"use client"

import { useState } from "react"

export interface CrewMember {
  id: number
  name: string
  role: string
  hourlyRate: number
  skills: string[]
}

export interface Crew {
  id: number
  name: string
  description: string
  leaderName: string
  status: "Active" | "Inactive" | "On Assignment"
  availability: "Available" | "Busy" | "Unavailable"
  hourlyRate: number
  specialties: string[]
  currentProject?: string
  members: CrewMember[]
  createdAt: string
  updatedAt: string
}

export function useCrews() {
  const [crews, setCrews] = useState<Crew[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCrew = async (crewData: Omit<Crew, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    try {
      const newCrew: Crew = {
        ...crewData,
        id: crews.length > 0 ? Math.max(...crews.map((c) => c.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setCrews((prev) => [...prev, newCrew])
      return newCrew
    } catch (err) {
      setError("Failed to create crew")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCrew = async (id: number, updates: Partial<Crew>) => {
    setLoading(true)
    try {
      setCrews((prev) =>
        prev.map((crew) => (crew.id === id ? { ...crew, ...updates, updatedAt: new Date().toISOString() } : crew)),
      )
    } catch (err) {
      setError("Failed to update crew")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCrew = async (id: number) => {
    setLoading(true)
    try {
      setCrews((prev) => prev.filter((crew) => crew.id !== id))
    } catch (err) {
      setError("Failed to delete crew")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    crews,
    loading,
    error,
    createCrew,
    updateCrew,
    deleteCrew,
  }
}
