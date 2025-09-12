import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: '',
    bio: '',
    location: '',
    specialty: '',
    profileImage: ''
  });

  const updateProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const handleLogin = async () => {
    if (supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        
        if (error) {
          console.error('Login error:', error);
          console.log('Google OAuth not configured, using demo login');
          handleMobileTestLogin();
        }
      } catch (error) {
        console.error('Auth error:', error);
        console.log('Authentication error, using demo login');
        handleMobileTestLogin();
      }
    } else {
      console.log('Supabase not configured, using demo login');
      handleMobileTestLogin();
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Google login clicked');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed: ' + error.message);
    }
  };

  const handleMobileTestLogin = () => {
    console.log('Demo login clicked');
    
    const mockUser = {
      id: '07430501-ba51-4a7f-97a7-b99f4889e8a5',
      email: 'test@mobile.com',
      user_metadata: {
        full_name: 'Mobile Test User',
        bio: 'Testing from mobile device',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      }
    };
    
    console.log('Setting user:', mockUser);
    setUser(mockUser);
    setUserProfile({
      name: mockUser.user_metadata.full_name,
      bio: mockUser.user_metadata.bio,
      location: 'Mobile Device',
      specialty: 'Art Enthusiast',
      profileImage: mockUser.user_metadata.avatar_url
    });
    
    console.log('Login state updated');
    alert('Demo login successful! You can now create booths and events.');
  };

  const handleProfileUpdate = async () => {
    if (supabase && user) {
      try {
        // Update both auth metadata and users table
        const { error: authError } = await supabase.auth.updateUser({
          data: {
            full_name: userProfile.name,
            bio: userProfile.bio,
            location: userProfile.location,
            specialty: userProfile.specialty
          }
        });

        // Update users table
        const { error: userError } = await supabase
          .from('users')
          .update({
            name: userProfile.name,
            location: userProfile.location,
            profile_image_url: userProfile.profileImage
          })
          .eq('id', user.id);
        
        if (authError || userError) {
          console.error('Profile update error:', authError || userError);
          alert('Failed to update profile: ' + (authError?.message || userError?.message));
        } else {
          console.log('Profile updated successfully');
          alert('Profile updated successfully!');
        }
      } catch (error) {
        console.error('Profile update error:', error);
        alert('Failed to update profile: ' + error.message);
      }
    }
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateProfile({ profileImage: imageUrl });
    }
  };

  const signOut = () => supabase.auth.signOut();

  // Auth state management
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          
          // Check if user exists in your users table, create if not
          const { data: userRecord, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (userError && userError.code === 'PGRST116') {
            // User doesn't exist in users table, create them
            const { data: newUser, error: createError } = await supabase
              .from('users')
              .insert([
                {
                  id: user.id,
                  email: user.email,
                  name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Art Lover',
                  profile_image_url: user.user_metadata?.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face`,
                  location: user.user_metadata?.location || 'New York, NY'
                }
              ])
              .select()
              .single();

            if (!createError && newUser) {
              setUserProfile({
                name: newUser.name || 'Art Lover',
                bio: 'Passionate about discovering amazing art and connecting with talented artists.',
                location: newUser.location || 'New York, NY',
                specialty: 'Art Enthusiast',
                profileImage: newUser.profile_image_url
              });
            }
          } else if (!userError && userRecord) {
            setUserProfile({
              name: userRecord.name || 'Art Lover',
              bio: 'Passionate about discovering amazing art and connecting with talented artists.',
              location: userRecord.location || 'New York, NY', 
              specialty: 'Art Enthusiast',
              profileImage: userRecord.profile_image_url
            });
          } else {
            // Fallback to user_metadata
            setUserProfile({
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Art Lover',
              bio: user.user_metadata?.bio || 'Passionate about discovering amazing art and connecting with talented artists.',
              location: user.user_metadata?.location || 'New York, NY',
              specialty: user.user_metadata?.specialty || 'Art Enthusiast',
              profileImage: user.user_metadata?.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face`
            });
          }
          console.log('User is logged in:', user.email);
        }
      }
    };
    checkAuth();
    
    if (supabase) {
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          setUserProfile({
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Art Lover',
            bio: session.user.user_metadata?.bio || 'Passionate about discovering amazing art and connecting with talented artists.',
            location: session.user.user_metadata?.location || 'New York, NY',
            specialty: session.user.user_metadata?.specialty || 'Art Enthusiast',
            profileImage: session.user.user_metadata?.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face`
          });
        }
      };
      checkSession();

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session);
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setUserProfile({
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Art Lover',
            bio: session.user.user_metadata?.bio || 'Passionate about discovering amazing art and connecting with talented artists.',
            location: session.user.user_metadata?.location || 'New York, NY',
            specialty: session.user.user_metadata?.specialty || 'Art Enthusiast',
            profileImage: session.user.user_metadata?.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face`
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile({ name: '', bio: '', location: '', specialty: '', profileImage: '' });
        }
      });
      
      return () => subscription.unsubscribe();
    }
  }, []);

  return {
    user,
    userProfile,
    isLoggedIn: !!user,
    updateProfile,
    handleLogin,
    handleGoogleLogin,
    handleMobileTestLogin,
    handleProfileUpdate,
    handleProfileImageUpload,
    signOut
  };
}