"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Zap, ExternalLink } from "lucide-react"

export function IntegrationsSettings() {
  const availableIntegrations = [
    {
      id: "slack",
      name: "Slack",
      description: "Get notifications and updates in your Slack workspace",
      icon: "💬",
      connected: true,
      category: "Communication",
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Sync your activities and meetings with Google Calendar",
      icon: "📅",
      connected: false,
      category: "Calendar",
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Sync contacts with your Mailchimp audience",
      icon: "📧",
      connected: true,
      category: "Email Marketing",
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Connect with 5000+ apps through Zapier automation",
      icon: "⚡",
      connected: false,
      category: "Automation",
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Sync data with your HubSpot CRM",
      icon: "🔄",
      connected: false,
      category: "CRM",
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Track payments and invoices from Stripe",
      icon: "💳",
      connected: true,
      category: "Payments",
    },
  ]

  const handleToggleIntegration = (integrationId: string, connected: boolean) => {
    console.log(`${connected ? "Disconnecting" : "Connecting"} ${integrationId}`)
  }

  const groupedIntegrations = availableIntegrations.reduce(
    (acc, integration) => {
      if (!acc[integration.category]) {
        acc[integration.category] = []
      }
      acc[integration.category].push(integration)
      return acc
    },
    {} as Record<string, typeof availableIntegrations>,
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Available Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedIntegrations).map(([category, integrations]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4">{category}</h3>
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{integration.icon}</div>
                        <div>
                          <h4 className="font-medium">{integration.name}</h4>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={integration.connected ? "secondary" : "outline"}>
                          {integration.connected ? "Connected" : "Available"}
                        </Badge>
                        {integration.connected ? (
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                            <Switch
                              checked={integration.connected}
                              onCheckedChange={(checked) =>
                                handleToggleIntegration(integration.id, integration.connected)
                              }
                            />
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleToggleIntegration(integration.id, integration.connected)}
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">API Key</h4>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-white border rounded text-sm font-mono">
                sk_live_••••••••••••••••••••••••••••••••
              </code>
              <Button variant="outline" size="sm">
                Copy
              </Button>
              <Button variant="outline" size="sm">
                Regenerate
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Webhook URL</h4>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-gray-50 border rounded text-sm font-mono">
                https://api.yourcrm.com/webhooks/events
              </code>
              <Button variant="outline" size="sm">
                Copy
              </Button>
            </div>
          </div>

          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            View API Documentation
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
