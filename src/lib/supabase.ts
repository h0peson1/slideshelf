import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-only Supabase admin client using the Service Role Key.
 * This client bypasses RLS and has full administrative control over PostgreSQL and Storage.
 * NEVER import this file into Client Components.
 */
export function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return createClient(supabaseUrl!, supabaseServiceRoleKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return false;
  }

  const url = supabaseUrl.trim().toLowerCase();
  const key = supabaseServiceRoleKey.trim().toLowerCase();

  // Guard against unconfigured or template placeholder values
  if (
    url === "" ||
    key === "" ||
    url.includes("your-project-id") ||
    url.includes("your-project.supabase.co") ||
    key.includes("your-supabase-service-role-key") ||
    key.includes("your-service-role-key")
  ) {
    return false;
  }

  return true;
}

