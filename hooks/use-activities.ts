"use client"

import { useState } from "react"

export interface Activity {
  id: number
  type: "call" | "email" | "meeting" | "task" | "note"
  title: string
  description: string
  status: "scheduled" | "completed" | "overdue" | "cancelled"
  priority: "high" | "medium" | "low"
  scheduledAt?: string
  completedAt?: string
  duration?: number
  outcome?: string
  userName: string
  userAvatar?: string
  contactId?: number
  companyId?: number
  dealId?: number
  createdAt: string
  updatedAt: string
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createActivity = async (activityData: Omit<Activity, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    try {
      const newActivity: Activity = {
        ...activityData,
        id: activities.length > 0 ? Math.max(...activities.map((a) => a.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setActivities((prev) => [...prev, newActivity])
      return newActivity
    } catch (err) {
      setError("Failed to create activity")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateActivity = async (id: number, updates: Partial<Activity>) => {
    setLoading(true)
    try {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === id ? { ...activity, ...updates, updatedAt: new Date().toISOString() } : activity,
        ),
      )
    } catch (err) {
      setError("Failed to update activity")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const completeActivity = async (id: number, outcome?: string) => {
    await updateActivity(id, {
      status: "completed",
      completedAt: new Date().toISOString(),
      outcome,
    })
  }

  const deleteActivity = async (id: number) => {
    setLoading(true)
    try {
      setActivities((prev) => prev.filter((activity) => activity.id !== id))
    } catch (err) {
      setError("Failed to delete activity")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    activities,
    loading,
    error,
    createActivity,
    updateActivity,
    completeActivity,
    deleteActivity,
  }
}
