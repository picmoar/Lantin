import React from 'react';

interface EventData {
  type: 'workshop' | 'exhibition' | 'gallery' | 'sale';
  max_attendees?: number;
  price: number;
}

interface EventDetailsSectionProps {
  eventData: EventData;
  onEventDataChange: (data: Partial<EventData>) => void;
  styles: {
    label: React.CSSProperties;
    input: React.CSSProperties;
  };
}

export default function EventDetailsSection({
  eventData,
  onEventDataChange,
  styles
}: EventDetailsSectionProps) {
  const selectStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#f9fafb'
  };

  return (
    <>
      {/* Event Type and Max Attendees */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
        <div>
          <label style={styles.label}>
            Event Type
          </label>
          <select
            value={eventData.type}
            onChange={(e) => onEventDataChange({type: e.target.value as EventData['type']})}
            style={selectStyle}
          >
            <option value="workshop">🎨 Workshop</option>
            <option value="exhibition">🖼️ Exhibition</option>
            <option value="gallery">🏛️ Gallery Opening</option>
            <option value="sale">💰 Art Sale</option>
          </select>
        </div>
        <div>
          <label style={styles.label}>
            👥 Max Attendees
          </label>
          <input
            type="number"
            value={eventData.max_attendees || ''}
            onChange={(e) => onEventDataChange({max_attendees: parseInt(e.target.value) || undefined})}
            min="1"
            placeholder="Optional"
            style={selectStyle}
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <label style={styles.label}>
          💰 Event Price
        </label>
        <input
          type="number"
          value={eventData.price}
          onChange={(e) => onEventDataChange({price: parseInt(e.target.value) || 0})}
          min="0"
          placeholder="0"
          style={styles.input}
        />
        <p style={{fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0'}}>Enter 0 for free events</p>
      </div>
    </>
  );
}