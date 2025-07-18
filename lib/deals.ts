import { supabase } from '@/lib/supabase';

export interface PipelineStage {
  id: string;
  name: string;
  probability: number;
  color: string;
  order?: number;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  stages: PipelineStage[];
  is_default?: boolean;
  is_active?: boolean;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Deal {
  id: string;
  title: string;
  description?: string;
  value?: number;
  currency?: string;
  stage: string;
  status?: string;
  probability?: number;
  close_date?: string;
  pipeline_id?: string;
  contact_id?: string;
  company_id?: string;
  owner_id?: string;
  tags?: string[];
  custom_fields?: any;
  created_at?: string;
  updated_at?: string;
  last_activity?: string;
}

export interface DealWithRelations extends Deal {
  contact?: any;
  company?: any;
  owner?: any;
  assigned_to?: any;
}

// Pipeline Management Functions
export async function getPipelines(): Promise<Pipeline[]> {
  const { data, error } = await supabase
    .from('pipelines')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching pipelines:', error);
    throw new Error('Failed to fetch pipelines');
  }

  return (data || []).map(pipeline => ({
    id: pipeline.id,
    name: pipeline.name,
    description: pipeline.description,
    stages: Array.isArray(pipeline.stages)
      ? (pipeline.stages as PipelineStage[])
      : [],
    is_default: pipeline.is_default,
    is_active: pipeline.is_active,
    organization_id: pipeline.organization_id,
    created_at: pipeline.created_at,
    updated_at: pipeline.updated_at,
  }));
}

