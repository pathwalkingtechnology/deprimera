import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const bucketName = process.env.SUPABASE_BUCKET_NAME;
const bucketUrl = process.env.SUPABASE_BUCKET_URL;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL no está definido");
}

if (!supabaseKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY no está definido");
}

if (!bucketName) {
  throw new Error("SUPABASE_BUCKET_NAME no está definido");
}

if (!bucketUrl) {
  throw new Error("SUPABASE_BUCKET_URL no está definido");
}

export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseKey);

export const bucket = {
  name: bucketName,
  url: bucketUrl,
};
