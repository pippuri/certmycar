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
    };
  };
};
