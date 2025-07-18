'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DealWithRelations } from '@/lib/deals';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DollarSign, Plus } from 'lucide-react';
import { DealCard } from './deal-card';

interface PipelineColumnProps {
  id: string;
  deals: DealWithRelations[];
  onDealClick: (deal: DealWithRelations) => void;
  onAddDeal: () => void;
  isLoading?: boolean;
}

export function PipelineColumn({
  id,
  deals,
  onDealClick,
  onAddDeal,
  isLoading = false,
}: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        'flex-1 min-h-96 transition-colors',
        isOver && 'bg-muted/50 border-primary'
      )}
    >
      <CardContent className="p-4 space-y-3 h-full">
        <SortableContext
          items={deals.map(d => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {deals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                No deals in this stage
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddDeal}
                className="gap-2"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
                Add Deal
              </Button>
            </div>
          ) : (
            <>
              {deals.map(deal => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onClick={() => onDealClick(deal)}
                />
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddDeal}
                className="w-full gap-2 border-2 border-dashed"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
                Add Deal
              </Button>
            </>
          )}
        </SortableContext>
      </CardContent>
    </Card>
  );
}
