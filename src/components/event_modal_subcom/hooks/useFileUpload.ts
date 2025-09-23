import { useCallback } from 'react';

interface AuthUser {
  id?: string;
}

interface UseFileUploadProps {
  supabase: any;
  user: AuthUser;
}

interface UseFileUploadReturn {
  uploadToSupabase: (file: File, pathPrefix?: string, storageType?: string) => Promise<string>;
}

export const useFileUpload = ({
  supabase,
  user
}: UseFileUploadProps): UseFileUploadReturn => {

  // Consolidated upload function to reduce code duplication
  const uploadToSupabase = useCallback(async (
    file: File,
    pathPrefix = '',
    storageType = 'single'
  ): Promise<string> => {
    try {
      // Check if we have Supabase and should attempt cloud upload
      if (supabase && user?.id) {
        // Verify we have a valid session first
        const { data: { session } } = await supabase.auth.getSession();

        if (session && session.user) {
          console.log(`📤 Attempting Supabase events storage upload${storageType === 'highlight' ? ' for highlights' : ''}...`);

          const fileExt = file.name.split('.').pop();
          const fileName = `${session.user.id}/${pathPrefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from('events')
            .upload(fileName, file);

          if (error) {
            throw new Error(`Failed to upload ${file.name}: ${error.message}`);
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('events')
            .getPublicUrl(fileName);

          console.log(`✅ Uploaded ${storageType} image to Supabase storage`);
          return publicUrl;
        }
      }

      // Fallback to local URLs
      console.log(`📱 Using local file URL${storageType === 'highlight' ? 's for highlights' : ''} (demo mode or no valid session)`);
      return URL.createObjectURL(file);

    } catch (error) {
      console.error('Upload error:', error);
      console.log('🔄 Cloud upload failed, falling back to local URL...');
      return URL.createObjectURL(file);
    }
  }, [supabase, user]);

  return {
    uploadToSupabase
  };
};