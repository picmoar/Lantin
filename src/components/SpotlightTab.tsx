import { useState, useEffect, useRef } from 'react';
import {
  HeaderSection,
  FilterBar,
  EmptyState,
  UserBoothCard,
  BoothCard,
  EventCard,
  useBoothFilters,
  useBoothNavigation,
  useTabState,
  useSpotlightActions,
  createButton,
  sectionContainer,
  sectionHeader,
  sectionTitle,
  horizontalScrollContainer,
  horizontalScrollContainerLarge,
  relativeContainer
} from './spotlight_tab_subcom';

interface SpotlightTabProps {
  auth: {
    user: any;
    userProfile: any;
    isLoggedIn: boolean;
  };
  userBooth: any;
  userBooths: any[];
  allBooths: any[];
  userEvents: any[];
  allEvents: any[];
  setShowCreateBoothModal: (show: boolean) => void;
  setShowCreateEventModal: (show: boolean) => void;
  setShowEditBoothModal: (show: boolean) => void;
  setShowEditEventModal: (show: boolean) => void;
  setSelectedBooth: (booth: any) => void;
  setSelectedEvent: (event: any) => void;
  deleteBooth: (id: any) => void;
  deleteEvent: (id: any) => void;
}

export default function SpotlightTab({
  auth,
  userBooth,
  userBooths,
  allBooths,
  userEvents,
  allEvents,
  setShowCreateBoothModal,
  setShowCreateEventModal,
  setShowEditBoothModal,
  setShowEditEventModal,
  setSelectedBooth,
  setSelectedEvent,
  deleteBooth,
  deleteEvent
}: SpotlightTabProps) {
  // Custom hooks for state management
  const { currentView, setCurrentView, isBoothsView, isEventsView } = useTabState('booths');
  const {
    selectedLocation,
    selectedType,
    searchQuery,
    showLocationDropdown,
    showTypeDropdown,
    setSearchQuery,
    handleLocationChange,
    handleTypeChange,
    handleLocationDropdownToggle,
    handleTypeDropdownToggle
  } = useBoothFilters();
  const { currentUserBoothIndex, goToPrevious, goToNext } = useBoothNavigation(userBooths?.length || 0);
  const {
    handleCreateBooth,
    handleCreateEvent,
    handleEditBooth,
    handleEditEvent,
    handleBoothClick,
    handleEventClick,
    handleDeleteBooth,
    handleDeleteEvent
  } = useSpotlightActions({
    setShowCreateBoothModal,
    setShowCreateEventModal,
    setShowEditBoothModal,
    setShowEditEventModal,
    setSelectedBooth,
    setSelectedEvent,
    deleteBooth,
    deleteEvent
  });


  return (
    <>
      <HeaderSection
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      <FilterBar
        selectedLocation={selectedLocation}
        selectedType={selectedType}
        showLocationDropdown={showLocationDropdown}
        showTypeDropdown={showTypeDropdown}
        onLocationChange={(location) => {
          setSelectedLocation(location);
          setShowLocationDropdown(false);
        }}
        onTypeChange={(type) => {
          setSelectedType(type);
          setShowTypeDropdown(false);
        }}
        onLocationDropdownToggle={() => {
          setShowLocationDropdown(!showLocationDropdown);
          setShowTypeDropdown(false);
        }}
        onTypeDropdownToggle={() => {
          setShowTypeDropdown(!showTypeDropdown);
          setShowLocationDropdown(false);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Booth Content - List View */}
      {isBoothsView && (
        <>
          {/* Your Booth */}
          <div style={sectionContainer}>
            <div style={sectionHeader}>
              <h2 style={sectionTitle}>Your Booth</h2>
              {auth.isLoggedIn && (
                <button
                  onClick={handleCreateBooth}
                  style={createButton}
                >
                  + Create Booth
                </button>
              )}
            </div>
            {userBooths && userBooths.length > 0 ? (
              <UserBoothCard
                userBooths={userBooths}
                currentUserBoothIndex={currentUserBoothIndex}
                onPrevious={goToPrevious}
                onNext={goToNext}
                onEdit={handleEditBooth}
                onDelete={handleDeleteBooth}
              />
            ) : (
              <EmptyState
                type="booth"
                isLoggedIn={auth.isLoggedIn}
                showCreateMessage={true}
              />
            )}
          </div>

          {/* All Booths */}
          <div>
            <h2 style={sectionTitle}>All Booths ({allBooths.length})</h2>

            <div style={horizontalScrollContainer}>
              {allBooths.map((booth, idx) => (
                <BoothCard
                  key={booth.id}
                  booth={booth}
                  index={idx}
                  currentUserId={auth.user?.id}
                  onBoothClick={handleBoothClick}
                  onDelete={handleDeleteBooth}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Events Content */}
      {isEventsView && (
        <>
          {/* Your Event */}
          <div style={sectionContainer}>
            <div style={sectionHeader}>
              <h2 style={sectionTitle}>Your Event</h2>
              {auth.isLoggedIn && (
                <button
                  onClick={handleCreateEvent}
                  style={createButton}
                >
                  + Create Event
                </button>
              )}
            </div>
            {userEvents.length > 0 ? (
              <div style={relativeContainer}>
                <div style={horizontalScrollContainerLarge}>
                  {userEvents.map((event, idx) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      variant="user"
                      onEventClick={handleEventClick}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                type="event"
                isLoggedIn={auth.isLoggedIn}
                showCreateMessage={true}
              />
            )}
          </div>

          {/* All Events */}
          <div>
            <h2 style={sectionTitle}>All Events ({allEvents.length})</h2>

            <div style={horizontalScrollContainer}>
              {allEvents.map((event, idx) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="public"
                  onEventClick={handleEventClick}
                />
              ))}
            </div>
          </div>
        </>
      )}

    </>
  );
}
