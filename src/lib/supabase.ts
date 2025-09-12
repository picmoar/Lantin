import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a safe client that doesn't throw errors
let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase connected successfully');
  } catch (error) {
    console.warn('⚠️ Supabase connection failed:', error);
  }
} else {
  console.warn('⚠️ Supabase environment variables not found. Using mock data only.');
}

export { supabase };

// Helper functions for common operations
export const uploadImage = async (file: File, bucket: string, path: string) => {
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  
  if (error) throw error
  return data
}

export const getImageUrl = (bucket: string, path: string) => {
  if (!supabase) return '/placeholder.png';
  
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}