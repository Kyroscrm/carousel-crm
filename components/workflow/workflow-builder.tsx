"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Pause, Settings, Trash2, ArrowRight } from "lucide-react"
import { useWorkflows } from "@/hooks/use-workflows"

interface WorkflowStep {
  id: string
  type: "trigger" | "condition" | "action" | "delay"
  config: any
  position: { x: number; y: number }
}

interface WorkflowBuilder {
  id?: string
  name: string
  description: string
  steps: WorkflowStep[]
  active: boolean
}

export function WorkflowBuilder() {
  const { workflows, createWorkflow, updateWorkflow } = useWorkflows()
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowBuilder>({
    name: "",
    description: "",
    steps: [],
    active: false,
  })
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null)
  const [showStepConfig, setShowStepConfig] = useState(false)

  const triggerTypes = [
    { value: "contact_created", label: "Contact Created" },
    { value: "deal_stage_changed", label: "Deal Stage Changed" },
    { value: "email_opened", label: "Email Opened" },
    { value: "form_submitted", label: "Form Submitted" },
    { value: "date_reached", label: "Date Reached" },
  ]

  const actionTypes = [
    { value: "send_email", label: "Send Email" },
    { value: "create_task", label: "Create Task" },
    { value: "update_contact", label: "Update Contact" },
    { value: "add_to_list", label: "Add to List" },
    { value: "send_notification", label: "Send Notification" },
  ]

  const addStep = (type: WorkflowStep["type"]) => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      type,
      config: {},
      position: { x: currentWorkflow.steps.length * 200, y: 100 },
    }

    setCurrentWorkflow((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }))
  }

  const updateStep = (stepId: string, config: any) => {
    setCurrentWorkflow((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => (step.id === stepId ? { ...step, config } : step)),
    }))
  }

  const removeStep = (stepId: string) => {
    setCurrentWorkflow((prev) => ({
      ...prev,
      steps: prev.steps.filter((step) => step.id !== stepId),
    }))
  }

  const saveWorkflow = async () => {
    if (!currentWorkflow.name) return

    try {
      if (currentWorkflow.id) {
        await updateWorkflow(Number.parseInt(currentWorkflow.id), {
          name: currentWorkflow.name,
          description: currentWorkflow.description,
          status: currentWorkflow.active ? "active" : "paused",
          trigger: currentWorkflow.steps.find((s) => s.type === "trigger")?.config?.type || "manual",
          actions: currentWorkflow.steps.filter((s) => s.type === "action").length,
          lastRun: "Never",
          success: 100,
          icon: "zap",
        })
      } else {
        await createWorkflow({
          name: currentWorkflow.name,
          description: currentWorkflow.description,
          status: currentWorkflow.active ? "active" : "paused",
          trigger: currentWorkflow.steps.find((s) => s.type === "trigger")?.config?.type || "manual",
          actions: currentWorkflow.steps.filter((s) => s.type === "action").length,
          lastRun: "Never",
          success: 100,
          icon: "zap",
        })
      }

      // Reset form
      setCurrentWorkflow({
        name: "",
        description: "",
        steps: [],
        active: false,
      })
    } catch (error) {
      console.error("Failed to save workflow:", error)
    }
  }

  const renderStep = (step: WorkflowStep, index: number) => {
    const getStepIcon = () => {
      switch (step.type) {
        case "trigger":
          return "🎯"
        case "condition":
          return "❓"
        case "action":
          return "⚡"
        case "delay":
          return "⏰"
        default:
          return "📋"
      }
    }

    const getStepColor = () => {
      switch (step.type) {
        case "trigger":
          return "bg-blue-100 border-blue-300"
        case "condition":
          return "bg-yellow-100 border-yellow-300"
        case "action":
          return "bg-green-100 border-green-300"
        case "delay":
          return "bg-purple-100 border-purple-300"
        default:
          return "bg-gray-100 border-gray-300"
      }
    }

    return (
      <div key={step.id} className="flex items-center">
        <Card
          className={`w-48 cursor-pointer transition-all hover:shadow-md ${getStepColor()}`}
          onClick={() => {
            setSelectedStep(step)
            setShowStepConfig(true)
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{getStepIcon()}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  removeStep(step.id)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-sm font-medium capitalize">{step.type}</div>
            <div className="text-xs text-gray-600 mt-1">
              {step.config.type || step.config.action || "Not configured"}
            </div>
          </CardContent>
        </Card>

        {index < currentWorkflow.steps.length - 1 && <ArrowRight className="h-4 w-4 mx-4 text-gray-400" />}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workflow Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Workflow Name</label>
              <Input
                value={currentWorkflow.name}
                onChange={(e) => setCurrentWorkflow((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter workflow name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={currentWorkflow.description}
                onChange={(e) => setCurrentWorkflow((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this workflow does"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={() => addStep("trigger")} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Trigger
            </Button>
            <Button onClick={() => addStep("condition")} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
            <Button onClick={() => addStep("action")} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Action
            </Button>
            <Button onClick={() => addStep("delay")} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Delay
            </Button>
          </div>

          {currentWorkflow.steps.length > 0 && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center overflow-x-auto pb-4">
                {currentWorkflow.steps.map((step, index) => renderStep(step, index))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={currentWorkflow.active}
                onChange={(e) => setCurrentWorkflow((prev) => ({ ...prev, active: e.target.checked }))}
              />
              <label htmlFor="active" className="text-sm">
                Activate workflow immediately
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentWorkflow({ name: "", description: "", steps: [], active: false })}
              >
                Clear
              </Button>
              <Button onClick={saveWorkflow} disabled={!currentWorkflow.name || currentWorkflow.steps.length === 0}>
                Save Workflow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Configuration Modal */}
      {showStepConfig && selectedStep && (
        <Card>
          <CardHeader>
            <CardTitle>Configure {selectedStep.type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedStep.type === "trigger" && (
              <div>
                <label className="text-sm font-medium">Trigger Type</label>
                <Select
                  value={selectedStep.config.type || ""}
                  onValueChange={(value) => updateStep(selectedStep.id, { ...selectedStep.config, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map((trigger) => (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        {trigger.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedStep.type === "action" && (
              <div>
                <label className="text-sm font-medium">Action Type</label>
                <Select
                  value={selectedStep.config.action || ""}
                  onValueChange={(value) => updateStep(selectedStep.id, { ...selectedStep.config, action: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionTypes.map((action) => (
                      <SelectItem key={action.value} value={action.value}>
                        {action.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedStep.type === "delay" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input
                    type="number"
                    value={selectedStep.config.duration || ""}
                    onChange={(e) => updateStep(selectedStep.id, { ...selectedStep.config, duration: e.target.value })}
                    placeholder="Enter duration"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Unit</label>
                  <Select
                    value={selectedStep.config.unit || ""}
                    onValueChange={(value) => updateStep(selectedStep.id, { ...selectedStep.config, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowStepConfig(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowStepConfig(false)}>Save Configuration</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Workflows */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">{workflow.name}</h3>
                  <p className="text-sm text-gray-600">{workflow.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={workflow.status === "active" ? "default" : "secondary"}>{workflow.status}</Badge>
                    <span className="text-xs text-gray-500">{workflow.actions} actions</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    {workflow.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
