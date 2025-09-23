import { useState } from 'react';

export function useProfileEdit() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [forceRender, setForceRender] = useState(0);

  const toggleEdit = () => {
    console.log('toggleEdit called, current state:', isEditingProfile);
    setIsEditingProfile(!isEditingProfile);
    setForceRender(prev => prev + 1);
    console.log('toggleEdit setting to:', !isEditingProfile);
  };

  const openEdit = () => {
    setIsEditingProfile(true);
    setForceRender(prev => prev + 1);
  };

  const closeEdit = () => {
    setIsEditingProfile(false);
    setForceRender(prev => prev + 1);
  };

  return {
    isEditingProfile,
    forceRender,
    toggleEdit,
    openEdit,
    closeEdit,
    setIsEditingProfile
  };
}