'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import {
  Deal,
  DealWithRelations,
  formatCurrency,
  PipelineStage,
} from '@/lib/deals';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { MoreVertical, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CreateDealForm } from './create-deal-form';
import { DealCard } from './deal-card';
import { DealDetailsModal } from './deal-details-modal';
import { PipelineColumn } from './pipeline-column';

interface PipelineBoardProps {
  pipelineId: string;
  stages: PipelineStage[];
  deals: DealWithRelations[];
  onDealMove: (dealId: string, newStage: string) => Promise<void>;
  onDealUpdate: (deal: DealWithRelations) => Promise<void>;
  onDealDelete: (dealId: string) => Promise<void>;
  onDealCreate: (deal: Partial<Deal>) => Promise<void>;
  isLoading?: boolean;
}

export function PipelineBoard({
  pipelineId,
  stages,
  deals,
  onDealMove,
  onDealUpdate,
  onDealDelete,
  onDealCreate,
  isLoading = false,
}: PipelineBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<DealWithRelations | null>(
    null
  );
  const [showDealDetails, setShowDealDetails] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group deals by stage
  const dealsByStage = useMemo(() => {
    const grouped: Record<string, DealWithRelations[]> = {};

    // Initialize all stages with empty arrays
    stages.forEach(stage => {
      grouped[stage.id] = [];
    });

    // Group deals by their stage
    deals.forEach(deal => {
      const stageId = deal.stage || 'unassigned';
      if (!grouped[stageId]) {
        grouped[stageId] = [];
      }
      grouped[stageId].push(deal);
    });

    return grouped;
  }, [deals, stages]);

  // Calculate stage statistics
  const stageStats = useMemo(() => {
    const stats: Record<
      string,
      { count: number; value: number; probability: number }
    > = {};

    stages.forEach(stage => {
      const stageDeals = dealsByStage[stage.id] || [];
      const totalValue = stageDeals.reduce(
        (sum, deal) => sum + (deal.value || 0),
        0
      );
      const avgProbability =
        stageDeals.length > 0
          ? stageDeals.reduce((sum, deal) => sum + (deal.probability || 0), 0) /
            stageDeals.length
          : 0;

      stats[stage.id] = {
        count: stageDeals.length,
        value: totalValue,
        probability: avgProbability,
      };
    });

    return stats;
  }, [dealsByStage, stages]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const dealId = active.id as string;
    const newStageId = over.id as string;

    // Find the deal being moved
    const deal = deals.find(d => d.id === dealId);
    if (!deal) {
      setActiveId(null);
      return;
    }

    // If the stage hasn't changed, do nothing
    if (deal.stage === newStageId) {
      setActiveId(null);
      return;
    }

    try {
      await onDealMove(dealId, newStageId);
      toast({
        title: 'Deal moved',
        description: `Deal moved to ${
          stages.find(s => s.id === newStageId)?.name || newStageId
        }`,
      });
    } catch (error) {
      console.error('Error moving deal:', error);
      toast({
        title: 'Error',
        description: 'Failed to move deal. Please try again.',
        variant: 'destructive',
      });
    }

    setActiveId(null);
  };

  const handleCreateDeal = (stageId: string) => {
    setSelectedStage(stageId);
    setShowCreateDialog(true);
  };

  const handleDealClick = (deal: DealWithRelations) => {
    setSelectedDeal(deal);
    setShowDealDetails(true);
  };

  const activeDeal = activeId ? deals.find(d => d.id === activeId) : null;

  return (
    <div className="h-full flex flex-col">
      {/* Pipeline Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Sales Pipeline</h2>
          <Badge variant="secondary">{deals.length} deals</Badge>
          <Badge variant="outline">
            {formatCurrency(
              deals.reduce((sum, deal) => sum + (deal.value || 0), 0)
            )}
          </Badge>
        </div>
        <Button
          onClick={() => handleCreateDeal(stages[0]?.id || '')}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Deal
        </Button>
      </div>

      {/* Pipeline Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full min-w-max">
            {stages.map(stage => (
              <div key={stage.id} className="flex flex-col w-80">
                {/* Stage Header */}
                <Card className="mb-4">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle
                        className="text-sm font-medium"
                        style={{ color: stage.color }}
                      >
                        {stage.name}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleCreateDeal(stage.id)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Deal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Stage Stats */}
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>{stageStats[stage.id]?.count || 0} deals</span>
                        <span>
                          {formatCurrency(stageStats[stage.id]?.value || 0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Probability:</span>
                        <Progress
                          value={stage.probability}
                          className="h-1 flex-1"
                        />
                        <span>{stage.probability}%</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Droppable Stage Column */}
                <PipelineColumn
                  id={stage.id}
                  deals={dealsByStage[stage.id] || []}
                  onDealClick={handleDealClick}
                  onAddDeal={() => handleCreateDeal(stage.id)}
                  isLoading={isLoading}
                />
              </div>
            ))}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeDeal ? (
              <DealCard deal={activeDeal} onClick={() => {}} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Create Deal Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Deal</DialogTitle>
            <DialogDescription>
              Add a new deal to your pipeline
            </DialogDescription>
          </DialogHeader>
          <CreateDealForm
            pipelineId={pipelineId}
            initialStage={selectedStage || ''}
            stages={stages}
            onSubmit={async dealData => {
              await onDealCreate(dealData);
              setShowCreateDialog(false);
              toast({
                title: 'Deal created',
                description: 'New deal has been added to your pipeline',
              });
            }}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Deal Details Modal */}
      {selectedDeal && (
        <DealDetailsModal
          deal={selectedDeal}
          stages={stages}
          open={showDealDetails}
          onOpenChange={setShowDealDetails}
          onUpdate={onDealUpdate}
          onDelete={onDealDelete}
        />
      )}
    </div>
  );
}
