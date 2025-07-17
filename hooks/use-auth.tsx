"use client"

import { useState, useEffect, createContext, useContext } from "react"
import type React from "react"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: string
  department?: string
  phone?: string
  location?: string
  bio?: string
  timezone?: string
  language?: string
  created_at: string
  updated_at: string
  last_login?: string
  preferences: {
    theme: "light" | "dark" | "system"
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    dateFormat: string
    timeFormat: "12h" | "24h"
    currency: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      // TODO: Replace with Supabase auth check
      // const { data: { session } } = await supabase.auth.getSession()
      // if (session?.user) {
      //   const { data: profile } = await supabase
      //     .from('profiles')
      //     .select('*')
      //     .eq('id', session.user.id)
      //     .single()
      //   setUser(profile)
      // }

      // For now, check localStorage for demo purposes
      const savedUser = localStorage.getItem("crm_user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      // TODO: Replace with Supabase auth
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // })
      // if (error) throw error

      // Demo implementation
      if (email && password) {
        const demoUser: User = {
          id: "demo-user-id",
          email,
          name: "Demo User",
          role: "Admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          preferences: {
            theme: "light",
            notifications: {
              email: true,
              push: true,
              sms: false,
            },
            dateFormat: "MM/DD/YYYY",
            timeFormat: "12h",
            currency: "USD",
          },
        }
        setUser(demoUser)
        localStorage.setItem("crm_user", JSON.stringify(demoUser))
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      // TODO: Replace with Supabase auth
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password,
      //   options: {
      //     data: { name }
      //   }
      // })
      // if (error) throw error

      console.log("Sign up:", { email, password, name })
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      // TODO: Replace with Supabase auth
      // const { error } = await supabase.auth.signOut()
      // if (error) throw error

      setUser(null)
      localStorage.removeItem("crm_user")
    } catch (error) {
      console.error("Sign out failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return

    setLoading(true)
    try {
      // TODO: Replace with Supabase call
      // const { error } = await supabase
      //   .from('profiles')
      //   .update(updates)
      //   .eq('id', user.id)
      // if (error) throw error

      const updatedUser = {
        ...user,
        ...updates,
        updated_at: new Date().toISOString(),
      }
      setUser(updatedUser)
      localStorage.setItem("crm_user", JSON.stringify(updatedUser))
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      // TODO: Replace with Supabase auth
      // const { error } = await supabase.auth.resetPasswordForEmail(email)
      // if (error) throw error

      console.log("Password reset requested for:", email)
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        signUp,
        updateProfile,
        resetPassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