export async function getDefaultPipeline(): Promise<Pipeline | null> {
  const { data, error } = await supabase
    .from('pipelines')
    .select('*')
    .eq('is_default', true)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching default pipeline:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    stages: Array.isArray(data.stages) ? (data.stages as PipelineStage[]) : [],
    is_default: data.is_default,
    is_active: data.is_active,
    organization_id: data.organization_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function createPipeline(
  pipeline: Partial<Pipeline>
): Promise<Pipeline> {
  const { data, error } = await supabase
    .from('pipelines')
    .insert({
      name: pipeline.name!,
      description: pipeline.description,
      stages: pipeline.stages as any,
      is_default: pipeline.is_default || false,
      is_active: pipeline.is_active !== false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating pipeline:', error);
    throw new Error('Failed to create pipeline');
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    stages: Array.isArray(data.stages) ? (data.stages as PipelineStage[]) : [],
    is_default: data.is_default,
    is_active: data.is_active,
    organization_id: data.organization_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

// Deal Management Functions
export async function getDeals(
  pipelineId?: string
): Promise<DealWithRelations[]> {
  let query = supabase
    .from('deals')
    .select(
      `
      *,
      contact:contacts(*),
      company:companies(*),
      owner:profiles!deals_owner_id_fkey(*)
    `
    )
    .order('created_at', { ascending: false });

  if (pipelineId) {
    query = query.eq('pipeline_id', pipelineId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching deals:', error);
    throw new Error('Failed to fetch deals');
  }

  return (data || []) as DealWithRelations[];
}

export async function getDealsByStage(
  pipelineId: string
): Promise<Record<string, DealWithRelations[]>> {
  const deals = await getDeals(pipelineId);

  const dealsByStage: Record<string, DealWithRelations[]> = {};

  deals.forEach(deal => {
    const stage = deal.stage || 'unassigned';
    if (!dealsByStage[stage]) {
      dealsByStage[stage] = [];
    }
    dealsByStage[stage].push(deal);
  });

  return dealsByStage;
}

export async function createDeal(
  deal: Partial<Deal>
): Promise<DealWithRelations> {
  // Get default pipeline if none specified
  if (!deal.pipeline_id) {
    const defaultPipeline = await getDefaultPipeline();
    if (defaultPipeline) {
      deal.pipeline_id = defaultPipeline.id;
      // Set to first stage if no stage specified
      if (!deal.stage && defaultPipeline.stages.length > 0) {
        deal.stage = defaultPipeline.stages[0].id;
      }
    }
  }

  const { data, error } = await supabase
    .from('deals')
    .insert({
      title: deal.title!,
      description: deal.description,
      value: deal.value,
      currency: deal.currency || 'USD',
      stage: deal.stage!,
      status: deal.status || 'active',
      probability: deal.probability,
      close_date: deal.close_date,
      pipeline_id: deal.pipeline_id,
      contact_id: deal.contact_id,
      company_id: deal.company_id,
      owner_id: deal.owner_id,
      tags: deal.tags,
      custom_fields: deal.custom_fields,
    })
    .select(
      `
      *,
      contact:contacts(*),
      company:companies(*),
      owner:profiles!deals_owner_id_fkey(*)
    `
    )
    .single();

  if (error) {
    console.error('Error creating deal:', error);
    throw new Error('Failed to create deal');
  }

  return data as DealWithRelations;
}

export async function updateDeal(
  dealId: string,
  updates: Partial<Deal>
): Promise<DealWithRelations> {
  const { data, error } = await supabase
    .from('deals')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', dealId)
    .select(
      `
      *,
      contact:contacts(*),
      company:companies(*),
      owner:profiles!deals_owner_id_fkey(*)
    `
    )
    .single();

  if (error) {
    console.error('Error updating deal:', error);
    throw new Error('Failed to update deal');
  }

  return data as DealWithRelations;
}

export async function moveDeal(
  dealId: string,
  newStage: string
): Promise<DealWithRelations> {
  return updateDeal(dealId, {
    stage: newStage,
    updated_at: new Date().toISOString(),
  });
}

export async function deleteDeal(dealId: string): Promise<void> {
  const { error } = await supabase.from('deals').delete().eq('id', dealId);

  if (error) {
    console.error('Error deleting deal:', error);
    throw new Error('Failed to delete deal');
  }
}

// Deal Statistics and Forecasting
export async function getDealStats(pipelineId?: string) {
  let query = supabase
    .from('deals')
    .select('value, stage, status, probability');

  if (pipelineId) {
    query = query.eq('pipeline_id', pipelineId);
  }

  const { data: deals, error } = await query;

  if (error) {
    console.error('Error fetching deal stats:', error);
    throw new Error('Failed to fetch deal statistics');
  }

  const dealsArray = deals || [];
  const totalDeals = dealsArray.length;
  const totalValue = dealsArray.reduce(
    (sum, deal) => sum + (deal.value || 0),
    0
  );
  const wonDeals = dealsArray.filter(deal => deal.status === 'won').length;
  const lostDeals = dealsArray.filter(deal => deal.status === 'lost').length;
  const activeDeals = dealsArray.filter(
    deal => deal.status !== 'won' && deal.status !== 'lost'
  );

  const averageDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;
  const winRate =
    wonDeals + lostDeals > 0 ? (wonDeals / (wonDeals + lostDeals)) * 100 : 0;

  // Forecast based on probability
  const forecastValue = activeDeals.reduce((sum, deal) => {
    const probability = deal.probability || 0;
    const value = deal.value || 0;
    return sum + value * (probability / 100);
  }, 0);

  return {
    totalValue,
    totalDeals,
    wonDeals,
    lostDeals,
    averageDealSize,
    winRate,
    forecastValue,
  };
}

// Real-time subscriptions
export function subscribeToDealChanges(
  pipelineId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`deals:pipeline:${pipelineId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'deals',
        filter: `pipeline_id=eq.${pipelineId}`,
      },
      callback
    )
    .subscribe();
}

// Utility functions
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function getDealProbabilityColor(probability: number): string {
  if (probability >= 80) return 'text-green-600';
  if (probability >= 60) return 'text-blue-600';
  if (probability >= 40) return 'text-yellow-600';
  if (probability >= 20) return 'text-orange-600';
  return 'text-red-600';
}

export function getStageColor(
  stageId: string,
  stages: PipelineStage[]
): string {
  const stage = stages.find(s => s.id === stageId);
  return stage?.color || '#6b7280';
}
