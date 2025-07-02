import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jklgcoahekvihhhluqus.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGdjb2FoZWt2aWhoaGx1cXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzgxNzAsImV4cCI6MjA2Njk1NDE3MH0.KEv-mT35m1dYkUjrF3xQ7WXt6UrOY5k0iTYmVhe54IM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: sessionStorage, // ✅ this makes session expire on tab/browser close
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
  