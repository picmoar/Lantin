import React from 'react';

interface EventData {
  title: string;
  organizer_name: string;
  description: string;
}

interface EventBasicInfoSectionProps {
  eventData: EventData;
  onEventDataChange: (data: Partial<EventData>) => void;
  styles: {
    label: React.CSSProperties;
    input: React.CSSProperties;
    textarea: React.CSSProperties;
  };
}

export default function EventBasicInfoSection({
  eventData,
  onEventDataChange,
  styles
}: EventBasicInfoSectionProps) {
  return (
    <>
      {/* Basic Information */}
      <div>
        <label style={styles.label}>
          Event Title <span style={{color: '#ef4444'}}>*</span>
        </label>
        <input
          type="text"
          value={eventData.title}
          onChange={(e) => onEventDataChange({title: e.target.value})}
          placeholder="Amazing Art Workshop"
          required
          style={styles.input}
        />
      </div>

      <div>
        <label style={styles.label}>
          👤 Event Organizer <span style={{color: '#ef4444'}}>*</span>
        </label>
        <input
          type="text"
          value={eventData.organizer_name}
          onChange={(e) => onEventDataChange({organizer_name: e.target.value})}
          placeholder="Your name or organization"
          required
          style={styles.input}
        />
      </div>

      <div>
        <label style={styles.label}>
          Description
        </label>
        <textarea
          value={eventData.description}
          onChange={(e) => onEventDataChange({description: e.target.value})}
          placeholder="Describe your event and what participants can expect..."
          rows={3}
          style={styles.textarea}
        />
      </div>
    </>
  );
}