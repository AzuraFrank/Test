import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wejcgylojzxxgftzjeew.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlamNneWxvanp4eGdmdHpqZWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MzI2ODgsImV4cCI6MjA2NjUwODY4OH0.iSE-gDfdqpmSY4VBCeGJc22kJiLIh9lg3KW5FJwMxw8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schemas
export const DATABASE_TABLES = {
  USERS: "users",
  SONGS: "songs",
  PERFORMANCES: "performances",
  TOURNAMENTS: "tournaments",
  TOURNAMENT_PARTICIPANTS: "tournament_participants",
  PAYMENTS: "payments",
  SUBSCRIPTIONS: "subscriptions",
};

// Admin configuration
export const ADMIN_CONFIG = {
  ADMIN_EMAIL: "jesikamahjong@gmail.com",
  ADMIN_PASSWORD: "axis2019",
  PAYMENT_METHODS: {
    GOPAY: "0895340205302",
    WHATSAPP: "085810526151",
  },
};

// Price configuration (IDR)
export const PRICING = {
  BASIC: 1000,
  PREMIUM: 15000,
  VIP: 50000,
  TOURNAMENT_ENTRY: 5000,
};

export default supabase;
