import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase admin client for server-side use (API routes, server actions).
 *
 * Uses the Service Role key, which bypasses RLS.
 * IMPORTANT: Never expose the service role key to the browser.
 */
export function createSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing environment variable: SUPABASE_URL");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
