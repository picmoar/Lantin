import { useState, useCallback } from 'react';

interface EventData {
  title: string;
  description: string;
  location: string;
  image: string;
  organizer_name: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  type: 'workshop' | 'exhibition' | 'gallery' | 'sale';
  price: number;
  max_attendees?: number;
  highlight_photos?: string[];
  latitude: number | null;
  longitude: number | null;
  formatted_address: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

interface UserProfile {
  name: string;
}

interface UseEventFormProps {
  userProfile: UserProfile;
  initialData?: Partial<EventData>;
  onSubmit: (eventData: EventData) => void;
  uploadToSupabase: (file: File, pathPrefix?: string, storageType?: string) => Promise<string>;
}

interface UseEventFormReturn {
  eventData: EventData;
  handleEventDataChange: (data: Partial<EventData>) => void;
  handleImageUpload: (file: File) => Promise<void>;
  handleHighlightsUpload: (files: FileList) => Promise<void>;
  handleRemoveHighlight: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const useEventForm = ({
  userProfile,
  initialData,
  onSubmit,
  uploadToSupabase
}: UseEventFormProps): UseEventFormReturn => {

  const [eventData, setEventData] = useState<EventData>({
    title: '',
    description: '',
    location: '',
    image: '',
    organizer_name: userProfile?.name || '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    type: 'workshop',
    price: 0,
    max_attendees: undefined,
    highlight_photos: [],
    latitude: null,
    longitude: null,
    formatted_address: '',
    ...initialData
  });

  // Helper function for updating event data
  const handleEventDataChange = useCallback((data: Partial<EventData>) => {
    setEventData(prev => ({ ...prev, ...data }));
  }, []);

  // Handle main image upload
  const handleImageUpload = useCallback(async (file: File) => {
    const imageUrl = await uploadToSupabase(file, 'main-', 'single');
    setEventData(prev => ({
      ...prev,
      image: imageUrl,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    }));
  }, [uploadToSupabase]);

  // Handle highlight photos upload
  const handleHighlightsUpload = useCallback(async (files: FileList) => {
    const uploadPromises = Array.from(files).map(file =>
      uploadToSupabase(file, 'highlight-', 'highlight')
    );
    const uploadedUrls = await Promise.all(uploadPromises);
    setEventData(prev => ({
      ...prev,
      highlight_photos: [...(prev.highlight_photos || []), ...uploadedUrls]
    }));
  }, [uploadToSupabase]);

  // Remove highlight photo
  const handleRemoveHighlight = useCallback((index: number) => {
    setEventData(prev => ({
      ...prev,
      highlight_photos: prev.highlight_photos?.filter((_, i) => i !== index) || []
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(eventData);
  }, [eventData, onSubmit]);

  return {
    eventData,
    handleEventDataChange,
    handleImageUpload,
    handleHighlightsUpload,
    handleRemoveHighlight,
    handleSubmit
  };
};