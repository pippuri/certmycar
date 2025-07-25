import { createBrowserClient } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type CookieOptions } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}

// Service role client for admin operations (bypasses RLS)
export function createServiceRoleSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() { return undefined; },
        set() {},
        remove() {},
      },
    }
  );
}

// Database type definitions (will be generated later)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          stripe_customer_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          stripe_customer_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
        };
      };
      assessments: {
        Row: {
          id: string;
          tesla_vin: string;
          battery_health: "Good" | "Fair" | "Poor";
          degradation_pct: number;
          assessment_date: string;
          user_id: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          tesla_vin: string;
          battery_health: "Good" | "Fair" | "Poor";
          degradation_pct: number;
          assessment_date?: string;
          user_id?: string | null;
          user_agent?: string | null;
        };
        Update: {
          id?: string;
          tesla_vin?: string;
          battery_health?: "Good" | "Fair" | "Poor";
          degradation_pct?: number;
          assessment_date?: string;
          user_id?: string | null;
          user_agent?: string | null;
        };
      };
      certificates: {
        Row: {
          id: string;
          certificate_id: string;
          tesla_vin: string;
          vehicle_name: string;
          vehicle_model: string;
          vehicle_trim: string;
          vehicle_year: number;
          odometer_miles: number | null;
          software_version: string | null;
          battery_health_data: Record<string, unknown>;
          battery_data: Record<string, unknown>;
          is_paid: boolean;
          customer_email: string | null;
          stripe_session_id: string | null;
          paid_at: string | null;
          created_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          certificate_id: string;
          tesla_vin: string;
          vehicle_name: string;
          vehicle_model?: string;
          vehicle_trim?: string;
          vehicle_year?: number;
          odometer_miles?: number | null;
          software_version?: string | null;
          battery_health_data: Record<string, unknown>;
          battery_data: Record<string, unknown>;
          is_paid?: boolean;
          customer_email?: string | null;
          stripe_session_id?: string | null;
          paid_at?: string | null;
          created_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          certificate_id?: string;
          tesla_vin?: string;
          vehicle_name?: string;
          vehicle_model?: string;
          vehicle_trim?: string;
          vehicle_year?: number;
          odometer_miles?: number | null;
          software_version?: string | null;
          battery_health_data?: Record<string, unknown>;
          battery_data?: Record<string, unknown>;
          is_paid?: boolean;
          customer_email?: string | null;
          stripe_session_id?: string | null;
          paid_at?: string | null;
          created_at?: string;
          user_id?: string | null;
        };
      };
      stripe_products: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          description: string | null;
          locale: string;
          price_id: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          description?: string | null;
          locale: string;
          price_id: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          description?: string | null;
          locale?: string;
          price_id?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
