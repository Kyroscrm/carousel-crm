'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  DealWithRelations,
  PipelineStage,
  formatCurrency,
  getDealProbabilityColor,
} from '@/lib/deals';
import { format } from 'date-fns';
import {
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Edit3,
  Mail,
  Percent,
  Phone,
  Save,
  Tag,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface DealDetailsModalProps {
  deal: DealWithRelations;
  stages: PipelineStage[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (deal: DealWithRelations) => Promise<void>;
  onDelete: (dealId: string) => Promise<void>;
}

export function DealDetailsModal({
  deal,
  stages,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: DealDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedDeal, setEditedDeal] = useState(deal);

  const handleEdit = () => {
    setEditedDeal(deal);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedDeal(deal);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdate(editedDeal);
      setIsEditing(false);
      toast({
        title: 'Deal updated',
        description: 'Deal details have been saved successfully',
      });
    } catch (error) {
      console.error('Error updating deal:', error);
      toast({
        title: 'Error',
        description: 'Failed to update deal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(deal.id);
      onOpenChange(false);
      toast({
        title: 'Deal deleted',
        description: 'Deal has been permanently deleted',
      });
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete deal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedDeal(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const currentStage = stages.find(s => s.id === deal.stage);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl">
                {isEditing ? (
                  <Input
                    value={editedDeal.title}
                    onChange={e => handleFieldChange('title', e.target.value)}
                    className="text-xl font-semibold"
                    disabled={isLoading}
                  />
                ) : (
                  deal.title
                )}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-2">
                {currentStage && (
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor: currentStage.color + '20',
                      color: currentStage.color,
                    }}
                  >
                    {currentStage.name}
                  </Badge>
                )}
                {deal.status && deal.status !== 'active' && (
                  <Badge
                    variant={
                      deal.status === 'won'
                        ? 'default'
                        : deal.status === 'lost'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                  </Badge>
                )}
              </DialogDescription>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleEdit}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Deal</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this deal? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={isLoading}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-medium">Deal Value</span>
                  </div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={editedDeal.value || ''}
                        onChange={e =>
                          handleFieldChange(
                            'value',
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        disabled={isLoading}
                      />
                      <Select
                        value={editedDeal.currency || 'USD'}
                        onValueChange={value =>
                          handleFieldChange('currency', value)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold">
                      {deal.value
                        ? formatCurrency(deal.value, deal.currency)
                        : 'Not set'}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Percent className="h-4 w-4" />
                    <span className="text-sm font-medium">Win Probability</span>
                  </div>
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editedDeal.probability || ''}
                      onChange={e =>
                        handleFieldChange(
                          'probability',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      disabled={isLoading}
                    />
                  ) : (
                    <p
                      className={`text-2xl font-bold ${getDealProbabilityColor(
                        deal.probability || 0
                      )}`}
                    >
                      {deal.probability || 0}%
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-orange-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Close Date</span>
                  </div>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedDeal.close_date || ''}
                      onChange={e =>
                        handleFieldChange('close_date', e.target.value)
                      }
                      disabled={isLoading}
                    />
                  ) : (
                    <p className="text-lg font-semibold">
                      {deal.close_date
                        ? format(new Date(deal.close_date), 'MMM dd, yyyy')
                        : 'Not set'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact & Company Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info */}
              {deal.contact && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Primary Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={deal.contact.avatar_url || ''} />
                        <AvatarFallback>
                          {deal.contact.first_name?.[0]}
                          {deal.contact.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {deal.contact.first_name} {deal.contact.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {deal.contact.title}
                        </p>
                      </div>
                    </div>

                    {deal.contact.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        <span>{deal.contact.email}</span>
                      </div>
                    )}

                    {deal.contact.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        <span>{deal.contact.phone}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Company Info */}
              {deal.company && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Company
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">{deal.company.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {deal.company.industry}
                      </p>
                    </div>

                    {deal.company.website && (
                      <div className="text-sm">
                        <a
                          href={deal.company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {deal.company.website}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Description</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedDeal.description || ''}
                    onChange={e =>
                      handleFieldChange('description', e.target.value)
                    }
                    placeholder="Add deal description..."
                    className="min-h-24"
                    disabled={isLoading}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {deal.description || 'No description provided'}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {/* Pipeline Stage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pipeline Stage</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Select
                    value={editedDeal.stage}
                    onValueChange={value => handleFieldChange('stage', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                ) : (
                  currentStage && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: currentStage.color }}
                      />
                      <span>{currentStage.name}</span>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {deal.tags && deal.tags.length > 0 ? (
                    deal.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No tags added
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>
                    {deal.created_at
                      ? format(
                          new Date(deal.created_at),
                          "MMM dd, yyyy 'at' HH:mm"
                        )
                      : 'Unknown'}
                  </span>
                </div>
                {deal.updated_at && deal.updated_at !== deal.created_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>
                      {format(
                        new Date(deal.updated_at),
                        "MMM dd, yyyy 'at' HH:mm"
                      )}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Activity tracking will be available in a future update
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
