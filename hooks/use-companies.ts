"use client"

import { useState } from "react"

export interface Company {
  id: number
  name: string
  domain: string
  industry: string
  size: "Startup" | "Small" | "Medium" | "Large" | "Enterprise"
  revenue: number
  status: "Active" | "Prospect" | "Inactive"
  contacts: number
  lastActivity: string
  createdAt: string
  updatedAt: string
}

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCompany = async (companyData: Omit<Company, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    try {
      const newCompany: Company = {
        ...companyData,
        id: companies.length > 0 ? Math.max(...companies.map((c) => c.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setCompanies((prev) => [...prev, newCompany])
      return newCompany
    } catch (err) {
      setError("Failed to create company")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCompany = async (id: number, updates: Partial<Company>) => {
    setLoading(true)
    try {
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === id ? { ...company, ...updates, updatedAt: new Date().toISOString() } : company,
        ),
      )
    } catch (err) {
      setError("Failed to update company")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCompany = async (id: number) => {
    setLoading(true)
    try {
      setCompanies((prev) => prev.filter((company) => company.id !== id))
    } catch (err) {
      setError("Failed to delete company")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    companies,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
  }
}
