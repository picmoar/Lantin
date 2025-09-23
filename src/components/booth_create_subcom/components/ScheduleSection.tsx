import React from 'react';
import { formStyles } from '../styles/formStyles';

interface ScheduleData {
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
}

interface ScheduleSectionProps {
  scheduleData: ScheduleData;
  onChange: (data: Partial<ScheduleData>) => void;
}


const ScheduleSection: React.FC<ScheduleSectionProps> = ({ scheduleData, onChange }) => {
  return (
    <div>
      <label style={formStyles.label}>
        📅 Operating Schedule
      </label>

      {/* Date Range */}
      <div style={{marginBottom: '16px'}}>
        <label style={formStyles.secondaryLabel}>
          Event Dates
        </label>
        <div style={formStyles.gridTwoColumns}>
          <div>
            <label style={formStyles.smallLabel}>
              Start Date
            </label>
            <input
              type="date"
              value={scheduleData.start_date || ''}
              onChange={(e) => onChange({ start_date: e.target.value })}
              style={formStyles.input}
            />
          </div>
          <div>
            <label style={formStyles.smallLabel}>
              End Date
            </label>
            <input
              type="date"
              value={scheduleData.end_date || ''}
              onChange={(e) => onChange({ end_date: e.target.value })}
              style={formStyles.input}
            />
          </div>
        </div>
      </div>

      {/* Daily Hours */}
      <div>
        <label style={formStyles.secondaryLabel}>
          Daily Operating Hours
        </label>
        <div style={formStyles.gridTwoColumns}>
          <div>
            <label style={formStyles.smallLabel}>
              Opens At
            </label>
            <input
              type="time"
              value={scheduleData.start_time || ''}
              onChange={(e) => onChange({ start_time: e.target.value })}
              style={formStyles.input}
            />
          </div>
          <div>
            <label style={formStyles.smallLabel}>
              Closes At
            </label>
            <input
              type="time"
              value={scheduleData.end_time || ''}
              onChange={(e) => onChange({ end_time: e.target.value })}
              style={formStyles.input}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSection;