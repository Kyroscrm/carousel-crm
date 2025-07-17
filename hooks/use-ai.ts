"use client"

import { useState } from "react"

interface LeadScoringInput {
  demographic: {
    jobTitle: string
    company: string
    industry: string
    location?: string
  }
  behavioral: {
    emailOpens: number
    linkClicks: number
    pageViews: number
    timeOnSite: number
  }
  engagement: {
    lastActivity: string
    responseRate: number
    meetingsScheduled: number
    emailsSent: number
  }
  company: {
    size: number
    revenue: number
    growth: number
    technology: string[]
  }
}

interface LeadScoringOutput {
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

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateLeadScore = async (input: LeadScoringInput): Promise<LeadScoringOutput> => {
    setLoading(true)
    try {
      // Simulate AI calculation with weighted scoring
      const demographicScore = calculateDemographicScore(input.demographic)
      const behavioralScore = calculateBehavioralScore(input.behavioral)
      const engagementScore = calculateEngagementScore(input.engagement)
      const companyScore = calculateCompanyScore(input.company)

      const totalScore = Math.round(
        demographicScore * 0.25 + behavioralScore * 0.3 + engagementScore * 0.25 + companyScore * 0.2,
      )

      const confidence = Math.min(
        0.95,
        Math.max(0.6, (demographicScore + behavioralScore + engagementScore + companyScore) / 400),
      )

      const recommendations = generateRecommendations(totalScore, input)
      const riskFactors = identifyRiskFactors(input)

      return {
        score: totalScore,
        confidence,
        factors: {
          demographic: demographicScore,
          behavioral: behavioralScore,
          engagement: engagementScore,
          company: companyScore,
        },
        recommendations,
        riskFactors,
      }
    } catch (err) {
      setError("Failed to calculate lead score")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const calculateDemographicScore = (demographic: LeadScoringInput["demographic"]): number => {
    let score = 50 // Base score

    // Job title scoring
    const seniorTitles = ["VP", "Director", "Manager", "Head", "Chief"]
    if (seniorTitles.some((title) => demographic.jobTitle.includes(title))) {
      score += 20
    }

    // Industry scoring
    const highValueIndustries = ["Technology", "Finance", "Healthcare", "Manufacturing"]
    if (highValueIndustries.includes(demographic.industry)) {
      score += 15
    }

    // Company size (inferred from title and company name)
    if (demographic.company.length > 10) {
      score += 10
    }

    return Math.min(100, score)
  }

  const calculateBehavioralScore = (behavioral: LeadScoringInput["behavioral"]): number => {
    let score = 0

    // Email engagement
    score += Math.min(30, behavioral.emailOpens * 3)
    score += Math.min(20, behavioral.linkClicks * 4)

    // Website engagement
    score += Math.min(25, behavioral.pageViews * 1.25)
    score += Math.min(25, behavioral.timeOnSite / 12) // 300 seconds = 25 points

    return Math.min(100, score)
  }

  const calculateEngagementScore = (engagement: LeadScoringInput["engagement"]): number => {
    let score = 0

    // Response rate
    score += engagement.responseRate * 40

    // Meeting activity
    score += Math.min(30, engagement.meetingsScheduled * 10)

    // Email frequency
    score += Math.min(20, engagement.emailsSent * 2)

    // Recency bonus
    const daysSinceActivity = Math.floor(
      (Date.now() - new Date(engagement.lastActivity).getTime()) / (1000 * 60 * 60 * 24),
    )
    if (daysSinceActivity <= 7) score += 10
    else if (daysSinceActivity <= 30) score += 5

    return Math.min(100, score)
  }

  const calculateCompanyScore = (company: LeadScoringInput["company"]): number => {
    let score = 0

    // Company size
    if (company.size > 500) score += 25
    else if (company.size > 100) score += 20
    else if (company.size > 50) score += 15
    else score += 10

    // Revenue
    if (company.revenue > 10000000) score += 25
    else if (company.revenue > 1000000) score += 20
    else if (company.revenue > 100000) score += 15
    else score += 10

    // Growth rate
    score += Math.min(25, company.growth * 50)

    // Technology stack
    const relevantTech = ["CRM", "Sales Tools", "Marketing Automation"]
    const techMatches = company.technology.filter((tech) =>
      relevantTech.some((relevant) => tech.includes(relevant)),
    ).length
    score += Math.min(25, techMatches * 8)

    return Math.min(100, score)
  }

  const generateRecommendations = (score: number, input: LeadScoringInput): string[] => {
    const recommendations: string[] = []

    if (score >= 80) {
      recommendations.push("Schedule immediate follow-up call")
      recommendations.push("Send personalized proposal")
      recommendations.push("Prioritize in daily activities")
    } else if (score >= 60) {
      recommendations.push("Send targeted content")
      recommendations.push("Schedule discovery call")
      recommendations.push("Add to nurture sequence")
    } else {
      recommendations.push("Continue nurturing with valuable content")
      recommendations.push("Monitor engagement patterns")
      recommendations.push("Qualify further before investing time")
    }

    // Specific recommendations based on factors
    if (input.behavioral.emailOpens < 2) {
      recommendations.push("Improve email subject lines")
    }
    if (input.engagement.responseRate < 0.3) {
      recommendations.push("Try different communication channels")
    }

    return recommendations
  }

  const identifyRiskFactors = (input: LeadScoringInput): string[] => {
    const risks: string[] = []

    if (input.behavioral.emailOpens === 0) {
      risks.push("No email engagement")
    }
    if (input.engagement.responseRate < 0.1) {
      risks.push("Very low response rate")
    }
    if (input.company.growth < 0) {
      risks.push("Company in decline")
    }

    const daysSinceActivity = Math.floor(
      (Date.now() - new Date(input.engagement.lastActivity).getTime()) / (1000 * 60 * 60 * 24),
    )
    if (daysSinceActivity > 30) {
      risks.push("Long period of inactivity")
    }

    return risks
  }

  const getPredictiveInsights = async (scores: any[]): Promise<any> => {
    setLoading(true)
    try {
      const hotLeads = scores.filter((s) => s.score >= 80)
      const warmLeads = scores.filter((s) => s.score >= 60 && s.score < 80)

      // Simulate predictive calculations
      const avgDealValue = 15000 // This would come from historical data
      const conversionRate = hotLeads.length > 0 ? 0.35 : 0.15
      const revenueForcast = hotLeads.length * avgDealValue * 0.35 + warmLeads.length * avgDealValue * 0.15

      return {
        revenueForcast,
        conversionRate,
        hotLeadsCount: hotLeads.length,
        warmLeadsCount: warmLeads.length,
        totalOpportunityValue: scores.length * avgDealValue * 0.25,
      }
    } catch (err) {
      setError("Failed to generate insights")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const generateSmartRecommendations = async (contactId: number): Promise<string[]> => {
    // This would integrate with OpenAI API in production
    return [
      "Send follow-up email about pricing discussion",
      "Schedule product demo for next week",
      "Share case study from similar company",
      "Connect on LinkedIn and engage with their content",
    ]
  }

  return {
    loading,
    error,
    calculateLeadScore,
    getPredictiveInsights,
    generateSmartRecommendations,
  }
}
