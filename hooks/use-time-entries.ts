"use client"

import { useState } from "react"

export interface TimeEntry {
  id: number
  workerName: string
  jobTitle: string
  date: string
  startTime: string
  endTime: string
  hours: number
  hourlyRate: number
  totalAmount: number
  description: string
  status: "Draft" | "Submitted" | "Approved" | "Rejected"
  createdAt: string
  updatedAt: string
}

export function useTimeEntries() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTimeEntry = async (entryData: Omit<TimeEntry, "id" | "totalAmount" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    try {
      const totalAmount = entryData.hours * entryData.hourlyRate
      const newEntry: TimeEntry = {
        ...entryData,
        id: timeEntries.length > 0 ? Math.max(...timeEntries.map((e) => e.id)) + 1 : 1,
        totalAmount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setTimeEntries((prev) => [...prev, newEntry])
      return newEntry
    } catch (err) {
      setError("Failed to create time entry")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTimeEntry = async (id: number, updates: Partial<TimeEntry>) => {
    setLoading(true)
    try {
      setTimeEntries((prev) =>
        prev.map((entry) => {
          if (entry.id === id) {
            const updated = { ...entry, ...updates, updatedAt: new Date().toISOString() }
            if (updates.hours || updates.hourlyRate) {
              updated.totalAmount = (updates.hours || entry.hours) * (updates.hourlyRate || entry.hourlyRate)
            }
            return updated
          }
          return entry
        }),
      )
    } catch (err) {
      setError("Failed to update time entry")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTimeEntry = async (id: number) => {
    setLoading(true)
    try {
      setTimeEntries((prev) => prev.filter((entry) => entry.id !== id))
    } catch (err) {
      setError("Failed to delete time entry")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    timeEntries,
    loading,
    error,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
  }
}
