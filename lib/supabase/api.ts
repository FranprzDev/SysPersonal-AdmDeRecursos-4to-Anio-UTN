import { createClient } from "@supabase/supabase-js"

/**
 * Cliente de Supabase para API Routes
 * No usa cookies, solo para consultas a la base de datos
 */
export function createApiClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
