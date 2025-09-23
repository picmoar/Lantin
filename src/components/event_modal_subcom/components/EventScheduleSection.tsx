import React from 'react';

interface EventData {
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
}

interface EventScheduleSectionProps {
  eventData: EventData;
  onEventDataChange: (data: Partial<EventData>) => void;
  styles: {
    label: React.CSSProperties;
    subLabel: React.CSSProperties;
  };
}

export default function EventScheduleSection({
  eventData,
  onEventDataChange,
  styles
}: EventScheduleSectionProps) {
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#f9fafb'
  };

  return (
    <div>
      <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '12px'}}>
        📅 Event Schedule
      </label>

      {/* Date Range */}
      <div style={{marginBottom: '16px'}}>
        <label style={{...styles.label, fontSize: '13px', color: '#374151'}}>
          Event Dates
        </label>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
          <div>
            <label style={styles.subLabel}>
              Start Date
            </label>
            <input
              type="date"
              value={eventData.start_date}
              onChange={(e) => onEventDataChange({start_date: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={styles.subLabel}>
              End Date
            </label>
            <input
              type="date"
              value={eventData.end_date}
              onChange={(e) => onEventDataChange({end_date: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Daily Hours */}
      <div>
        <label style={{...styles.label, fontSize: '13px', color: '#374151'}}>
          Daily Event Hours
        </label>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
          <div>
            <label style={styles.subLabel}>
              Starts At
            </label>
            <input
              type="time"
              value={eventData.start_time}
              onChange={(e) => onEventDataChange({start_time: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={styles.subLabel}>
              Ends At
            </label>
            <input
              type="time"
              value={eventData.end_time}
              onChange={(e) => onEventDataChange({end_time: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}