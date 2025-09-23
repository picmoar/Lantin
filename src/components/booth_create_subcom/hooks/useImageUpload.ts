interface AuthUser {
  id?: string;
}

interface UseImageUploadReturn {
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, onImageUpdate: (data: any) => void) => Promise<void>;
  handleHighlightPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>, currentPhotos: string[] | undefined, onPhotosUpdate: (photos: string[]) => void) => Promise<void>;
  removeHighlightPhoto: (index: number, currentPhotos: string[] | undefined, onPhotosUpdate: (photos: string[]) => void) => void;
}

export const useImageUpload = (supabase: any, user: AuthUser): UseImageUploadReturn => {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, onImageUpdate: (data: any) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      console.log('🏪 Image upload - supabase:', !!supabase, 'user:', user, 'user.id:', user?.id);

      // Check if we have Supabase and should attempt cloud upload
      if (supabase && user?.id) {
        // Verify we have a valid session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('🏪 Session check:', { session: !!session, sessionUser: !!session?.user, error: sessionError });

        if (session && session.user) {
          // Real user with valid Supabase session - try cloud upload
          console.log('📤 Attempting Supabase booth storage upload...');
          console.log('📤 Session user ID:', session.user.id);
          console.log('📤 File details:', { name: file.name, size: file.size, type: file.type });

          const fileExt = file.name.split('.').pop();
          const fileName = `${session.user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          console.log('📤 Upload filename:', fileName);

          const { data, error } = await supabase.storage
            .from('booth')
            .upload(fileName, file);

          if (error) {
            console.error('Upload error:', error);
            throw new Error(`Failed to upload ${file.name}: ${error.message}`);
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('booth')
            .getPublicUrl(fileName);

          onImageUpdate({
            image: publicUrl,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
          });
          console.log(`✅ Uploaded booth image to Supabase storage`);
          return;
        }
      }

      // Fallback to local URLs (demo user, no session, or RLS issues)
      console.log('📱 Using local file URL (demo mode or no valid session)');
      const fileUrl = URL.createObjectURL(file);
      onImageUpdate({
        image: fileUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      console.log('📱 Created local object URL for booth image');

    } catch (error) {
      console.error('Upload error:', error);

      // If cloud upload fails, fallback to local URLs
      console.log('🔄 Cloud upload failed, falling back to local URL...');
      const fileUrl = URL.createObjectURL(file);
      onImageUpdate({
        image: fileUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      alert(`Cloud upload failed, using local image instead. Error: ${error.message}`);
    }
  };

  const handleHighlightPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>, currentPhotos: string[] | undefined, onPhotosUpdate: (photos: string[]) => void) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      // Check if we have Supabase and should attempt cloud upload
      if (supabase && user?.id) {
        // Verify we have a valid session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (session && session.user) {
          // Real user with valid Supabase session - try cloud upload
          console.log('📤 Attempting Supabase booth storage upload for highlights...');

          const uploadPromises = Array.from(files).slice(0, 4).map(async (file, i) => {
            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${session.user.id}/highlights/${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

            // Upload to Supabase storage
            const { data, error } = await supabase.storage
              .from('booth')
              .upload(fileName, file);

            if (error) {
              console.error('Upload error:', error);
              throw new Error(`Failed to upload ${file.name}: ${error.message}`);
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('booth')
              .getPublicUrl(fileName);

            return publicUrl;
          });

          const uploadedUrls = await Promise.all(uploadPromises);
          const newPhotos = [...(currentPhotos || []), ...uploadedUrls];
          onPhotosUpdate(newPhotos);
          console.log(`✅ Uploaded ${uploadedUrls.length} highlight images to Supabase booth storage`);
          return;
        }
      }

      // Fallback to local URLs (demo user, no session, or RLS issues)
      console.log('📱 Using local file URLs for highlights (demo mode or no valid session)');
      const fileUrls = Array.from(files).slice(0, 4).map(file => {
        return URL.createObjectURL(file);
      });

      const newPhotos = [...(currentPhotos || []), ...fileUrls];
      onPhotosUpdate(newPhotos);

      console.log(`📱 Created ${fileUrls.length} local object URLs for highlight images`);

    } catch (error) {
      console.error('Upload error:', error);

      // If cloud upload fails, fallback to local URLs
      console.log('🔄 Cloud upload failed, falling back to local URLs...');
      const fileUrls = Array.from(files).slice(0, 4).map(file => {
        return URL.createObjectURL(file);
      });

      const newPhotos = [...(currentPhotos || []), ...fileUrls];
      onPhotosUpdate(newPhotos);

      alert(`Cloud upload failed, using local images instead. Error: ${error.message}`);
    }
  };

  const removeHighlightPhoto = (index: number, currentPhotos: string[] | undefined, onPhotosUpdate: (photos: string[]) => void) => {
    const newPhotos = [...(currentPhotos || [])];
    newPhotos.splice(index, 1);
    onPhotosUpdate(newPhotos);
  };

  return {
    handleImageUpload,
    handleHighlightPhotosUpload,
    removeHighlightPhoto
  };
};