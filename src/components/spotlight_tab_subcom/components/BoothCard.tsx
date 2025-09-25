import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface BoothCardProps {
  booth: any;
  index: number;
  currentUserId?: string;
  user?: any;
  onBoothClick: (boothData: any) => void;
  onDelete: (boothId: any) => void;
}

const BoothCard: React.FC<BoothCardProps> = ({
  booth,
  index,
  currentUserId,
  user,
  onBoothClick,
  onDelete
}) => {
  const [hasVisited, setHasVisited] = useState(false);
  const [currentVisitorCount, setCurrentVisitorCount] = useState(0);

  // Load visit status and visitor count on mount
  useEffect(() => {
    const loadVisitData = async () => {
      if (!supabase) return;

      try {
        // Get real visitor count from database
        const { data: boothData, error: boothError } = await supabase
          .from('booths')
          .select('visitor_count')
          .eq('id', booth.id)
          .single();

        if (boothData && !boothError) {
          setCurrentVisitorCount(boothData.visitor_count || 0);
        }

        // Check if current user has visited (only if logged in)
        if (user) {
          const { data: visitData, error: visitError } = await supabase
            .from('booth_visits')
            .select('id')
            .eq('booth_id', booth.id)
            .eq('user_id', user.id)
            .maybeSingle();

          if (visitData && !visitError) {
            setHasVisited(true);
          }
        }
      } catch (error) {
        console.warn('Error loading visit data for booth card:', error);
      }
    };

    loadVisitData();
  }, [booth.id, user]);

  const handleVisitToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    if (!user || !supabase) {
      alert('Please log in to track your visits');
      return;
    }

    try {
      if (hasVisited) {
        // Cancel visit - remove from database
        const { error: deleteError } = await supabase
          .from('booth_visits')
          .delete()
          .eq('booth_id', booth.id)
          .eq('user_id', user.id);

        if (!deleteError) {
          // Decrement visitor count
          const { error: updateError } = await supabase
            .from('booths')
            .update({ visitor_count: Math.max(0, currentVisitorCount - 1) })
            .eq('id', booth.id);

          if (!updateError) {
            setCurrentVisitorCount(Math.max(0, currentVisitorCount - 1));
            setHasVisited(false);
          }
        }
      } else {
        // Add visit - insert into database
        const { error: visitError } = await supabase
          .from('booth_visits')
          .insert([{
            booth_id: booth.id,
            user_id: user.id
          }]);

        if (!visitError) {
          // Increment visitor count
          const { error: updateError } = await supabase
            .from('booths')
            .update({ visitor_count: currentVisitorCount + 1 })
            .eq('id', booth.id);

          if (!updateError) {
            setCurrentVisitorCount(currentVisitorCount + 1);
            setHasVisited(true);
          }
        } else if (visitError.code === '23505') {
          // Duplicate key - user already visited, just update local state
          setHasVisited(true);
        }
      }
    } catch (error) {
      console.warn('Error toggling booth visit:', error);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!e.target.closest('.booth-delete-button') && !e.target.closest('.booth-visit-button')) {
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
        visitors: 45 + (index * 15)
      };
      console.log('Booth clicked, data being passed to modal:', selectedBoothData);
      console.log('Original booth data:', booth);
      onBoothClick(selectedBoothData);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(booth.id);
  };

  return (
    <div
      style={{
        minWidth: '280px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative'
      }}
      onClick={handleCardClick}
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
        <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '4px'}}>
          {booth.name}
        </h3>
        <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>
          {booth.artist}
        </p>
        <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px'}}>
          <svg style={{width: '14px', height: '14px', color: '#6b7280'}} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span style={{fontSize: '13px', color: '#6b7280'}}>{booth.location}</span>
        </div>
        <div style={{display: 'flex', gap: '8px'}}>
          <button
            onClick={handleVisitToggle}
            className="booth-visit-button"
            style={{
              flex: 1,
              padding: '6px 12px',
              backgroundColor: hasVisited ? '#dc2626' : '#61858b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (hasVisited) {
                e.currentTarget.style.backgroundColor = '#b91c1c';
              } else {
                e.currentTarget.style.backgroundColor = '#57717a';
              }
            }}
            onMouseLeave={(e) => {
              if (hasVisited) {
                e.currentTarget.style.backgroundColor = '#dc2626';
              } else {
                e.currentTarget.style.backgroundColor = '#61858b';
              }
            }}
          >
            {hasVisited ? 'Cancel Visit' : 'Visit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoothCard;