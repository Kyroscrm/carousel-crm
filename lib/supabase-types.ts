export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      activities: {
        Row: {
          assigned_to: string | null;
          company_id: string | null;
          completed_at: string | null;
          contact_id: string | null;
          created_at: string | null;
          deal_id: string | null;
          description: string | null;
          duration: number | null;
          id: string;
          organization_id: string | null;
          outcome: string | null;
          owner_id: string | null;
          priority: string | null;
          scheduled_at: string | null;
          status: string | null;
          title: string;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          assigned_to?: string | null;
          company_id?: string | null;
          completed_at?: string | null;
          contact_id?: string | null;
          created_at?: string | null;
          deal_id?: string | null;
          description?: string | null;
          duration?: number | null;
          id?: string;
          organization_id?: string | null;
          outcome?: string | null;
          owner_id?: string | null;
          priority?: string | null;
          scheduled_at?: string | null;
          status?: string | null;
          title: string;
          type: string;
          updated_at?: string | null;
        };
        Update: {
          assigned_to?: string | null;
          company_id?: string | null;
          completed_at?: string | null;
          contact_id?: string | null;
          created_at?: string | null;
          deal_id?: string | null;
          description?: string | null;
          duration?: number | null;
          id?: string;
          organization_id?: string | null;
          outcome?: string | null;
          owner_id?: string | null;
          priority?: string | null;
          scheduled_at?: string | null;
          status?: string | null;
          title?: string;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'activities_assigned_to_fkey';
            columns: ['assigned_to'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'activities_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'activities_contact_id_fkey';
            columns: ['contact_id'];
            isOneToOne: false;
            referencedRelation: 'contacts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'activities_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deals';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'activities_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'activities_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      companies: {
        Row: {
          address: Json | null;
          created_at: string | null;
          custom_fields: Json | null;
          description: string | null;
          domain: string | null;
          employee_count: number | null;
          id: string;
          industry: string | null;
          last_activity: string | null;
          name: string;
          organization_id: string | null;
          owner_id: string | null;
          parent_company_id: string | null;
          phone: string | null;
          revenue: number | null;
          size: string | null;
          status: string | null;
          tags: string[] | null;
          updated_at: string | null;
          website: string | null;
        };
        Insert: {
          address?: Json | null;
          created_at?: string | null;
          custom_fields?: Json | null;
          description?: string | null;
          domain?: string | null;
          employee_count?: number | null;
          id?: string;
          industry?: string | null;
          last_activity?: string | null;
          name: string;
          organization_id?: string | null;
          owner_id?: string | null;
          parent_company_id?: string | null;
          phone?: string | null;
          revenue?: number | null;
          size?: string | null;
          status?: string | null;
          tags?: string[] | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Update: {
          address?: Json | null;
          created_at?: string | null;
          custom_fields?: Json | null;
          description?: string | null;
          domain?: string | null;
          employee_count?: number | null;
          id?: string;
          industry?: string | null;
          last_activity?: string | null;
          name?: string;
          organization_id?: string | null;
          owner_id?: string | null;
          parent_company_id?: string | null;
          phone?: string | null;
          revenue?: number | null;
          size?: string | null;
          status?: string | null;
          tags?: string[] | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'companies_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'companies_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'companies_parent_company_id_fkey';
            columns: ['parent_company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          }
        ];
      };
      contacts: {
        Row: {
          address: Json | null;
          avatar_url: string | null;
          company_id: string | null;
          created_at: string | null;
          custom_fields: Json | null;
          email: string | null;
          first_name: string;
          id: string;
          is_favorite: boolean | null;
          last_activity: string | null;
          last_name: string;
          lead_score: number | null;
          mobile: string | null;
          organization_id: string | null;
          owner_id: string | null;
          phone: string | null;
          social_profiles: Json | null;
          source: string | null;
          status: string | null;
          tags: string[] | null;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          address?: Json | null;
          avatar_url?: string | null;
          company_id?: string | null;
          created_at?: string | null;
          custom_fields?: Json | null;
          email?: string | null;
          first_name: string;
          id?: string;
          is_favorite?: boolean | null;
          last_activity?: string | null;
          last_name: string;
          lead_score?: number | null;
          mobile?: string | null;
          organization_id?: string | null;
          owner_id?: string | null;
          phone?: string | null;
          social_profiles?: Json | null;
          source?: string | null;
          status?: string | null;
          tags?: string[] | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          address?: Json | null;
          avatar_url?: string | null;
          company_id?: string | null;
          created_at?: string | null;
          custom_fields?: Json | null;
          email?: string | null;
          first_name?: string;
          id?: string;
          is_favorite?: boolean | null;
          last_activity?: string | null;
          last_name?: string;
          lead_score?: number | null;
          mobile?: string | null;
          organization_id?: string | null;
          owner_id?: string | null;
          phone?: string | null;
          social_profiles?: Json | null;
          source?: string | null;
          status?: string | null;
          tags?: string[] | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'contacts_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'contacts_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'contacts_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      deals: {
        Row: {
          close_date: string | null;
          company_id: string | null;
          contact_id: string | null;
          created_at: string | null;
          currency: string | null;
          custom_fields: Json | null;
          description: string | null;
          id: string;
          last_activity: string | null;
          lost_reason: string | null;
          organization_id: string | null;
          owner_id: string | null;
          pipeline_id: string | null;
          probability: number | null;
          stage: string;
          status: string | null;
          tags: string[] | null;
          title: string;
          updated_at: string | null;
          value: number | null;
        };
        Insert: {
          close_date?: string | null;
          company_id?: string | null;
          contact_id?: string | null;
          created_at?: string | null;
          currency?: string | null;
          custom_fields?: Json | null;
          description?: string | null;
          id?: string;
          last_activity?: string | null;
          lost_reason?: string | null;
          organization_id?: string | null;
          owner_id?: string | null;
          pipeline_id?: string | null;
          probability?: number | null;
          stage: string;
          status?: string | null;
          tags?: string[] | null;
          title: string;
          updated_at?: string | null;
          value?: number | null;
        };
        Update: {
          close_date?: string | null;
          company_id?: string | null;
          contact_id?: string | null;
          created_at?: string | null;
          currency?: string | null;
          custom_fields?: Json | null;
          description?: string | null;
          id?: string;
          last_activity?: string | null;
          lost_reason?: string | null;
          organization_id?: string | null;
          owner_id?: string | null;
          pipeline_id?: string | null;
          probability?: number | null;
          stage?: string;
          status?: string | null;
          tags?: string[] | null;
          title?: string;
          updated_at?: string | null;
          value?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'deals_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deals_contact_id_fkey';
            columns: ['contact_id'];
            isOneToOne: false;
            referencedRelation: 'contacts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deals_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deals_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deals_pipeline_id_fkey';
            columns: ['pipeline_id'];
            isOneToOne: false;
            referencedRelation: 'pipelines';
            referencedColumns: ['id'];
          }
        ];
      };
      organizations: {
        Row: {
          created_at: string | null;
          domain: string | null;
          id: string;
          is_active: boolean | null;
          max_users: number | null;
          name: string;
          plan: string | null;
          settings: Json | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          domain?: string | null;
          id?: string;
          is_active?: boolean | null;
          max_users?: number | null;
          name: string;
          plan?: string | null;
          settings?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          domain?: string | null;
          id?: string;
          is_active?: boolean | null;
          max_users?: number | null;
          name?: string;
          plan?: string | null;
          settings?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      pipelines: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean | null;
          is_default: boolean | null;
          name: string;
          organization_id: string | null;
          stages: Json;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_default?: boolean | null;
          name: string;
          organization_id?: string | null;
          stages: Json;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_default?: boolean | null;
          name?: string;
          organization_id?: string | null;
          stages?: Json;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'pipelines_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          department: string | null;
          email: string;
          first_name: string | null;
          id: string;
          is_active: boolean | null;
          language: string | null;
          last_login: string | null;
          last_name: string | null;
          location: string | null;
          organization_id: string | null;
          phone: string | null;
          preferences: Json | null;
          role: string | null;
          timezone: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          department?: string | null;
          email: string;
          first_name?: string | null;
          id: string;
          is_active?: boolean | null;
          language?: string | null;
          last_login?: string | null;
          last_name?: string | null;
          location?: string | null;
          organization_id?: string | null;
          phone?: string | null;
          preferences?: Json | null;
          role?: string | null;
          timezone?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          department?: string | null;
          email?: string;
          first_name?: string | null;
          id?: string;
          is_active?: boolean | null;
          language?: string | null;
          last_login?: string | null;
          last_name?: string | null;
          location?: string | null;
          organization_id?: string | null;
          phone?: string | null;
          preferences?: Json | null;
          role?: string | null;
          timezone?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_current_user_organization_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
      DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] &
      DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
