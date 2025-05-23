import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'https://zuctusbetucsmsywshyk.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Y3R1c2JldHVjc21zeXdzaHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5Nzk2OTcsImV4cCI6MjA2MzU1NTY5N30.bRqpoafCsCBO-8qgwLnkadXqZQPRPPbgmKH1C5yGRLo';

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);