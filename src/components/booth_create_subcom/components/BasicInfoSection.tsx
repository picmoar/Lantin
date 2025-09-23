import React from 'react';
import { formStyles } from '../styles/formStyles';

interface BoothData {
  name: string;
  description: string;
  operator_name: string;
}

interface BasicInfoSectionProps {
  boothData: BoothData;
  onChange: (data: Partial<BoothData>) => void;
}


const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ boothData, onChange }) => {
  return (
    <>
      {/* Booth Name */}
      <div>
        <label style={formStyles.label}>
          Booth Name <span style={{color: '#ef4444'}}>*</span>
        </label>
        <input
          type="text"
          value={boothData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="My Art Studio"
          required
          style={formStyles.input}
        />
      </div>

      {/* Booth Operator */}
      <div>
        <label style={formStyles.label}>
          👤 Booth Operator <span style={{color: '#ef4444'}}>*</span>
        </label>
        <input
          type="text"
          value={boothData.operator_name}
          onChange={(e) => onChange({ operator_name: e.target.value })}
          placeholder="Your name or business name"
          required
          style={formStyles.input}
        />
      </div>

      {/* Description */}
      <div>
        <label style={formStyles.label}>
          Description
        </label>
        <textarea
          value={boothData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe your booth and what visitors can expect..."
          rows={3}
          style={formStyles.textarea}
        />
      </div>
    </>
  );
};

export default BasicInfoSection;