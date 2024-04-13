'use client';

import { createBrowserClient } from '@supabase/ssr';

import { Database } from '@/supabase/database.types';

export function createBrowserAnonClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
