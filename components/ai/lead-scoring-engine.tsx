"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, Zap } from "lucide-react"
import { useContacts } from "@/hooks/use-contacts"
import { useAI } from "@/hooks/use-ai"

interface LeadScore {
  contactId: number
  score: number
  confidence: number
  factors: {
    demographic: number
    behavioral: number
    engagement: number
    company: number
  }
  recommendations: string[]
  riskFactors: string[]
}

export function LeadScoringEngine() {
  const { contacts } = useContacts()
  const { calculateLeadScore, getPredictiveInsights } = useAI()
  const [scores, setScores] = useState<LeadScore[]>([])
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<any>(null)

  useEffect(() => {
    if (contacts.length > 0) {
      calculateScores()
    }
  }, [contacts])

  const calculateScores = async () => {
    setLoading(true)
    try {
      const calculatedScores = await Promise.all(
        contacts.map(async (contact) => {
          const score = await calculateLeadScore({
            demographic: {
              jobTitle: contact.title,
              company: contact.company,
              industry: contact.industry,
              location: contact.location,
            },
            behavioral: {
              emailOpens: Math.random() * 10,
              linkClicks: Math.random() * 5,
              pageViews: Math.random() * 20,
              timeOnSite: Math.random() * 300,
            },
            engagement: {
              lastActivity: contact.lastActivity,
              responseRate: Math.random(),
              meetingsScheduled: Math.random() * 3,
              emailsSent: Math.random() * 10,
            },
            company: {
              size: Math.random() * 1000,
              revenue: Math.random() * 10000000,
              growth: Math.random() * 0.5,
              technology: ["CRM", "Sales Tools"],
            },
          })

          return {
            contactId: contact.id,
            score: score.score,
            confidence: score.confidence,
            factors: score.factors,
            recommendations: score.recommendations,
            riskFactors: score.riskFactors,
          }
        }),
      )

      setScores(calculatedScores.sort((a, b) => b.score - a.score))

      const predictiveInsights = await getPredictiveInsights(calculatedScores)
      setInsights(predictiveInsights)
    } catch (error) {
      console.error("Failed to calculate lead scores:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-orange-600 bg-orange-100"
    return "text-red-600 bg-red-100"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Hot"
    if (score >= 60) return "Warm"
    return "Cold"
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Brain className="h-8 w-8 mx-auto mb-4 animate-pulse" />
          <p>Calculating lead scores...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Lead Scoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{scores.filter((s) => s.score >= 80).length}</div>
              <div className="text-sm text-gray-600">Hot Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {scores.filter((s) => s.score >= 60 && s.score < 80).length}
              </div>
              <div className="text-sm text-gray-600">Warm Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{scores.filter((s) => s.score < 60).length}</div>
              <div className="text-sm text-gray-600">Cold Leads</div>
            </div>
          </div>

          <div className="space-y-4">
            {scores.slice(0, 10).map((leadScore) => {
              const contact = contacts.find((c) => c.id === leadScore.contactId)
              if (!contact) return null

              return (
                <div key={leadScore.contactId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.company}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getScoreColor(leadScore.score)}>
                        {getScoreLabel(leadScore.score)} ({leadScore.score})
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round(leadScore.confidence * 100)}% confidence
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Demographic</div>
                      <Progress value={leadScore.factors.demographic} className="h-2" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Behavioral</div>
                      <Progress value={leadScore.factors.behavioral} className="h-2" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Engagement</div>
                      <Progress value={leadScore.factors.engagement} className="h-2" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Company</div>
                      <Progress value={leadScore.factors.company} className="h-2" />
                    </div>
                  </div>

                  {leadScore.recommendations.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs font-medium text-green-700 mb-1">Recommendations:</div>
                      <div className="text-xs text-green-600">{leadScore.recommendations.slice(0, 2).join(", ")}</div>
                    </div>
                  )}

                  {leadScore.riskFactors.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-red-700 mb-1">Risk Factors:</div>
                      <div className="text-xs text-red-600">{leadScore.riskFactors.slice(0, 2).join(", ")}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-4 text-center">
            <Button onClick={calculateScores} disabled={loading}>
              <Zap className="h-4 w-4 mr-2" />
              Recalculate Scores
            </Button>
          </div>
        </CardContent>
      </Card>

      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Predictive Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Revenue Forecast</h4>
                <div className="text-2xl font-bold text-green-600">${insights.revenueForcast?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Next 90 days</div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Conversion Probability</h4>
                <div className="text-2xl font-bold text-blue-600">{Math.round(insights.conversionRate * 100)}%</div>
                <div className="text-sm text-gray-600">Hot leads to customers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
