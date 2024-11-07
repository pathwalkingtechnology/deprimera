import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const bucketName = process.env.SUPABASE_BUCKET_NAME;
const bucketUrl = process.env.SUPABASE_BUCKET_URL;

export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseKey);

export const bucket = {
  name: bucketName,
  url: bucketUrl,
};
