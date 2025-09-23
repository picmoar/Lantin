import { useState } from 'react';

export interface UseBoothFiltersReturn {
  selectedLocation: string;
  selectedType: string;
  searchQuery: string;
  showLocationDropdown: boolean;
  showTypeDropdown: boolean;
  setSearchQuery: (query: string) => void;
  handleLocationChange: (location: string) => void;
  handleTypeChange: (type: string) => void;
  handleLocationDropdownToggle: () => void;
  handleTypeDropdownToggle: () => void;
  resetFilters: () => void;
}

export const useBoothFilters = (): UseBoothFiltersReturn => {
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedType, setSelectedType] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setShowTypeDropdown(false);
  };

  const handleLocationDropdownToggle = () => {
    setShowLocationDropdown(!showLocationDropdown);
    setShowTypeDropdown(false);
  };

  const handleTypeDropdownToggle = () => {
    setShowTypeDropdown(!showTypeDropdown);
    setShowLocationDropdown(false);
  };

  const resetFilters = () => {
    setSelectedLocation('All Locations');
    setSelectedType('All Types');
    setSearchQuery('');
    setShowLocationDropdown(false);
    setShowTypeDropdown(false);
  };

  return {
    selectedLocation,
    selectedType,
    searchQuery,
    showLocationDropdown,
    showTypeDropdown,
    setSearchQuery,
    handleLocationChange,
    handleTypeChange,
    handleLocationDropdownToggle,
    handleTypeDropdownToggle,
    resetFilters
  };
};