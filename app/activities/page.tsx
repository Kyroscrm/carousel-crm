'use client';

import { ActivitiesCalendar } from '@/components/activities/activities-calendar';
import { ActivitiesFilters } from '@/components/activities/activities-filters';
import { ActivitiesHeader } from '@/components/activities/activities-header';
import { ActivitiesList } from '@/components/activities/activities-list';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

export default function ActivitiesPage() {
  const [filters, setFilters] = useState({
    types: [],
    statuses: [],
    priorities: [],
  });
  return (
    <DashboardLayout>
      <div className="flex-1 w-full h-full overflow-auto">
        <div className="w-full max-w-none space-y-6 p-6">
          <ActivitiesHeader />
          <Tabs defaultValue="list" className="space-y-6 w-full">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-0 w-full">
              <div className="flex gap-6 w-full min-h-0">
                <div className="w-64 flex-shrink-0">
                  <ActivitiesFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <ActivitiesList filters={filters} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-0 w-full">
              <ActivitiesCalendar />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
