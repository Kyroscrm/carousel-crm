'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { PipelineBoard } from '@/components/deals/pipeline-board';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  createDeal,
  Deal,
  DealWithRelations,
  deleteDeal,
  getDeals,
  getDefaultPipeline,
  moveDeal,
  PipelineStage,
  subscribeToDealChanges,
  updateDeal,
} from '@/lib/deals';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DealsPage() {
  const [pipeline, setPipeline] = useState<{
    id: string;
    stages: PipelineStage[];
  } | null>(null);
  const [deals, setDeals] = useState<DealWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadPipelineData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get default pipeline
        const defaultPipeline = await getDefaultPipeline();
        if (!defaultPipeline) {
          // If no default pipeline exists, create one
          const defaultStages: PipelineStage[] = [
            { id: 'lead', name: 'Lead', probability: 10, color: '#6b7280' },
            {
              id: 'qualified',
              name: 'Qualified',
              probability: 25,
              color: '#3b82f6',
            },
            {
              id: 'proposal',
              name: 'Proposal',
              probability: 50,
              color: '#f59e0b',
            },
            {
              id: 'negotiation',
              name: 'Negotiation',
              probability: 75,
              color: '#f97316',
            },
            {
              id: 'closed-won',
              name: 'Closed Won',
              probability: 100,
              color: '#10b981',
            },
            {
              id: 'closed-lost',
              name: 'Closed Lost',
              probability: 0,
              color: '#ef4444',
            },
          ];

          // This would normally create a pipeline in the database
          // For now, we'll use a mock pipeline
          setPipeline({
            id: 'default',
            stages: defaultStages,
          });
        } else {
          setPipeline({
            id: defaultPipeline.id,
            stages: defaultPipeline.stages,
          });
        }

        // Load deals for the pipeline
        const pipelineDeals = defaultPipeline
          ? await getDeals(defaultPipeline.id)
          : [];
        setDeals(pipelineDeals);
      } catch (err) {
        console.error('Error loading pipeline data:', err);
        setError(
          'Failed to load pipeline data. Please try refreshing the page.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPipelineData();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!pipeline) return;

    const subscription = subscribeToDealChanges(pipeline.id, payload => {
      console.log('Real-time deal update:', payload);

      if (payload.eventType === 'INSERT') {
        setDeals(prev => [...prev, payload.new]);
      } else if (payload.eventType === 'UPDATE') {
        setDeals(prev =>
          prev.map(deal => (deal.id === payload.new.id ? payload.new : deal))
        );
      } else if (payload.eventType === 'DELETE') {
        setDeals(prev => prev.filter(deal => deal.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pipeline]);

  // Deal management handlers
  const handleDealMove = async (dealId: string, newStage: string) => {
    try {
      const updatedDeal = await moveDeal(dealId, newStage);
      setDeals(prev =>
        prev.map(deal => (deal.id === dealId ? updatedDeal : deal))
      );
    } catch (error) {
      console.error('Error moving deal:', error);
      throw error; // Re-throw to let PipelineBoard handle the error display
    }
  };

  const handleDealUpdate = async (updatedDeal: DealWithRelations) => {
    try {
      const result = await updateDeal(updatedDeal.id, updatedDeal);
      setDeals(prev =>
        prev.map(deal => (deal.id === updatedDeal.id ? result : deal))
      );
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    }
  };

  const handleDealCreate = async (dealData: Partial<Deal>) => {
    try {
      if (!pipeline) return;

      const newDeal = await createDeal({
        ...dealData,
        pipeline_id: pipeline.id,
      });
      setDeals(prev => [newDeal, ...prev]);
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  };

  const handleDealDelete = async (dealId: string) => {
    try {
      await deleteDeal(dealId);
      setDeals(prev => prev.filter(deal => deal.id !== dealId));
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  if (isLoading || !pipeline) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Pipeline Skeleton */}
          <div className="flex gap-6 overflow-x-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="w-80 flex-shrink-0">
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-24 mb-4" />
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className="h-24 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full">
        <PipelineBoard
          pipelineId={pipeline.id}
          stages={pipeline.stages}
          deals={deals}
          onDealMove={handleDealMove}
          onDealUpdate={handleDealUpdate}
          onDealDelete={handleDealDelete}
          onDealCreate={handleDealCreate}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}
