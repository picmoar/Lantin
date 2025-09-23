import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  otherUser: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface UseConversationsProps {
  userId: string | null;
  enabled?: boolean;
}

export function useConversations({ userId, enabled = true }: UseConversationsProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async (isInitialLoad = false) => {
    if (!supabase || !userId || !enabled) {
      setConversations([]);
      return;
    }

    try {
      // Only show loading on initial load, not on polling updates
      if (isInitialLoad) {
        setLoading(true);
      }
      setError(null);

      // Fetch conversations where current user is either user1 or user2
      // and the conversation is not hidden by the current user
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          user1_id,
          user2_id,
          last_message,
          last_message_at,
          created_at,
          updated_at,
          hidden_by_users
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .not('hidden_by_users', 'cs', `{${userId}}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;

      // For each conversation, fetch the other user's details
      const conversationsWithUsers = await Promise.all(
        (data || []).map(async (conv) => {
          const otherUserId = conv.user1_id === userId ? conv.user2_id : conv.user1_id;

          // Fetch other user details from artists table
          const { data: artistData, error: artistError } = await supabase
            .from('artists')
            .select('id, name, email, profile_image_url')
            .eq('id', otherUserId)
            .single();

          if (artistError) {
            console.warn('Failed to fetch artist for user:', otherUserId, artistError);
          }

          return {
            ...conv,
            otherUser: artistData ? {
              id: artistData.id,
              name: artistData.name || artistData.email || 'Unknown User',
              email: artistData.email || '',
              profileImage: artistData.profile_image_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face`
            } : null
          };
        })
      );

      setConversations(conversationsWithUsers);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      setError(error.message || 'Failed to fetch conversations');
      setConversations([]);
    } finally {
      // Only set loading to false if it was an initial load
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  const createConversation = async (otherUserId: string): Promise<string | null> => {
    if (!supabase || !userId) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);

      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${userId},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${userId})`)
        .single();

      if (existingConv) {
        return existingConv.id;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user1_id: userId,
          user2_id: otherUserId
        })
        .select('id')
        .single();

      if (error) throw error;

      // Refresh conversations list
      fetchConversations(false);

      return data.id;
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      setError(error.message || 'Failed to create conversation');
      return null;
    }
  };

  const deleteConversation = async (conversationId: string): Promise<boolean> => {
    if (!supabase || !userId) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);

      // Get current conversation to check existing hidden_by_users
      const { data: conversation, error: fetchError } = await supabase
        .from('conversations')
        .select('hidden_by_users')
        .eq('id', conversationId)
        .single();

      if (fetchError) throw fetchError;

      // Add current user to hidden_by_users array
      const currentHiddenUsers = conversation.hidden_by_users || [];
      const updatedHiddenUsers = [...currentHiddenUsers, userId];

      // Update the conversation to hide it from current user's view
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          hidden_by_users: updatedHiddenUsers
        })
        .eq('id', conversationId);

      if (updateError) throw updateError;

      // Refresh conversations list
      fetchConversations(false);

      return true;
    } catch (error: any) {
      console.error('Error hiding conversation:', error);
      setError(error.message || 'Failed to hide conversation');
      return false;
    }
  };

  // Polling effect for real-time updates
  useEffect(() => {
    if (!enabled || !userId) return;

    // Initial fetch with loading indicator
    fetchConversations(true);

    // Set up polling every 5 seconds (without loading indicator)
    const interval = setInterval(() => fetchConversations(false), 5000);

    return () => clearInterval(interval);
  }, [userId, enabled]);

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    createConversation,
    deleteConversation,
    refetch: () => fetchConversations(false)
  };
}