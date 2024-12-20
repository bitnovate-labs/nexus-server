import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Initialize and Setup Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
