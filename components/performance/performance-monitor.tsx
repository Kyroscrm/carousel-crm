"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Zap, Clock, AlertTriangle } from "lucide-react"

interface PerformanceMetrics {
  pageLoadTime: number
  apiResponseTime: number
  errorRate: number
  memoryUsage: number
  coreWebVitals: {
    lcp: number // Largest Contentful Paint
    fid: number // First Input Delay
    cls: number // Cumulative Layout Shift
  }
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    apiResponseTime: 0,
    errorRate: 0,
    memoryUsage: 0,
    coreWebVitals: {
      lcp: 0,
      fid: 0,
      cls: 0,
    },
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development or for admin users
    const isDev = process.env.NODE_ENV === "development"
    const isAdmin = localStorage.getItem("user_role") === "admin"
    setIsVisible(isDev || isAdmin)

    if (!isVisible) return

    const measurePerformance = () => {
      // Page Load Time
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart

      // API Response Time (average of recent API calls)
      const resourceEntries = performance.getEntriesByType("resource") as PerformanceResourceTiming[]
      const apiCalls = resourceEntries.filter((entry) => entry.name.includes("/api/"))
      const avgApiTime =
        apiCalls.length > 0 ? apiCalls.reduce((sum, entry) => sum + entry.duration, 0) / apiCalls.length : 0

      // Memory Usage (if available)
      const memoryInfo = (performance as any).memory
      const memoryUsage = memoryInfo ? (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100 : 0

      // Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            setMetrics((prev) => ({
              ...prev,
              coreWebVitals: { ...prev.coreWebVitals, lcp: entry.startTime },
            }))
          }
          if (entry.entryType === "first-input") {
            setMetrics((prev) => ({
              ...prev,
              coreWebVitals: { ...prev.coreWebVitals, fid: (entry as any).processingStart - entry.startTime },
            }))
          }
          if (entry.entryType === "layout-shift") {
            if (!(entry as any).hadRecentInput) {
              setMetrics((prev) => ({
                ...prev,
                coreWebVitals: { ...prev.coreWebVitals, cls: prev.coreWebVitals.cls + (entry as any).value },
              }))
            }
          }
        }
      })

      observer.observe({ entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"] })

      setMetrics((prev) => ({
        ...prev,
        pageLoadTime,
        apiResponseTime: avgApiTime,
        memoryUsage,
        errorRate: 0, // This would be tracked via error boundary
      }))
    }

    measurePerformance()
    const interval = setInterval(measurePerformance, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [isVisible])

  const getScoreColor = (score: number, thresholds: { good: number; needs: number }) => {
    if (score <= thresholds.good) return "text-green-600"
    if (score <= thresholds.needs) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number, thresholds: { good: number; needs: number }) => {
    if (score <= thresholds.good) return "Good"
    if (score <= thresholds.needs) return "Needs Improvement"
    return "Poor"
  }

  if (!isVisible) return null

  return (
    <Card className="fixed bottom-4 left-4 w-80 z-40 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Clock className="h-3 w-3" />
              Page Load
            </div>
            <div className={`font-medium ${getScoreColor(metrics.pageLoadTime, { good: 2000, needs: 4000 })}`}>
              {(metrics.pageLoadTime / 1000).toFixed(2)}s
            </div>
            <Badge variant="outline" className="text-xs">
              {getScoreLabel(metrics.pageLoadTime, { good: 2000, needs: 4000 })}
            </Badge>
          </div>

          <div>
            <div className="flex items-center gap-1 mb-1">
              <Zap className="h-3 w-3" />
              API Response
            </div>
            <div className={`font-medium ${getScoreColor(metrics.apiResponseTime, { good: 200, needs: 500 })}`}>
              {metrics.apiResponseTime.toFixed(0)}ms
            </div>
            <Badge variant="outline" className="text-xs">
              {getScoreLabel(metrics.apiResponseTime, { good: 200, needs: 500 })}
            </Badge>
          </div>
        </div>

        <div>
          <div className="text-xs mb-1">Memory Usage</div>
          <Progress value={metrics.memoryUsage} className="h-2" />
          <div className="text-xs text-gray-500 mt-1">{metrics.memoryUsage.toFixed(1)}%</div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium">Core Web Vitals</div>

          <div className="flex justify-between items-center">
            <span className="text-xs">LCP</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${getScoreColor(metrics.coreWebVitals.lcp, { good: 2500, needs: 4000 })}`}
              >
                {(metrics.coreWebVitals.lcp / 1000).toFixed(2)}s
              </span>
              <Badge variant="outline" className="text-xs">
                {getScoreLabel(metrics.coreWebVitals.lcp, { good: 2500, needs: 4000 })}
              </Badge>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs">FID</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${getScoreColor(metrics.coreWebVitals.fid, { good: 100, needs: 300 })}`}
              >
                {metrics.coreWebVitals.fid.toFixed(0)}ms
              </span>
              <Badge variant="outline" className="text-xs">
                {getScoreLabel(metrics.coreWebVitals.fid, { good: 100, needs: 300 })}
              </Badge>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs">CLS</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${getScoreColor(metrics.coreWebVitals.cls * 1000, { good: 100, needs: 250 })}`}
              >
                {metrics.coreWebVitals.cls.toFixed(3)}
              </span>
              <Badge variant="outline" className="text-xs">
                {getScoreLabel(metrics.coreWebVitals.cls * 1000, { good: 100, needs: 250 })}
              </Badge>
            </div>
          </div>
        </div>

        {metrics.errorRate > 0 && (
          <div className="flex items-center gap-2 p-2 bg-red-50 rounded text-xs">
            <AlertTriangle className="h-3 w-3 text-red-600" />
            <span className="text-red-600">Error Rate: {metrics.errorRate.toFixed(2)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
