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

  // Restore session from localStorage on initialization
  const restoreSession = () => {
    try {
      // Only restore demo users from localStorage
      // Real users will be restored by Supabase session
      const savedUser = localStorage.getItem('lantin-demo-user');
      const savedProfile = localStorage.getItem('lantin-demo-profile');
      
      if (savedUser && savedProfile) {
        const parsedUser = JSON.parse(savedUser);
        const parsedProfile = JSON.parse(savedProfile);
        
        console.log('🔄 Restoring demo session from localStorage:', parsedUser.email);
        setUser(parsedUser);
        setUserProfile(parsedProfile);
        return true;
      }
    } catch (error) {
      console.error('❌ Error restoring session:', error);
      // Clear corrupted data
      localStorage.removeItem('lantin-demo-user');
      localStorage.removeItem('lantin-demo-profile');
    }
    return false;
  };

  const updateProfile = (updates) => {
    const newProfile = { ...userProfile, ...updates };
    setUserProfile(newProfile);
    
    // Also update localStorage if user exists
    if (user) {
      localStorage.setItem('lantin-demo-profile', JSON.stringify(newProfile));
    }
  };

  const loadUserProfileFromDatabase = async (authUser: any) => {
    try {
      console.log('🔍 Loading user profile from database for:', authUser.email);
      console.log('🔍 Supabase available:', !!supabase);
      console.log('🔍 Auth user ID:', authUser.id);

      if (supabase && authUser.email && authUser.email !== 'test@mobile.com') {
        // Try to load from database first
        console.log('📡 Querying artists table for email:', authUser.email);
        const { data: artistRecord, error } = await supabase
          .from('artists')
          .select('*')
          .eq('email', authUser.email)
          .single();

        console.log('📊 Database query result:', { artistRecord, error });

        if (error && error.code === 'PGRST116') {
          // Artist doesn't exist, create a new record with defaults
          console.log('📝 Creating new artist record for:', authUser.email);

          const newArtistData = {
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Artist',
            bio: 'Passionate about creating and sharing amazing art.',
            location: 'Art Studio',
            created_at: new Date().toISOString()
          };

          const { data: newArtist, error: createError } = await supabase
            .from('artists')
            .insert([newArtistData])
            .select()
            .single();

          if (createError) {
            console.error('❌ Failed to create artist record:', createError);
            // Use fallback profile
          } else if (newArtist) {
            console.log('✅ Created new artist record:', newArtist);
            const newProfile = {
              name: newArtist.name || 'Artist',
              bio: newArtist.bio || '',
              location: newArtist.location || 'Art Studio',
              specialty: newArtist.specialty || 'Art Enthusiast',
              profileImage: newArtist.profile_image_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face`
            };
            console.log('🔄 Setting new profile:', newProfile);
            setUserProfile(newProfile);
            return;
          }
        } else if (!error && artistRecord) {
          console.log('✅ Loaded existing profile from database:', artistRecord);
          const existingProfile = {
            name: artistRecord.name || authUser.email?.split('@')[0] || 'Artist',
            bio: artistRecord.bio || '',
            location: artistRecord.location || 'Art Studio',
            specialty: artistRecord.specialty || 'Art Enthusiast',
            profileImage: artistRecord.profile_image_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face`
          };
          console.log('🔄 Setting existing profile:', existingProfile);
          setUserProfile(existingProfile);
          return;
        } else {
          console.error('❌ Unexpected database error:', error);
        }
      }

      // Fallback to defaults if database operations failed or demo user
      console.log('📱 Using fallback profile values');
      setUserProfile({
        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Art Lover',
        bio: authUser.user_metadata?.bio || 'Passionate about discovering amazing art and connecting with talented artists.',
        location: authUser.user_metadata?.location || 'New York, NY',
        specialty: authUser.user_metadata?.specialty || 'Art Enthusiast',
        profileImage: authUser.user_metadata?.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face`
      });

    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      // Final fallback to defaults on error
      setUserProfile({
        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Art Lover',
        bio: authUser.user_metadata?.bio || 'Passionate about discovering amazing art and connecting with talented artists.',
        location: authUser.user_metadata?.location || 'New York, NY',
        specialty: authUser.user_metadata?.specialty || 'Art Enthusiast',
        profileImage: authUser.user_metadata?.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face`
      });
    }
  };

  const handleLogin = async () => {
    if (supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google'
          // No redirectTo options to avoid interfering with OTP
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

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Send 6-digit email verification code
  const sendEmailCode = async (email: string) => {
    if (!supabase) {
      console.log('No Supabase, using demo login');
      handleMobileTestLogin();
      return false;
    }

    try {
      console.log('Sending 6-digit code to:', email);
      
      // Use Supabase signInWithOtp with explicit OTP channel
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true, // Allow automatic user creation for OTP
          emailRedirectTo: undefined, // Explicitly disable redirect URLs
          data: {
            // Force OTP token instead of magic link
            confirmation_sent_at: new Date().toISOString()
          }
        }
      });
      
      console.log('🔍 Supabase OTP response:', { data, error });
      
      if (error) {
        console.error('OTP error details:', error);
        throw error;
      }
      
      console.log('✅ 6-digit code sent successfully');
      return true;
    } catch (error) {
      console.error('❌ Email code error:', error);
      throw error;
    }
  };

  // Handle 6-digit email OTP verification
  const handleEmailOtpLogin = async (email: string, otp: string) => {
    if (!supabase) {
      console.log('No Supabase, using demo login');
      handleMobileTestLogin();
      return false;
    }

    try {
      console.log('Verifying OTP for:', email);
      
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email'
      });

      if (error) throw error;
      
      if (data.session) {
        console.log('✅ OTP verification successful:', data.session.user.email);
        
        // Create or update user in artists table
        try {
          const { error: upsertError } = await supabase
            .from('artists')
            .upsert({
              id: data.session.user.id,
              email: data.session.user.email,
              name: data.session.user.user_metadata?.full_name || 'Artist',
              bio: 'Passionate about creating and sharing amazing art.',
              created_at: new Date().toISOString()
            }, {
              onConflict: 'email'
            });
          
          if (upsertError) {
            console.warn('Failed to create/update artist record:', upsertError);
          } else {
            console.log('✅ Artist record created/updated');
          }
        } catch (artistError) {
          console.warn('Artist table sync failed:', artistError);
        }
        
        setUser(data.session.user);
        // Load the profile data after successful login
        await loadUserProfileFromDatabase(data.session.user);
        return true;
      } else {
        throw new Error('No session created after OTP verification');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Google login clicked');
    try {
      // For mobile devices, use redirect instead of popup
      const authOptions = {
        provider: 'google',
        options: {
          // No redirectTo to avoid interfering with OTP behavior
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      };

      // Use redirect for mobile, popup for desktop
      if (isMobile()) {
        console.log('Mobile detected, using redirect auth');
        const { error } = await supabase.auth.signInWithOAuth(authOptions);
        if (error) throw error;
      } else {
        console.log('Desktop detected, using popup auth');
        const { data, error } = await supabase.auth.signInWithOAuth({
          ...authOptions,
          options: {
            ...authOptions.options,
            skipBrowserRedirect: false
          }
        });
        if (error) throw error;
      }
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
    
    const mockProfile = {
      name: mockUser.user_metadata.full_name,
      bio: mockUser.user_metadata.bio,
      location: 'Mobile Device',
      specialty: 'Art Enthusiast',
      profileImage: mockUser.user_metadata.avatar_url
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('lantin-demo-user', JSON.stringify(mockUser));
    localStorage.setItem('lantin-demo-profile', JSON.stringify(mockProfile));
    
    console.log('Setting user:', mockUser);
    setUser(mockUser);
    setUserProfile(mockProfile);
    
    console.log('Login state updated and persisted');
    alert('Demo login successful! You can now create booths and events.');
  };

  const handleProfileUpdate = async () => {
    if (!user) {
      alert('Please log in to update your profile');
      return;
    }

    console.log('🔧 Profile update debug info:');
    console.log('User:', user);
    console.log('User email:', user.email);
    console.log('Supabase exists:', !!supabase);
    console.log('Is real user?:', user.email && user.email !== 'test@mobile.com');

    try {
      if (supabase && user.email && user.email !== 'test@mobile.com') {
        // Real authenticated user with Supabase session
        const updateData = {
          name: userProfile.name,
          bio: userProfile.bio,
          location: userProfile.location,
          specialty: userProfile.specialty,
          profile_image_url: userProfile.profileImage
        };
        
        console.log('🔧 Updating database with:', updateData);
        console.log('🔧 User email for query:', user.email);
        
        // Update artists table
        const { data, error: artistError } = await supabase
          .from('artists')
          .update(updateData)
          .eq('email', user.email)
          .select();
        
        console.log('🔧 Database response:', { data, error: artistError });
        
        if (artistError) {
          console.error('Artists table update failed:', artistError);
          throw new Error('Failed to sync profile to database: ' + artistError.message);
        }
        
        if (data && data.length > 0) {
          console.log('✅ Profile updated in database successfully!');
          console.log('📝 Updated record:', data[0]);
          console.log('📊 Record details:');
          console.log('  - ID:', data[0].id);
          console.log('  - Name:', data[0].name);
          console.log('  - Bio:', data[0].bio);
          console.log('  - Location:', data[0].location);
          console.log('  - Email:', data[0].email);
          
          // Verify the update by querying the record again
          console.log('🔍 Verifying update by re-querying database...');
          const { data: verifyData, error: verifyError } = await supabase
            .from('artists')
            .select('*')
            .eq('email', user.email)
            .single();
          
          if (verifyError) {
            console.error('❌ Failed to verify update:', verifyError);
          } else {
            console.log('✅ Verification successful - current database record:');
            console.log('  - Name:', verifyData.name);
            console.log('  - Bio:', verifyData.bio);
            console.log('  - Location:', verifyData.location);
          }
        } else {
          console.warn('⚠️ No records were updated - this might mean the email query didn\'t match any existing records');
          
          // Check if there's actually a record with this email
          console.log('🔍 Checking if artist record exists for email:', user.email);
          const { data: checkData, error: checkError } = await supabase
            .from('artists')
            .select('*')
            .eq('email', user.email);
          
          if (checkError) {
            console.error('❌ Failed to check for existing record:', checkError);
          } else {
            console.log('📋 Existing records found:', checkData.length);
            if (checkData.length > 0) {
              console.log('📝 Existing record:', checkData[0]);
            }
          }
        }
        localStorage.setItem('lantin-demo-profile', JSON.stringify(userProfile));
        alert('Profile updated successfully in database!');
      } else {
        // Demo user - localStorage only
        localStorage.setItem('lantin-demo-profile', JSON.stringify(userProfile));
        console.log('📱 Demo mode: Profile saved to localStorage');
        alert('Profile updated successfully (demo mode)!');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile: ' + error.message);
    }
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Check if we have Supabase and a valid session
      if (supabase && user?.id) {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (session && session.user) {
          console.log('📤 Uploading profile image to Supabase storage...');

          // Create unique filename for profile image
          const fileExt = file.name.split('.').pop();
          const fileName = `profiles/${session.user.id}/${Date.now()}-profile.${fileExt}`;

          // Upload to Supabase storage
          const { data, error } = await supabase.storage
            .from('artist-profiles')
            .upload(fileName, file);

          if (error) {
            console.error('Profile image upload error:', error);
            throw new Error(`Failed to upload profile image: ${error.message}`);
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('artist-profiles')
            .getPublicUrl(fileName);

          console.log('✅ Profile image uploaded successfully:', publicUrl);
          updateProfile({ profileImage: publicUrl });
          return;
        }
      }

      // Fallback to local URL (demo user or no session)
      console.log('📱 Using local file URL for profile image (demo mode)');
      const imageUrl = URL.createObjectURL(file);
      updateProfile({ profileImage: imageUrl });

    } catch (error) {
      console.error('Profile image upload error:', error);

      // Fallback to local URL on error
      console.log('🔄 Cloud upload failed, falling back to local URL...');
      const imageUrl = URL.createObjectURL(file);
      updateProfile({ profileImage: imageUrl });

      alert(`Cloud upload failed, using local image instead. Error: ${error.message}`);
    }
  };

  const signOut = async () => {
    console.log('Signing out...');

    // Clear demo user localStorage
    localStorage.removeItem('lantin-demo-user');
    localStorage.removeItem('lantin-demo-profile');

    setUser(null);
    // Don't clear profile immediately - let auth state change handle it

    if (supabase) {
      try {
        await supabase.auth.signOut();
        console.log('✅ Signed out from Supabase');
      } catch (error) {
        console.error('❌ Error signing out from Supabase:', error);
      }
    }

    console.log('✅ Logout completed');
  };


  // Auth state management - consolidated and fixed
  useEffect(() => {
    // First, try to restore session from localStorage (for demo users)
    const restoredFromLocal = restoreSession();

    if (!supabase) {
      if (!restoredFromLocal) {
        console.log('ℹ️ No Supabase and no local session found');
      }
      return;
    }

    // Initialize auth and set up listener
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');

        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
        } else if (session) {
          console.log('✅ Found existing session:', session.user.email);
          setUser(session.user);
          await loadUserProfileFromDatabase(session.user);
        } else {
          console.log('ℹ️ No existing session found');
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
      }
    };

    initializeAuth();

    // Single auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state change:', event, session?.user?.email);
      console.log('🔍 Current profile before change:', userProfile);

      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in successfully:', session.user.email);
        setUser(session.user);
        console.log('📞 Calling loadUserProfileFromDatabase...');
        await loadUserProfileFromDatabase(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setUser(null);
        setUserProfile({ name: '', bio: '', location: '', specialty: '', profileImage: '' });
        console.log('🗑️ Profile cleared on sign out');
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('🔄 Token refreshed for:', session.user.email);
        console.log('🔄 Current user state:', !!user, 'Profile name:', userProfile.name);
        // Don't reload profile on token refresh if user is same
      } else {
        console.log('ℹ️ Auth event:', event, 'Session:', !!session);
        if (!session) {
          setUser(null);
          setUserProfile({ name: '', bio: '', location: '', specialty: '', profileImage: '' });
          console.log('🗑️ Profile cleared - no session');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Note: Mobile auth token handling is now done manually via the UI

  return {
    user,
    userProfile,
    isLoggedIn: !!user,
    updateProfile,
    handleLogin,
    handleGoogleLogin,
    sendEmailCode,
    handleEmailOtpLogin,
    handleMobileTestLogin,
    handleProfileUpdate,
    handleProfileImageUpload,
    signOut
  };
}