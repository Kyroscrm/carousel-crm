"use client"

import { useState } from "react"

export interface Workflow {
  id: number
  name: string
  description: string
  status: "active" | "paused" | "error"
  trigger: string
  actions: number
  lastRun: string
  success: number
  icon: string
  createdAt: string
  updatedAt: string
}

export interface WorkflowStats {
  activeWorkflows: number
  tasksAutomated: number
  timeSaved: string
  failedActions: number
}

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stats: WorkflowStats = {
    activeWorkflows: workflows.filter((w) => w.status === "active").length,
    tasksAutomated: 0,
    timeSaved: "0h",
    failedActions: 0,
  }

  const createWorkflow = async (workflowData: Omit<Workflow, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    try {
      const newWorkflow: Workflow = {
        ...workflowData,
        id: workflows.length > 0 ? Math.max(...workflows.map((w) => w.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setWorkflows((prev) => [...prev, newWorkflow])
      return newWorkflow
    } catch (err) {
      setError("Failed to create workflow")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateWorkflow = async (id: number, updates: Partial<Workflow>) => {
    setLoading(true)
    try {
      setWorkflows((prev) =>
        prev.map((workflow) =>
          workflow.id === id ? { ...workflow, ...updates, updatedAt: new Date().toISOString() } : workflow,
        ),
      )
    } catch (err) {
      setError("Failed to update workflow")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleWorkflow = async (id: number) => {
    const workflow = workflows.find((w) => w.id === id)
    if (workflow) {
      const newStatus = workflow.status === "active" ? "paused" : "active"
      await updateWorkflow(id, { status: newStatus })
    }
  }

  const deleteWorkflow = async (id: number) => {
    setLoading(true)
    try {
      setWorkflows((prev) => prev.filter((workflow) => workflow.id !== id))
    } catch (err) {
      setError("Failed to delete workflow")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    workflows,
    stats,
    loading,
    error,
    createWorkflow,
    updateWorkflow,
    toggleWorkflow,
    deleteWorkflow,
  }
}
