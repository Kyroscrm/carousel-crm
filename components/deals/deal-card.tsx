'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  DealWithRelations,
  formatCurrency,
  getDealProbabilityColor,
} from '@/lib/deals';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import {
  Building2,
  Calendar,
  DollarSign,
  MoreVertical,
  Percent,
  User,
} from 'lucide-react';

interface DealCardProps {
  deal: DealWithRelations;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isDragging?: boolean;
}

export function DealCard({
  deal,
  onClick,
  onEdit,
  onDelete,
  isDragging = false,
}: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({
    id: deal.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isActuallyDragging = isDragging || sortableIsDragging;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'cursor-pointer hover:shadow-md transition-all',
        isActuallyDragging && 'opacity-50 shadow-lg rotate-3',
        'relative group'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{deal.title}</h4>
            {deal.company && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Building2 className="h-3 w-3" />
                <span className="truncate">{deal.company.name}</span>
              </div>
            )}
          </div>

          {!isActuallyDragging && onEdit && onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={e => e.stopPropagation()}
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  Edit Deal
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-destructive"
                >
                  Delete Deal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-2">
        {/* Deal Value */}
        {deal.value && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="font-semibold text-sm">
              {formatCurrency(deal.value, deal.currency)}
            </span>
          </div>
        )}

        {/* Deal Probability */}
        {deal.probability !== undefined && (
          <div className="flex items-center gap-2">
            <Percent className="h-3 w-3 text-blue-600" />
            <span
              className={cn(
                'text-xs font-medium',
                getDealProbabilityColor(deal.probability)
              )}
            >
              {deal.probability}% probability
            </span>
          </div>
        )}

        {/* Close Date */}
        {deal.close_date && (
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-orange-600" />
            <span className="text-xs text-muted-foreground">
              {format(new Date(deal.close_date), 'MMM dd, yyyy')}
            </span>
          </div>
        )}

        {/* Contact */}
        {deal.contact && (
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-purple-600" />
            <span className="text-xs text-muted-foreground truncate">
              {deal.contact.first_name} {deal.contact.last_name}
            </span>
          </div>
        )}

        {/* Owner */}
        {deal.owner && (
          <div className="flex items-center gap-2 pt-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={deal.owner.avatar_url || ''} />
              <AvatarFallback className="text-xs">
                {deal.owner.first_name?.[0]}
                {deal.owner.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {deal.owner.first_name} {deal.owner.last_name}
            </span>
          </div>
        )}

        {/* Tags */}
        {deal.tags && deal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {deal.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {deal.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{deal.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Status Badge */}
        {deal.status && deal.status !== 'active' && (
          <div className="pt-1">
            <Badge
              variant={
                deal.status === 'won'
                  ? 'default'
                  : deal.status === 'lost'
                  ? 'destructive'
                  : 'secondary'
              }
              className="text-xs"
            >
              {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
