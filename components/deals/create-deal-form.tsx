'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Deal, PipelineStage } from '@/lib/deals';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const dealSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  value: z.number().min(0, 'Value must be positive').optional(),
  currency: z.string().default('USD'),
  stage: z.string().min(1, 'Stage is required'),
  status: z.enum(['active', 'won', 'lost', 'on-hold']).default('active'),
  probability: z.number().min(0).max(100).optional(),
  close_date: z.string().optional(),
  contact_id: z.string().optional(),
  company_id: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

type DealFormData = z.infer<typeof dealSchema>;

interface CreateDealFormProps {
  pipelineId: string;
  initialStage: string;
  stages: PipelineStage[];
  onSubmit: (deal: Partial<Deal>) => Promise<void>;
  onCancel: () => void;
}

export function CreateDealForm({
  pipelineId,
  initialStage,
  stages,
  onSubmit,
  onCancel,
}: CreateDealFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const form = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      stage: initialStage,
      currency: 'USD',
      status: 'active',
      tags: [],
    },
  });

  const watchedStage = form.watch('stage');
  const watchedTags = form.watch('tags');

  // Auto-set probability based on selected stage
  const handleStageChange = (stageId: string) => {
    form.setValue('stage', stageId);
    const stage = stages.find(s => s.id === stageId);
    if (stage) {
      form.setValue('probability', stage.probability);
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !watchedTags.includes(trimmedTag)) {
      form.setValue('tags', [...watchedTags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      'tags',
      watchedTags.filter(tag => tag !== tagToRemove)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (data: DealFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        pipeline_id: pipelineId,
        close_date: data.close_date || undefined,
        value: data.value || undefined,
        probability: data.probability || undefined,
      });
    } catch (error) {
      console.error('Error creating deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deal Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter deal title..."
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pipeline Stage *</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={handleStageChange}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {stages.map(stage => (
                      <SelectItem key={stage.id} value={stage.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: stage.color }}
                          />
                          {stage.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Deal Value */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Deal Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    onChange={e =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Probability and Close Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="probability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Win Probability (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="50"
                    {...field}
                    onChange={e =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="close_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Close Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deal description, notes, or requirements..."
                  className="min-h-20"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {watchedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  disabled={isSubmitting}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add tag..."
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addTag}
              disabled={!tagInput.trim() || isSubmitting}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Deal'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
