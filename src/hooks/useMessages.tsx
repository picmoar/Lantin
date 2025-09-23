import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  senderName?: string;
}

interface UseMessagesProps {
  conversationId: string | null;
  userId: string | null;
  enabled?: boolean;
}

export function useMessages({ conversationId, userId, enabled = true }: UseMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const fetchMessages = async (isInitialLoad = false) => {
    if (!supabase || !conversationId || !enabled) {
      setMessages([]);
      return;
    }

    try {
      // Only show loading on initial load, not on polling updates
      if (isInitialLoad) {
        setLoading(true);
      }
      setError(null);

      // Fetch messages for this conversation
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          content,
          created_at
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // For each message, fetch sender details
      const messagesWithSenders = await Promise.all(
        (data || []).map(async (message) => {
          const { data: artistData, error: artistError } = await supabase
            .from('artists')
            .select('name, email')
            .eq('id', message.sender_id)
            .single();

          if (artistError) {
            console.warn('Failed to fetch sender artist:', message.sender_id, artistError);
          }

          return {
            ...message,
            senderName: artistData?.name || artistData?.email || 'Unknown User'
          };
        })
      );

      setMessages(messagesWithSenders);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      setError(error.message || 'Failed to fetch messages');
      setMessages([]);
    } finally {
      // Only set loading to false if it was an initial load
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  const sendMessage = async (content: string): Promise<boolean> => {
    if (!supabase || !conversationId || !userId || !content.trim()) {
      setError('Missing required data for sending message');
      return false;
    }

    try {
      setSending(true);
      setError(null);

      // Insert new message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          content: content.trim()
        });

      if (messageError) throw messageError;

      // Update conversation's last_message and last_message_at
      // Also remove both users from hidden_by_users if they're there (unhide conversation)
      const { error: convError } = await supabase
        .from('conversations')
        .update({
          last_message: content.trim(),
          last_message_at: new Date().toISOString(),
          hidden_by_users: []
        })
        .eq('id', conversationId);

      if (convError) {
        console.warn('Failed to update conversation last message:', convError);
      }

      // Refresh messages immediately
      fetchMessages(false);

      return true;
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message');
      return false;
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (messageId: string): Promise<boolean> => {
    if (!supabase || !userId) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);

      // Delete message (only if user is the sender)
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', userId);

      if (error) throw error;

      // Refresh messages
      fetchMessages(false);

      return true;
    } catch (error: any) {
      console.error('Error deleting message:', error);
      setError(error.message || 'Failed to delete message');
      return false;
    }
  };

  const markMessagesAsRead = async (): Promise<boolean> => {
    // For future implementation when we add read status
    // Currently messages don't have read/unread status
    return true;
  };

  // Polling effect for real-time updates
  useEffect(() => {
    if (!enabled || !conversationId) return;

    // Initial fetch with loading indicator
    fetchMessages(true);

    // Set up polling every 2 seconds for messages (without loading indicator)
    const interval = setInterval(() => fetchMessages(false), 2000);

    return () => clearInterval(interval);
  }, [conversationId, enabled]);

  // Reset messages when conversation changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
    }
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    sending,
    fetchMessages,
    sendMessage,
    deleteMessage,
    markMessagesAsRead,
    refetch: () => fetchMessages(false)
  };
}