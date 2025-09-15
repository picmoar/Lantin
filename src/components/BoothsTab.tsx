import { useState, useEffect, useRef } from 'react';

interface BoothsTabProps {
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

export default function BoothsTab({ 
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
}: BoothsTabProps) {
  const [boothSectionView, setBoothSectionView] = useState('booths');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [currentUserBoothIndex, setCurrentUserBoothIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedType, setSelectedType] = useState('All Types');


  return (
    <>
      {/* Page Title with Toggle */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
          <img 
            src="/booth.png" 
            alt="Booth" 
            style={{
              width: '24px',
              height: '24px'
            }}
          />
          <h1 style={{fontSize: '20px', fontWeight: 'bold', margin: 0}}>Spotlight</h1>
        </div>
        
        <div style={{
          display: 'flex',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          padding: '2px'
        }}>
          <button
            onClick={() => setBoothSectionView('booths')}
            style={{
              padding: '4px 12px',
              backgroundColor: boothSectionView === 'booths' ? 'white' : 'transparent',
              color: boothSectionView === 'booths' ? '#111827' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Booths
          </button>
          <button
            onClick={() => setBoothSectionView('events')}
            style={{
              padding: '4px 12px',
              backgroundColor: boothSectionView === 'events' ? 'white' : 'transparent',
              color: boothSectionView === 'events' ? '#111827' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Events
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{
        position: 'relative',
        marginBottom: '16px'
      }}>
        <input 
          type="text" 
          placeholder="Search artists, booths..."
          style={{
            width: '100%',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 12px 12px 40px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        <svg style={{
          position: 'absolute',
          left: '12px',
          top: '12px',
          width: '16px',
          height: '16px',
          color: '#9ca3af'
        }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Filters */}
      <div style={{display: 'flex', gap: '12px', marginBottom: '24px'}}>
        {/* Location Dropdown */}
        <div style={{flex: 1, position: 'relative'}}>
          <button
            onClick={() => {
              setShowLocationDropdown(!showLocationDropdown);
              setShowTypeDropdown(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{selectedLocation}</span>
            <svg 
              style={{
                width: '16px', 
                height: '16px', 
                transform: showLocationDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showLocationDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              marginTop: '4px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              zIndex: 100
            }}>
              {['All Locations', 'SoHo', 'Brooklyn', 'Queens', 'Manhattan'].map((location, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedLocation(location);
                    setShowLocationDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    textAlign: 'left',
                    backgroundColor: selectedLocation === location ? '#f3f4f6' : 'transparent',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: selectedLocation === location ? '600' : '500',
                    color: selectedLocation === location ? '#8b5cf6' : '#374151',
                    cursor: 'pointer',
                    borderRadius: idx === 0 ? '12px 12px 0 0' : idx === 4 ? '0 0 12px 12px' : '0'
                  }}
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type Dropdown */}
        <div style={{flex: 1, position: 'relative'}}>
          <button
            onClick={() => {
              setShowTypeDropdown(!showTypeDropdown);
              setShowLocationDropdown(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{selectedType}</span>
            <svg 
              style={{
                width: '16px', 
                height: '16px', 
                transform: showTypeDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showTypeDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              marginTop: '4px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              zIndex: 100
            }}>
              {['All Types', 'Pop-up', 'Studio', 'Gallery', 'Workshop'].map((type, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedType(type);
                    setShowTypeDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    textAlign: 'left',
                    backgroundColor: selectedType === type ? '#f3f4f6' : 'transparent',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: selectedType === type ? '600' : '500',
                    color: selectedType === type ? '#8b5cf6' : '#374151',
                    cursor: 'pointer',
                    borderRadius: idx === 0 ? '12px 12px 0 0' : idx === 4 ? '0 0 12px 12px' : '0'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booth Content - List View */}
      {boothSectionView === 'booths' && (
        <>
          {/* Your Booth */}
          <div style={{marginBottom: '24px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
              <h2 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '12px'}}>Your Booth</h2>
              {auth.isLoggedIn && (
                <button 
                  onClick={() => setShowCreateBoothModal(true)}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'translateY(-2px)'
                  }}
                >
                  + Create Booth
                </button>
              )}
            </div>
            {userBooths && userBooths.length > 0 ? (
              <div style={{ position: 'relative' }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  border: '2px solid #10b981',
                  padding: '16px',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{color: '#10b981', fontSize: '18px', fontWeight: 'bold', margin: 0}}>
                      {userBooths[currentUserBoothIndex].name}
                    </h3>
                  </div>
                  
                  <p style={{color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0'}}>
                    Location: {userBooths[currentUserBoothIndex].location}
                  </p>
                  <p style={{color: '#6b7280', fontSize: '14px', margin: '0 0 16px 0'}}>
                    Status: Active • {userBooths[currentUserBoothIndex].visitors} visitors
                  </p>
                  
                  {userBooths.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentUserBoothIndex(currentUserBoothIndex > 0 ? currentUserBoothIndex - 1 : userBooths.length - 1)}
                        style={{
                          position: 'absolute',
                          left: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '32px',
                          height: '32px',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => setCurrentUserBoothIndex(currentUserBoothIndex < userBooths.length - 1 ? currentUserBoothIndex + 1 : 0)}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '32px',
                          height: '32px',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ›
                      </button>
                    </>
                  )}
                  
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button
                      onClick={() => setShowEditBoothModal(true)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBooth(userBooths[currentUserBoothIndex].id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  
                  {userBooths.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {currentUserBoothIndex + 1} of {userBooths.length}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <span style={{fontSize: '24px', marginBottom: '8px', display: 'block'}}>🏪</span>
                <p style={{margin: '0', fontSize: '14px'}}>No booth created yet</p>
                {auth.isLoggedIn && <p style={{margin: '4px 0 0 0', fontSize: '12px'}}>Create your booth above!</p>}
              </div>
            )}
          </div>

          {/* All Booths */}
          <div>
            <h2 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '12px'}}>All Booths ({allBooths.length})</h2>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              paddingBottom: '8px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {allBooths.map((booth, idx) => (
                <div
                  key={booth.id}
                  style={{
                    minWidth: '280px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={(e) => {
                    if (!e.target.closest('.booth-delete-button')) {
                      const selectedBoothData = {
                        id: booth.id,
                        name: booth.name,
                        artist: booth.artist,
                        operator_name: booth.operator_name,
                        location: booth.location,
                        image: booth.image,
                        description: booth.description,
                        start_date: booth.start_date,
                        end_date: booth.end_date,
                        start_time: booth.start_time,
                        end_time: booth.end_time,
                        highlight_photos: booth.highlight_photos || [],
                        visitors: 45 + (idx * 15)
                      };
                      console.log('Booth clicked, data being passed to modal:', selectedBoothData);
                      console.log('Original booth data:', booth);
                      setSelectedBooth(selectedBoothData);
                    }
                  }}
                >
                  <img
                    src={booth.image}
                    alt={booth.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{padding: '12px'}}>
                    <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '4px'}}>{booth.name}</h3>
                    <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>{booth.artist}</p>
                    <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px'}}>
                      <svg style={{width: '14px', height: '14px', color: '#6b7280'}} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span style={{fontSize: '13px', color: '#6b7280'}}>{booth.location}</span>
                    </div>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button style={{
                        flex: 1,
                        padding: '6px 12px',
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}>
                        Visit
                      </button>
                      {auth.user && booth.artist_id === auth.user?.id && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBooth(booth.id);
                          }}
                          className="booth-delete-button"
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Events Content */}
      {boothSectionView === 'events' && (
        <>
          {/* Your Event */}
          <div style={{marginBottom: '24px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
              <h2 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '12px'}}>Your Event</h2>
              {auth.isLoggedIn && (
                <button 
                  onClick={() => setShowCreateEventModal(true)}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'translateY(-2px)'
                  }}
                >
                  + Create Event
                </button>
              )}
            </div>
            {userEvents.length > 0 ? (
              <div style={{position: 'relative'}}>
                <div style={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: '16px',
                  paddingBottom: '8px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}>
                  {userEvents.map((event, idx) => (
                    <div 
                      key={event.id}
                      style={{
                        minWidth: '280px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        border: '2px solid #8b5cf6',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      onClick={() => {
                        const selectedEventData = {
                          id: event.id,
                          title: event.title,
                          organizer: event.organizer_name || event.organizer || 'Unknown Organizer',
                          organizer_name: event.organizer_name,
                          location: event.location,
                          image: event.image,
                          description: event.description,
                          start_date: event.start_date,
                          end_date: event.end_date,
                          start_time: event.start_time,
                          end_time: event.end_time,
                          highlight_photos: event.highlight_photos || [],
                          price: event.price || 0,
                          type: event.type,
                          max_attendees: event.max_attendees,
                          attendees: event.attendees || 0
                        };
                        setSelectedEvent(selectedEventData);
                      }}
                    >
                      <img
                        src={event.image || 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=300&h=150&fit=crop'}
                        alt={event.title}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{padding: '16px'}}>
                        <h3 style={{color: '#8b5cf6', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px'}}>{event.title}</h3>
                        <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px'}}>
                          <span style={{fontSize: '12px'}}>🗓️</span>
                          <span style={{fontSize: '13px', color: '#6b7280'}}>
                            {event.start_date ? new Date(event.start_date).toLocaleDateString() : 'Date TBD'}
                          </span>
                          {event.start_time && (
                            <>
                              <span style={{fontSize: '13px', color: '#6b7280'}}> • </span>
                              <span style={{fontSize: '13px', color: '#6b7280'}}>{event.start_time}</span>
                            </>
                          )}
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px'}}>
                          <span style={{fontSize: '12px'}}>📍</span>
                          <span style={{fontSize: '13px', color: '#6b7280'}}>{event.location}</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                            <span style={{fontSize: '12px'}}>💰</span>
                            <span style={{fontSize: '13px', color: '#6b7280', fontWeight: '500'}}>
                              {event.price > 0 ? `$${event.price}` : 'Free'}
                            </span>
                          </div>
                          <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                            <span style={{fontSize: '12px'}}>👥</span>
                            <span style={{fontSize: '13px', color: '#6b7280'}}>{event.attendees || 0}</span>
                          </div>
                        </div>
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button 
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              backgroundColor: '#8b5cf6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowEditEventModal(true);
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
                          >
                            Edit
                          </button>
                          <button
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              backgroundColor: 'white',
                              color: '#8b5cf6',
                              border: '1px solid #8b5cf6',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const selectedEventData = {
                                id: event.id,
                                title: event.title,
                                organizer: event.organizer_name || event.organizer || 'Unknown Organizer',
                                organizer_name: event.organizer_name,
                                location: event.location,
                                image: event.image,
                                description: event.description,
                                start_date: event.start_date,
                                end_date: event.end_date,
                                start_time: event.start_time,
                                end_time: event.end_time,
                                highlight_photos: event.highlight_photos || [],
                                price: event.price || 0,
                                type: event.type,
                                max_attendees: event.max_attendees,
                                attendees: event.attendees || 0
                              };
                              setSelectedEvent(selectedEventData);
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#8b5cf6';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'white';
                              e.currentTarget.style.color = '#8b5cf6';
                            }}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                      
                      {/* Delete button */}
                      <button
                        className="event-delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this event?')) {
                            deleteEvent(event.id);
                          }
                        }}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '24px',
                          height: '24px',
                          backgroundColor: 'rgba(239, 68, 68, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backdropFilter: 'blur(4px)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.9)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.9)'}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <span style={{fontSize: '24px', marginBottom: '8px', display: 'block'}}>📅</span>
                <p style={{margin: '0', fontSize: '14px'}}>No events created yet</p>
                {auth.isLoggedIn && <p style={{margin: '4px 0 0 0', fontSize: '12px'}}>Create your first event above!</p>}
              </div>
            )}
          </div>

          {/* All Events */}
          <div>
            <h2 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '12px'}}>All Events ({allEvents.length})</h2>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              paddingBottom: '8px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {allEvents.map((event, idx) => (
                <div
                  key={event.id}
                  style={{
                    minWidth: '280px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => {
                    const selectedEventData = {
                      id: event.id,
                      title: event.title,
                      organizer: event.organizer_name || event.organizer || 'Unknown Organizer',
                      organizer_name: event.organizer_name,
                      location: event.location,
                      image: event.image,
                      description: event.description,
                      start_date: event.start_date,
                      end_date: event.end_date,
                      start_time: event.start_time,
                      end_time: event.end_time,
                      highlight_photos: event.highlight_photos || [],
                      price: event.price || 0,
                      type: event.type,
                      max_attendees: event.max_attendees,
                      attendees: event.attendees || 0
                    };
                    setSelectedEvent(selectedEventData);
                  }}
                >
                  <img
                    src={event.image || 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=300&h=150&fit=crop'}
                    alt={event.title}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{padding: '12px'}}>
                    <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '4px'}}>{event.title}</h3>
                    <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>
                      {event.organizer_name || event.organizer || 'Unknown Organizer'}
                    </p>
                    <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px'}}>
                      <svg style={{width: '14px', height: '14px', color: '#6b7280'}} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span style={{fontSize: '13px', color: '#6b7280'}}>
                        {event.start_date ? new Date(event.start_date).toLocaleDateString() : 'Date TBD'}
                      </span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px'}}>
                      <svg style={{width: '14px', height: '14px', color: '#6b7280'}} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span style={{fontSize: '13px', color: '#6b7280'}}>{event.location}</span>
                    </div>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button style={{
                        flex: 1,
                        padding: '6px 12px',
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}>
                        Join Event
                      </button>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#6b7280',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {event.price > 0 ? `$${event.price}` : 'Free'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </>
  );
}
