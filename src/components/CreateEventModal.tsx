import React from 'react';
import {
  ModalHeader,
  EventBasicInfoSection,
  EventLocationSection,
  EventScheduleSection,
  EventDetailsSection,
  EventImageUploadSection,
  EventHighlightsSection,
  useGooglePlaces,
  useFileUpload,
  useEventForm
} from './event_modal_subcom';
import * as formStyles from './event_modal_subcom/styles/formStyles';

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
  bio: string;
  location: string;
  specialty: string;
  profileImage: string;
}

interface AuthUser {
  id?: string;
}

interface CreateEventModalProps {
  onClose: () => void;
  onSubmit: (eventData: EventData) => void;
  userProfile: UserProfile;
  supabase: any;
  user: AuthUser;
  initialData?: Partial<EventData>;
  isEditing?: boolean;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  onClose,
  onSubmit,
  userProfile,
  supabase,
  user,
  initialData,
  isEditing = false
}) => {
  // Use shared form styles
  const styles = formStyles;

  // Custom hooks for logic separation
  const { uploadToSupabase } = useFileUpload({ supabase, user });

  const {
    eventData,
    handleEventDataChange,
    handleImageUpload,
    handleHighlightsUpload,
    handleRemoveHighlight,
    handleSubmit
  } = useEventForm({
    userProfile,
    initialData,
    onSubmit,
    uploadToSupabase
  });

  const {
    showLocationPicker,
    setShowLocationPicker,
    predictions,
    locationInputRef,
    handleLocationInputChange,
    handleLocationSelect,
    getCurrentLocation
  } = useGooglePlaces({
    eventData,
    setEventData: (data: EventData) => handleEventDataChange(data)
  });





  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '480px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <ModalHeader isEditing={isEditing} onClose={onClose} />

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          <EventBasicInfoSection
            eventData={eventData}
            onEventDataChange={handleEventDataChange}
            styles={styles}
          />

          <EventLocationSection
            eventData={eventData}
            onEventDataChange={handleEventDataChange}
            locationInputRef={locationInputRef}
            showLocationPicker={showLocationPicker}
            setShowLocationPicker={setShowLocationPicker}
            predictions={predictions}
            handleLocationInputChange={handleLocationInputChange}
            handleLocationSelect={handleLocationSelect}
            getCurrentLocation={getCurrentLocation}
            styles={styles}
          />

          <EventScheduleSection
            eventData={eventData}
            onEventDataChange={handleEventDataChange}
            styles={styles}
          />

          <EventDetailsSection
            eventData={eventData}
            onEventDataChange={handleEventDataChange}
            styles={styles}
          />

          <EventImageUploadSection
            image={eventData.image}
            fileName={eventData.fileName}
            onImageUpload={handleImageUpload}
            styles={styles}
          />

          <EventHighlightsSection
            highlightPhotos={eventData.highlight_photos || []}
            onHighlightsUpload={handleHighlightsUpload}
            onRemoveHighlight={handleRemoveHighlight}
            styles={styles}
          />

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            {isEditing ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;