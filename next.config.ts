module.exports = {
  // Configuración de Next.js
  reactStrictMode: true,
  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vaahxtelpfefskctxiwr.supabase.co',
        pathname: '/storage/v1/object/public/product-images/**',
      },
      {
        protocol: 'https',
        hostname: 'maostore.com.ar',
      },
    ],
  },
  // Configuración de Supabase
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_BUCKET_NAME: process.env.SUPABASE_BUCKET_NAME,
    SUPABASE_BUCKET_URL: process.env.SUPABASE_BUCKET_URL,
  },
}

