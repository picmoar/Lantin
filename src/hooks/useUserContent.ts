import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateSampleArtworks } from '../data/sampleArtworks';

export function useUserContent(user, userProfile) {
  const [userEvents, setUserEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [userArtworks, setUserArtworks] = useState([]);
  const [userBooth, setUserBooth] = useState(null);
  const [userBooths, setUserBooths] = useState([]);
  const [allBooths, setAllBooths] = useState([]);


  const loadUserContent = async () => {
    const sampleArtworks = generateSampleArtworks(userProfile.name || 'Demo Artist');
    
    if (!supabase || !user) {
      setUserArtworks(sampleArtworks);
      return;
    }

    try {
      const { data: artworks, error: artworksError } = await supabase
        .from('artworks')
        .select(`
          *,
          artwork_photos(image_url, is_primary)
        `)
        .eq('artist_id', user?.id)
        .order('created_at', { ascending: false });

      if (!artworksError && artworks) {
        console.log('Loaded user artworks:', artworks);
        
        const transformedArtworks = artworks.map(artwork => {
          const photos = artwork.artwork_photos?.map(photo => ({
            id: `photo-${photo.image_url}`,
            url: photo.image_url
          })) || [];
          
          return {
            id: artwork.id,
            title: artwork.title,
            artist: userProfile.name || 'Unknown Artist',
            description: artwork.description,
            price: artwork.price,
            medium: artwork.medium,
            dimensions: artwork.dimensions,
            year: artwork.year,
            photos: photos.length > 0 ? photos : [{ 
              id: 'placeholder', 
              url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=800&fit=crop' 
            }],
            tags: [],
            createdAt: artwork.created_at,
            is_for_sale: artwork.is_for_sale
          };
        });
        
        const allArtworks = [...transformedArtworks, ...sampleArtworks];
        setUserArtworks(allArtworks);
      }
    } catch (error) {
      console.error('Error loading user content:', error);
    }
  };

  const createEvent = async (eventData) => {
    if (!user || !supabase) {
      alert('Please log in to create an event');
      return;
    }

    try {
      // Copy the exact pattern from booth creation
      let insertData = {
        organizer_id: user?.id,
        title: eventData.title,
        location: eventData.location,
        description: eventData.description || 'Art event',
        organizer_name: eventData.organizer_name,
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        type: eventData.type,
        price: eventData.price || 0,
        max_attendees: eventData.max_attendees,
        highlight_photos: eventData.highlight_photos || [],
        latitude: eventData.latitude,
        longitude: eventData.longitude,
        formatted_address: eventData.formatted_address,
        created_by: user?.id
      };
      
      // Add image if available
      if (eventData.image) {
        insertData.image = eventData.image;
      }

      const { data, error } = await supabase
        .from('events')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      const newEvent = {
        ...data,
        organizer: data.organizer_name || 'Unknown Organizer',
        attendees: data.attendee_count || 0,
        image: eventData.image // Store image locally in state even if not in DB
      };
      console.log('Created event with image:', newEvent);
      setUserEvents([newEvent, ...userEvents]);
      setAllEvents([newEvent, ...allEvents]);
      
      alert('📅 Event published successfully!');
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event: ' + error.message);
      return false;
    }
  };

  const updateEvent = async (updatedEventData) => {
    if (!supabase || !user || !userEvents.length) {
      alert('Please log in to update event');
      return;
    }

    try {
      let updateData = {
        title: updatedEventData.title,
        location: updatedEventData.location,
        description: updatedEventData.description,
        organizer_name: updatedEventData.organizer_name,
        start_date: updatedEventData.start_date,
        end_date: updatedEventData.end_date,
        start_time: updatedEventData.start_time,
        end_time: updatedEventData.end_time,
        type: updatedEventData.type,
        price: updatedEventData.price || 0,
        max_attendees: updatedEventData.max_attendees,
        highlight_photos: updatedEventData.highlight_photos || [],
        latitude: updatedEventData.latitude,
        longitude: updatedEventData.longitude,
        formatted_address: updatedEventData.formatted_address
      };
      
      // Add image if available
      if (updatedEventData.image) {
        updateData.image = updatedEventData.image;
      }

      const eventToUpdate = userEvents[0]; // Assuming first event for now
      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventToUpdate.id)
        .eq('organizer_id', user?.id);

      if (error) throw error;

      setUserEvents(userEvents.map(event => 
        event.id === eventToUpdate.id 
          ? {...event, ...updatedEventData}
          : event
      ));

      alert('✅ Event updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event: ' + error.message);
      return false;
    }
  };

  const deleteEvent = async (eventId) => {
    if (!supabase || !user) {
      alert('Please log in to delete event');
      return;
    }

    const confirmed = confirm('Are you sure you want to delete this event? This action cannot be undone.');
    if (!confirmed) return;

    try {
      // Delete event registrations first
      const { error: registrationError } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId);

      if (registrationError) {
        console.error('Error deleting event registrations:', registrationError);
      }

      const { error: eventError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('organizer_id', user?.id);

      if (eventError) throw eventError;

      setUserEvents(userEvents.filter(event => event.id !== eventId));
      setAllEvents(allEvents.filter(event => event.id !== eventId));
      
      alert('✅ Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event: ' + error.message);
    }
  };

  const createArtwork = async (artworkData) => {
    if (!supabase || !user) {
      alert('Please log in to create artwork');
      return;
    }

    try {
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .upsert([
          {
            id: user?.id,
            name: userProfile.name || 'Unknown Artist',
            email: user.email,
            bio: userProfile.bio || 'Passionate artist',
            location: userProfile.location || 'Unknown Location',
            profile_image_url: userProfile.profileImage,
            featured: false
          }
        ])
        .select()
        .single();

      if (artistError) {
        console.log('Artist upsert warning:', artistError);
      }

      const { data, error } = await supabase
        .from('artworks')
        .insert([
          {
            artist_id: user?.id,
            title: artworkData.title,
            description: artworkData.description,
            medium: artworkData.medium,
            year: artworkData.year,
            dimensions: artworkData.dimensions,
            price: artworkData.price,
            is_for_sale: artworkData.price !== null && artworkData.price > 0,
            tags: [artworkData.type || 'art']
          }
        ])
        .select()
        .single();

      if (error) throw error;

      let imageUrl = null;
      if (artworkData.image) {
        const { data: photoData, error: photoError } = await supabase
          .from('artwork_photos')
          .insert([
            {
              artwork_id: data.id,
              image_url: artworkData.image,
              is_primary: true,
              order_index: 0
            }
          ])
          .select()
          .single();

        if (photoError) {
          console.error('Error saving artwork photo:', photoError);
        } else {
          imageUrl = artworkData.image;
        }
      }

      const newArtwork = {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        medium: data.medium,
        dimensions: data.dimensions,
        year: data.year,
        artist: userProfile.name,
        image: imageUrl,
        createdAt: data.created_at,
        sales: 0
      };
      
      setUserArtworks([newArtwork, ...userArtworks]);
      await loadUserContent();
      alert('🎨 Artwork published successfully!');
      return true;
    } catch (error) {
      console.error('Error creating artwork:', error);
      alert('Failed to create artwork: ' + error.message);
      return false;
    }
  };

  const createBooth = async (boothData) => {
    if (!user || !supabase) {
      alert('Please log in to create a booth');
      return;
    }

    try {
      // Try to create booth with image first
      let insertData = {
        artist_id: user?.id,
        name: boothData.name,
        location: boothData.location,
        description: boothData.description || 'Artist booth',
        operator_name: boothData.operator_name,
        start_date: boothData.start_date,
        end_date: boothData.end_date,
        start_time: boothData.start_time,
        end_time: boothData.end_time,
        highlight_photos: boothData.highlight_photos || [],
        latitude: boothData.latitude,
        longitude: boothData.longitude,
        formatted_address: boothData.formatted_address
      };
      
      // Add image if available
      if (boothData.image) {
        insertData.image = boothData.image;
      }

      const { data, error } = await supabase
        .from('booths')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      const newBooth = {
        ...data,
        visitors: 127,
        image: boothData.image // Store image locally in state even if not in DB
      };
      console.log('Created booth with image:', newBooth);
      setUserBooth(newBooth);

      const { data: allBoothsData, error: allBoothsError } = await supabase
        .from('booths')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (allBoothsData && !allBoothsError) {
        // Load saved images from localStorage
        let savedImages = {};
        try {
          savedImages = JSON.parse(localStorage.getItem('booth-images') || '{}');
        } catch (e) {
          console.error('Failed to load images from localStorage:', e);
        }

        const updatedBooths = allBoothsData.map(booth => ({
          ...booth,
          artist: booth.description || 'Artist',
          image: booth.image || savedImages[booth.id] || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop'
        }));
        console.log('Updated all booths:', updatedBooths);
        setAllBooths(updatedBooths);
      }

      alert('Booth created successfully!');
      return true;
    } catch (error) {
      console.error('Error creating booth:', error);
      alert('Failed to create booth: ' + error.message);
      return false;
    }
  };

  const updateBooth = async (updatedBoothData) => {
    if (!supabase || !user || !userBooth) {
      alert('Please log in to update booth');
      return;
    }

    try {
      let updateData = {
        name: updatedBoothData.name,
        location: updatedBoothData.location,
        description: updatedBoothData.description,
        operator_name: updatedBoothData.operator_name,
        start_date: updatedBoothData.start_date,
        end_date: updatedBoothData.end_date,
        start_time: updatedBoothData.start_time,
        end_time: updatedBoothData.end_time,
        highlight_photos: updatedBoothData.highlight_photos || [],
        latitude: updatedBoothData.latitude,
        longitude: updatedBoothData.longitude,
        formatted_address: updatedBoothData.formatted_address
      };
      
      // Add image if available
      if (updatedBoothData.image) {
        updateData.image = updatedBoothData.image;
      }

      const { error } = await supabase
        .from('booths')
        .update(updateData)
        .eq('id', userBooth.id)
        .eq('artist_id', user?.id);

      if (error) throw error;

      setUserBooth({
        ...userBooth,
        ...updatedBoothData
      });

      setAllBooths(allBooths.map(booth => 
        booth.id === userBooth.id 
          ? {...booth, ...updatedBoothData}
          : booth
      ));

      alert('✅ Booth updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating booth:', error);
      alert('Failed to update booth: ' + error.message);
      return false;
    }
  };

  const deleteArtwork = async (artworkId) => {
    if (!supabase || !user) {
      alert('Please log in to delete artwork');
      return;
    }

    const confirmed = confirm('Are you sure you want to delete this artwork? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const { error: photoError } = await supabase
        .from('artwork_photos')
        .delete()
        .eq('artwork_id', artworkId);

      if (photoError) {
        console.error('Error deleting artwork photos:', photoError);
      }

      const { error: artworkError } = await supabase
        .from('artworks')
        .delete()
        .eq('id', artworkId)
        .eq('artist_id', user?.id);

      if (artworkError) throw artworkError;

      setUserArtworks(userArtworks.filter(artwork => artwork.id !== artworkId));
      alert('✅ Artwork deleted successfully');
    } catch (error) {
      console.error('Error deleting artwork:', error);
      alert('Failed to delete artwork: ' + error.message);
    }
  };

  const deleteBooth = async (boothId) => {
    if (!supabase || !user) {
      alert('Please log in to delete booth');
      return;
    }

    const confirmed = confirm('Are you sure you want to delete this booth? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('booths')
        .delete()
        .eq('id', boothId)
        .eq('artist_id', user?.id);

      if (error) throw error;

      setAllBooths(allBooths.filter(booth => booth.id !== boothId));
      if (userBooth && userBooth.id === boothId) {
        setUserBooth(null);
      }
      
      alert('✅ Booth deleted successfully');
    } catch (error) {
      console.error('Error deleting booth:', error);
      alert('Failed to delete booth: ' + error.message);
    }
  };

  // Load user content when user changes
  useEffect(() => {
    loadUserContent();
  }, [supabase, user]);

  // Load events data - copy booth pattern exactly
  useEffect(() => {
    const loadEvents = async () => {
      if (!supabase) return;
      
      console.log('useUserContent loadEvents called with user:', user);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('Loading all events result:', { data, error });
      
      if (data && !error) {
        const mappedEvents = data.map(event => ({
          ...event,
          organizer: event.organizer_name || 'Unknown Organizer',
          attendees: event.attendee_count || 0,
          image: event.image || 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=300&h=150&fit=crop'
        }));
        console.log('Mapped all events:', mappedEvents);
        setAllEvents(mappedEvents);
      }
      
      if (user && data) {
        // Find all user events from the loaded events
        const userEventsData = data.filter(event => event.organizer_id === user?.id || event.created_by === user?.id);
        
        if (userEventsData.length > 0) {
          const processedUserEvents = userEventsData.map(event => ({
            ...event,
            organizer: event.organizer_name || 'Unknown Organizer',
            attendees: event.attendee_count || 0,
            image: event.image || 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=300&h=150&fit=crop'
          }));
          setUserEvents(processedUserEvents);
        } else {
          setUserEvents([]);
        }
      }
    };

    loadEvents();
  }, [supabase, user]);

  // Load booths data
  useEffect(() => {
    const loadBooths = async () => {
      if (!supabase) return;
      
      console.log('useUserContent loadBooths called with user:', user);
      
      const { data, error } = await supabase
        .from('booths')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('Loading all booths result:', { data, error });
      
      if (data && !error) {
        const mappedBooths = data.map(booth => ({
          ...booth,
          artist: booth.description || 'Artist',
          image: booth.image || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop'
        }));
        console.log('Mapped all booths:', mappedBooths);
        setAllBooths(mappedBooths);
      }
      
      if (user && data) {
        // Find all user booths from the loaded booths
        const userBoothsData = data.filter(booth => booth.artist_id === user?.id);
        
        if (userBoothsData.length > 0) {
          // Set all user booths for carousel
          const processedUserBooths = userBoothsData.map(booth => ({
            ...booth,
            artist: booth.description || 'Artist',
            image: booth.image || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
            visitors: 127 + Math.floor(Math.random() * 100) // Add some variation to visitor counts
          }));
          setUserBooths(processedUserBooths);
          
          // Keep the first one as the main userBooth for backwards compatibility
          setUserBooth(processedUserBooths[0]);
        } else {
          setUserBooths([]);
          setUserBooth(null);
        }
      }
    };

    loadBooths();
  }, [supabase, user]);

  return {
    userEvents,
    allEvents,
    userArtworks,
    userBooth,
    userBooths,
    allBooths,
    createEvent,
    updateEvent,
    deleteEvent,
    createArtwork,
    createBooth,
    updateBooth,
    deleteArtwork,
    deleteBooth,
    loadUserContent
  };
}