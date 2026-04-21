export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      ai_audit_submissions: {
        Row: {
          after_hours_importance: string | null
          ai_impact_potential_grade: string | null
          ai_readiness_score: number
          annual_loss: number
          automation_readiness_grade: string | null
          avg_profit_per_customer: number
          clients_per_month: number
          company_name: string
          completed_full_audit: boolean | null
          contact_accessibility_grade: string | null
          created_at: string | null
          current_call_method: string
          customer_experience_grade: string | null
          customer_source_split: Json | null
          daily_loss: number
          email: string
          entry_path: string | null
          first_name: string
          followup_completion_rate: number | null
          ghl_sent: boolean | null
          ghl_sent_at: string | null
          id: string
          industry: string
          last_name: string
          lead_close_rate: number | null
          lead_conversion_grade: string | null
          lost_revenue_breakdown: Json | null
          messaging_preference_rate: number | null
          missed_calls_per_week: number
          monthly_loss: number
          monthly_website_leads: number | null
          new_customers_per_month: number | null
          overall_grade: string | null
          percent_from_website: number | null
          phone: string
          phone_preference: number | null
          quick_result_shown: boolean | null
          recommended_solutions: string[]
          recovery_calculations: Json | null
          roi_metrics: Json | null
          score_tier: string
          speed_of_followup: string | null
          text_preference: number | null
          total_customers_per_month: number | null
          traffic_estimate: number | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          visitor_lead_conversion: string | null
          website_analysis: Json | null
          website_knowledge: string | null
          website_url: string | null
          website_visits_per_month: number | null
        }
        Insert: {
          after_hours_importance?: string | null
          ai_impact_potential_grade?: string | null
          ai_readiness_score: number
          annual_loss: number
          automation_readiness_grade?: string | null
          avg_profit_per_customer: number
          clients_per_month?: number
          company_name: string
          completed_full_audit?: boolean | null
          contact_accessibility_grade?: string | null
          created_at?: string | null
          current_call_method: string
          customer_experience_grade?: string | null
          customer_source_split?: Json | null
          daily_loss: number
          email: string
          entry_path?: string | null
          first_name: string
          followup_completion_rate?: number | null
          ghl_sent?: boolean | null
          ghl_sent_at?: string | null
          id?: string
          industry: string
          last_name: string
          lead_close_rate?: number | null
          lead_conversion_grade?: string | null
          lost_revenue_breakdown?: Json | null
          messaging_preference_rate?: number | null
          missed_calls_per_week: number
          monthly_loss: number
          monthly_website_leads?: number | null
          new_customers_per_month?: number | null
          overall_grade?: string | null
          percent_from_website?: number | null
          phone: string
          phone_preference?: number | null
          quick_result_shown?: boolean | null
          recommended_solutions: string[]
          recovery_calculations?: Json | null
          roi_metrics?: Json | null
          score_tier: string
          speed_of_followup?: string | null
          text_preference?: number | null
          total_customers_per_month?: number | null
          traffic_estimate?: number | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_lead_conversion?: string | null
          website_analysis?: Json | null
          website_knowledge?: string | null
          website_url?: string | null
          website_visits_per_month?: number | null
        }
        Update: {
          after_hours_importance?: string | null
          ai_impact_potential_grade?: string | null
          ai_readiness_score?: number
          annual_loss?: number
          automation_readiness_grade?: string | null
          avg_profit_per_customer?: number
          clients_per_month?: number
          company_name?: string
          completed_full_audit?: boolean | null
          contact_accessibility_grade?: string | null
          created_at?: string | null
          current_call_method?: string
          customer_experience_grade?: string | null
          customer_source_split?: Json | null
          daily_loss?: number
          email?: string
          entry_path?: string | null
          first_name?: string
          followup_completion_rate?: number | null
          ghl_sent?: boolean | null
          ghl_sent_at?: string | null
          id?: string
          industry?: string
          last_name?: string
          lead_close_rate?: number | null
          lead_conversion_grade?: string | null
          lost_revenue_breakdown?: Json | null
          messaging_preference_rate?: number | null
          missed_calls_per_week?: number
          monthly_loss?: number
          monthly_website_leads?: number | null
          new_customers_per_month?: number | null
          overall_grade?: string | null
          percent_from_website?: number | null
          phone?: string
          phone_preference?: number | null
          quick_result_shown?: boolean | null
          recommended_solutions?: string[]
          recovery_calculations?: Json | null
          roi_metrics?: Json | null
          score_tier?: string
          speed_of_followup?: string | null
          text_preference?: number | null
          total_customers_per_month?: number | null
          traffic_estimate?: number | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_lead_conversion?: string | null
          website_analysis?: Json | null
          website_knowledge?: string | null
          website_url?: string | null
          website_visits_per_month?: number | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_category: string
          event_name: string
          id: string
          ip_address: string | null
          metadata: Json | null
          page_path: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_category?: string
          event_name: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_category?: string
          event_name?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string | null
          category: string
          content: string
          created_at: string
          excerpt: string
          external_id: string | null
          faq_schema: Json | null
          id: string
          image_url: string | null
          meta_description: string | null
          published_at: string | null
          read_time: string
          scheduled_at: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          source_url: string | null
          status: string
          title: string
          updated_at: string
          verification_notes: string | null
        }
        Insert: {
          author_name?: string | null
          category?: string
          content: string
          created_at?: string
          excerpt: string
          external_id?: string | null
          faq_schema?: Json | null
          id?: string
          image_url?: string | null
          meta_description?: string | null
          published_at?: string | null
          read_time?: string
          scheduled_at?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          source_url?: string | null
          status?: string
          title: string
          updated_at?: string
          verification_notes?: string | null
        }
        Update: {
          author_name?: string | null
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          external_id?: string | null
          faq_schema?: Json | null
          id?: string
          image_url?: string | null
          meta_description?: string | null
          published_at?: string | null
          read_time?: string
          scheduled_at?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          source_url?: string | null
          status?: string
          title?: string
          updated_at?: string
          verification_notes?: string | null
        }
        Relationships: []
      }
      call_logs: {
        Row: {
          caller_number: string | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          onboarding_id: string | null
          recording_url: string | null
          status: string | null
          summary: string | null
          user_id: string
        }
        Insert: {
          caller_number?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          onboarding_id?: string | null
          recording_url?: string | null
          status?: string | null
          summary?: string | null
          user_id: string
        }
        Update: {
          caller_number?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          onboarding_id?: string | null
          recording_url?: string | null
          status?: string | null
          summary?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_logs_onboarding_id_fkey"
            columns: ["onboarding_id"]
            isOneToOne: false
            referencedRelation: "customer_onboarding"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_onboarding: {
        Row: {
          business_hours: Json | null
          business_name: string | null
          completed_at: string | null
          created_at: string | null
          faq_entries: Json | null
          greeting_message: string | null
          id: string
          phone_number: string | null
          preferred_voice: string | null
          provisioning_status: string | null
          retell_agent_id: string | null
          services_offered: string[] | null
          signup_id: string | null
          updated_at: string | null
          user_id: string | null
          voicemail_enabled: boolean | null
        }
        Insert: {
          business_hours?: Json | null
          business_name?: string | null
          completed_at?: string | null
          created_at?: string | null
          faq_entries?: Json | null
          greeting_message?: string | null
          id?: string
          phone_number?: string | null
          preferred_voice?: string | null
          provisioning_status?: string | null
          retell_agent_id?: string | null
          services_offered?: string[] | null
          signup_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          voicemail_enabled?: boolean | null
        }
        Update: {
          business_hours?: Json | null
          business_name?: string | null
          completed_at?: string | null
          created_at?: string | null
          faq_entries?: Json | null
          greeting_message?: string | null
          id?: string
          phone_number?: string | null
          preferred_voice?: string | null
          provisioning_status?: string | null
          retell_agent_id?: string | null
          services_offered?: string[] | null
          signup_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          voicemail_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_onboarding_signup_id_fkey"
            columns: ["signup_id"]
            isOneToOne: false
            referencedRelation: "customer_signups"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_signups: {
        Row: {
          appointment_date: string | null
          appointment_notes: string | null
          appointment_scheduled: boolean | null
          average_calls_per_day: number | null
          company_name: string
          contact_name: string
          created_at: string
          current_phone_system: string | null
          email: string
          id: string
          industry: string | null
          payment_status: string
          phone: string
          plan_type: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string | null
          wants_call_first: boolean | null
        }
        Insert: {
          appointment_date?: string | null
          appointment_notes?: string | null
          appointment_scheduled?: boolean | null
          average_calls_per_day?: number | null
          company_name: string
          contact_name: string
          created_at?: string
          current_phone_system?: string | null
          email: string
          id?: string
          industry?: string | null
          payment_status?: string
          phone: string
          plan_type: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
          wants_call_first?: boolean | null
        }
        Update: {
          appointment_date?: string | null
          appointment_notes?: string | null
          appointment_scheduled?: boolean | null
          average_calls_per_day?: number | null
          company_name?: string
          contact_name?: string
          created_at?: string
          current_phone_system?: string | null
          email?: string
          id?: string
          industry?: string | null
          payment_status?: string
          phone?: string
          plan_type?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
          wants_call_first?: boolean | null
        }
        Relationships: []
      }
      edge_function_errors: {
        Row: {
          created_at: string
          error_message: string | null
          error_type: string
          function_name: string
          id: string
          metadata: Json | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          error_type: string
          function_name: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          error_type?: string
          function_name?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string | null
          file_size: number | null
          id: string
          metadata: Json | null
          thumbnail_url: string | null
          title: string | null
          type: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          thumbnail_url?: string | null
          title?: string | null
          type?: string
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          thumbnail_url?: string | null
          title?: string | null
          type?: string
          url?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          lead_magnet_sent: boolean
          source_page: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          lead_magnet_sent?: boolean
          source_page?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          lead_magnet_sent?: boolean
          source_page?: string | null
        }
        Relationships: []
      }
      payment_rate_limits: {
        Row: {
          attempt_count: number
          created_at: string
          first_attempt_at: string
          id: string
          ip_address: string
          last_attempt_at: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          first_attempt_at?: string
          id?: string
          ip_address: string
          last_attempt_at?: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          first_attempt_at?: string
          id?: string
          ip_address?: string
          last_attempt_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      qualification_submissions: {
        Row: {
          annual_lost_revenue: number | null
          annual_net_gain: number | null
          annual_recovered_revenue: number | null
          avg_project_value: number | null
          company_name: string
          contact_name: string | null
          created_at: string | null
          created_by_email: string | null
          current_call_method: string | null
          customer_acquisition_cost: number | null
          daily_lost_revenue: number | null
          email: string | null
          employee_count: string | null
          id: string
          inbound_calls_per_day: number | null
          industry: string | null
          is_high_value: boolean | null
          is_qualified: boolean | null
          lifetime_value: number | null
          location: string | null
          missed_calls_per_day: number | null
          monthly_lost_revenue: number | null
          monthly_net_gain: number | null
          monthly_recovered_revenue: number | null
          new_clients_per_month: number | null
          notes: string | null
          pain_points: string | null
          phone: string | null
          roi_percentage: number | null
          selected_pain_points: string[] | null
          services: string | null
          updated_at: string | null
        }
        Insert: {
          annual_lost_revenue?: number | null
          annual_net_gain?: number | null
          annual_recovered_revenue?: number | null
          avg_project_value?: number | null
          company_name: string
          contact_name?: string | null
          created_at?: string | null
          created_by_email?: string | null
          current_call_method?: string | null
          customer_acquisition_cost?: number | null
          daily_lost_revenue?: number | null
          email?: string | null
          employee_count?: string | null
          id?: string
          inbound_calls_per_day?: number | null
          industry?: string | null
          is_high_value?: boolean | null
          is_qualified?: boolean | null
          lifetime_value?: number | null
          location?: string | null
          missed_calls_per_day?: number | null
          monthly_lost_revenue?: number | null
          monthly_net_gain?: number | null
          monthly_recovered_revenue?: number | null
          new_clients_per_month?: number | null
          notes?: string | null
          pain_points?: string | null
          phone?: string | null
          roi_percentage?: number | null
          selected_pain_points?: string[] | null
          services?: string | null
          updated_at?: string | null
        }
        Update: {
          annual_lost_revenue?: number | null
          annual_net_gain?: number | null
          annual_recovered_revenue?: number | null
          avg_project_value?: number | null
          company_name?: string
          contact_name?: string | null
          created_at?: string | null
          created_by_email?: string | null
          current_call_method?: string | null
          customer_acquisition_cost?: number | null
          daily_lost_revenue?: number | null
          email?: string | null
          employee_count?: string | null
          id?: string
          inbound_calls_per_day?: number | null
          industry?: string | null
          is_high_value?: boolean | null
          is_qualified?: boolean | null
          lifetime_value?: number | null
          location?: string | null
          missed_calls_per_day?: number | null
          monthly_lost_revenue?: number | null
          monthly_net_gain?: number | null
          monthly_recovered_revenue?: number | null
          new_clients_per_month?: number | null
          notes?: string | null
          pain_points?: string | null
          phone?: string | null
          roi_percentage?: number | null
          selected_pain_points?: string[] | null
          services?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      website_scans: {
        Row: {
          created_at: string
          id: string
          ip_address: string
          scanned_at: string
          website_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address: string
          scanned_at?: string
          website_url: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string
          scanned_at?: string
          website_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_cron_history: { Args: never; Returns: undefined }
      cleanup_old_error_logs: { Args: never; Returns: undefined }
      cleanup_old_http_responses: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      cleanup_old_website_scans: { Args: never; Returns: undefined }
      get_blog_view_stats: { Args: { date_from?: string }; Returns: Json }
      get_funnel_stats: {
        Args: { date_from?: string }
        Returns: {
          stage: string
          unique_count: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
