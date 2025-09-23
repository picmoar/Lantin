import { useState } from 'react';

interface BoothData {
  name: string;
  description: string;
  location: string;
  image: string;
  operator_name: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
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
  bio: string;
  location: string;
  specialty: string;
  profileImage: string;
}

interface UseBoothFormReturn {
  boothData: BoothData;
  isSubmitting: boolean;
  setBoothData: (data: BoothData) => void;
  updateBoothData: (data: Partial<BoothData>) => void;
  handleSubmit: (e: React.FormEvent, onSubmit: (boothData: BoothData) => void) => Promise<void>;
}

export const useBoothForm = (initialData: Partial<BoothData> | undefined, userProfile: UserProfile): UseBoothFormReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [boothData, setBoothData] = useState<BoothData>(initialData || {
    name: '',
    description: '',
    location: '',
    image: '',
    operator_name: userProfile?.name || '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    highlight_photos: [],
    latitude: null,
    longitude: null,
    formatted_address: ''
  });

  const updateBoothData = (data: Partial<BoothData>) => {
    setBoothData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent, onSubmit: (boothData: BoothData) => void) => {
    e.preventDefault();

    if (isSubmitting) {
      console.log('🏪 Already submitting, preventing duplicate submission');
      return;
    }

    setIsSubmitting(true);
    console.log('🏪 Form submitted, calling onSubmit...');

    try {
      await onSubmit(boothData);
    } catch (error) {
      console.error('🏪 Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    boothData,
    isSubmitting,
    setBoothData,
    updateBoothData,
    handleSubmit
  };
};