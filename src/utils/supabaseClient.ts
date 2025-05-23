
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://azphpzwalortrhrzqfou.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6cGhwendhbG9ydHJocnpxZm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyOTA0MjksImV4cCI6MjA2Mjg2NjQyOX0.ifa77hwBseuo9OUtsNuN78RXMeDx3cmx_fEUBIWXA0g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
