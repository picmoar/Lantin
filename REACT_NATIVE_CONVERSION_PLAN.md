# 🚀 **LANTIN APP - React Native Conversion Plan**

## 📋 **COMPLETE PROJECT ROADMAP**

### **Project Overview:**
- **Current**: React TypeScript Web App with Supabase
- **Target**: React Native iOS/Android App with Same Database
- **Timeline**: 8 weeks (160-200 hours)
- **Database**: Keep existing Supabase (zero migration needed)
- **Skills Required**: Your existing React/TypeScript knowledge

---

## **🎯 PHASE 1: PROJECT SETUP & FOUNDATION**
**Timeline: Week 1 (5 days)**
**Estimated Hours: 20-25 hours**

### **Day 1: Environment Setup (4-5 hours)**

#### **Prerequisites Installation:**
```bash
# 1. Install Xcode (from App Store - large download, start first)
# 2. Install Xcode Command Line Tools
xcode-select --install

# 3. Install Node.js dependencies
npm install -g react-native-cli
npm install -g @react-native-community/cli

# 4. Install CocoaPods (iOS dependency manager)
sudo gem install cocoapods

# 5. Verify installation
npx react-native doctor
```

#### **Create New React Native Project:**
```bash
# Navigate to your projects directory
cd /Users/omniscience/Desktop/

# Create new React Native project
npx react-native@latest init LantinAppNative --template react-native-template-typescript

# Navigate into project
cd LantinAppNative

# Test basic setup
npx react-native run-ios
```

### **Day 2: Core Dependencies Installation (3-4 hours)**

#### **Navigation System:**
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
cd ios && pod install && cd ..
```

#### **Database & Authentication:**
```bash
npm install @supabase/supabase-js
npm install @react-native-async-storage/async-storage
cd ios && pod install && cd ..
```

#### **UI & Media Components:**
```bash
npm install react-native-vector-icons
npm install react-native-image-picker
npm install react-native-image-crop-picker
npm install react-native-maps
npm install react-native-paper
cd ios && pod install && cd ..
```

#### **Additional Utilities:**
```bash
npm install react-native-date-picker
npm install react-native-keyboard-aware-scroll-view
npm install react-native-modal
npm install @react-native-community/datetimepicker
cd ios && pod install && cd ..
```

### **Day 3: Project Structure Setup (4-5 hours)**

#### **Create Folder Structure:**
```bash
cd LantinAppNative
mkdir -p src/components
mkdir -p src/screens
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/types
mkdir -p src/navigation
mkdir -p src/styles
mkdir -p src/utils
mkdir -p src/assets/images
```

#### **Copy Configuration Files:**
```bash
# Copy existing TypeScript interfaces
cp ../lantin/app/src/types/* src/types/

# Copy Supabase configuration (will modify for mobile)
cp ../lantin/app/src/lib/supabase.ts src/lib/
```

### **Day 4: Basic Navigation Setup (4-5 hours)**

#### **Create Navigation Structure:**
```typescript
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screen imports (create empty screens first)
import DiscoverScreen from '../screens/DiscoverScreen';
import SpotlightScreen from '../screens/SpotlightScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Discover': iconName = 'explore'; break;
              case 'Spotlight': iconName = 'star'; break;
              case 'Messages': iconName = 'message'; break;
              case 'Profile': iconName = 'person'; break;
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Discover" component={DiscoverScreen} />
        <Tab.Screen name="Spotlight" component={SpotlightScreen} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

#### **Create Empty Screen Templates:**
```typescript
// src/screens/DiscoverScreen.tsx (template for all screens)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Screen</Text>
      <Text>Converting from web DiscoverTab...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

// Repeat for: SpotlightScreen, MessagesScreen, ProfileScreen
```

### **Day 5: Supabase Integration (4-5 hours)**

#### **Update Supabase Configuration for Mobile:**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'YOUR_SUPABASE_URL'; // Copy from web app
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Copy from web app

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for mobile
  },
});
```

#### **Copy and Adapt Authentication Hook:**
```typescript
// src/hooks/useAuth.ts
// Copy your existing useAuth hook from web app
// Modify storage mechanism to use AsyncStorage instead of localStorage
// Keep all database logic identical
```

#### **Test Database Connection:**
```typescript
// Add to any screen to test
useEffect(() => {
  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('booths').select('count');
      console.log('Database connected:', data);
    } catch (error) {
      console.log('Connection error:', error);
    }
  };
  testConnection();
}, []);
```

---

## **🎨 PHASE 2: CORE SCREENS CONVERSION**
**Timeline: Week 2-3 (10 days)**
**Estimated Hours: 50-60 hours**

### **Week 2: Basic Screens (Profile & Messages)**

#### **Day 6-7: Profile Screen Conversion (8-10 hours)**

#### **Convert ProfileTab → ProfileScreen:**
```typescript
// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function ProfileScreen() {
  const { userProfile, logout } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: userProfile?.profileImage || 'default-avatar.png' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{userProfile?.name}</Text>
        <Text style={styles.bio}>{userProfile?.bio}</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setShowEditModal(true)}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid - Convert from web version */}
      <View style={styles.statsContainer}>
        {/* Convert your existing stats display */}
      </View>

      {/* User Content - Convert carousel */}
      <View style={styles.contentContainer}>
        {/* Convert your artwork carousel */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: 'white', padding: 20, alignItems: 'center' },
  avatarContainer: { marginBottom: 15 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  bio: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
  editButton: {
    backgroundColor: '#61858b',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20
  },
  editButtonText: { color: 'white', fontWeight: '600' },
  statsContainer: { /* Add stats styling */ },
  contentContainer: { /* Add content styling */ }
});
```

#### **Convert Profile Components:**
```bash
# Create component files:
src/components/ProfileHeader.tsx
src/components/StatsGrid.tsx
src/components/ArtworkCarousel.tsx
src/components/ProfileEditModal.tsx

# Copy logic from web versions, convert:
# - div → View
# - img → Image
# - button → TouchableOpacity
# - CSS → StyleSheet
```

#### **Day 8-9: Messages Screen Conversion (8-10 hours)**

#### **Convert MessagesTab → MessagesScreen:**
```typescript
// src/screens/MessagesScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useMessages } from '../hooks/useMessages'; // Copy from web

export default function MessagesScreen() {
  const { conversations, loading } = useMessages();

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => {/* Navigate to chat */}}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={styles.senderName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading conversations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  list: { flex: 1 },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  messageContent: { flex: 1 },
  senderName: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  lastMessage: { fontSize: 14, color: '#666' },
  timestamp: { fontSize: 12, color: '#999' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
```

#### **Copy Message Hooks:**
```bash
# Copy from web app:
cp ../lantin/app/src/hooks/useMessages.tsx src/hooks/
cp ../lantin/app/src/hooks/useConversations.tsx src/hooks/

# Minimal modifications needed - database logic stays same
```

#### **Day 10: Navigation Polish & Testing (4-5 hours)**

```typescript
// Add navigation between screens
// Test tab switching
// Verify basic functionality
// Fix any styling issues
```

### **Week 3: Main Content Screens**

#### **Day 11-13: Discover Screen Conversion (12-15 hours)**

#### **Convert DiscoverTab → DiscoverScreen:**
```typescript
// src/screens/DiscoverScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  RefreshControl,
  View,
  StyleSheet
} from 'react-native';
import { useUserContent } from '../hooks/useUserContent'; // Copy from web

// Import converted components
import ArtistCard from '../components/ArtistCard';
import ArtworkCarousel from '../components/ArtworkCarousel';

export default function DiscoverScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const {
    featuredArtists,
    featuredArtworks,
    loadContent,
    loading
  } = useUserContent();

  const onRefresh = async () => {
    setRefreshing(true);
    await loadContent();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Featured Artists Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Artists</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredArtists.map(artist => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </ScrollView>
      </View>

      {/* Featured Artworks Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Artworks</Text>
        <ArtworkCarousel artworks={featuredArtworks} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 15,
    color: '#333'
  }
});
```

#### **Convert Discover Components:**
```bash
# Create and convert these components:
src/components/ArtistCard.tsx         # From discover_subcom
src/components/ArtworkCarousel.tsx    # From discover_subcom
src/components/ArtworkSelector.tsx    # From discover_subcom
src/components/BiographySection.tsx   # From discover_subcom
src/components/BoothSection.tsx       # From discover_subcom
src/components/ContactSection.tsx     # From discover_subcom
src/components/SaleArtworkSection.tsx # From discover_subcom

# Copy corresponding hooks:
src/hooks/useBoothInfo.tsx           # From discover_subcom/hooks
src/hooks/useContactInfo.tsx         # From discover_subcom/hooks
src/hooks/useGalleryArtworks.tsx     # From discover_subcom/hooks
src/hooks/useSaleArtworks.tsx        # From discover_subcom/hooks
```

#### **Day 14-15: Spotlight Screen Conversion (12-15 hours)**

#### **Convert SpotlightTab → SpotlightScreen:**
```typescript
// src/screens/SpotlightScreen.tsx
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';

// Import converted components
import BoothCard from '../components/BoothCard';
import EventCard from '../components/EventCard';
import FilterBar from '../components/FilterBar';
import CreateBoothModal from '../components/CreateBoothModal';
import CreateEventModal from '../components/CreateEventModal';

export default function SpotlightScreen() {
  const [activeTab, setActiveTab] = useState('booths');
  const [showCreateBooth, setShowCreateBooth] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header with Create Buttons */}
      <View style={styles.header}>
        <Text style={styles.title}>Spotlight</Text>
        <View style={styles.createButtons}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateBooth(true)}
          >
            <Text style={styles.createButtonText}>+ Booth</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateEvent(true)}
          >
            <Text style={styles.createButtonText}>+ Event</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'booths' && styles.activeTab]}
          onPress={() => setActiveTab('booths')}
        >
          <Text style={[styles.tabText, activeTab === 'booths' && styles.activeTabText]}>
            Booths
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
            Events
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <FilterBar activeTab={activeTab} />

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'booths' ? (
          <BoothSection />
        ) : (
          <EventSection />
        )}
      </ScrollView>

      {/* Modals */}
      <CreateBoothModal
        visible={showCreateBooth}
        onClose={() => setShowCreateBooth(false)}
      />
      <CreateEventModal
        visible={showCreateEvent}
        onClose={() => setShowCreateEvent(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white'
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  createButtons: { flexDirection: 'row', gap: 10 },
  createButton: {
    backgroundColor: '#61858b',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20
  },
  createButtonText: { color: 'white', fontWeight: '600' },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center'
  },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#61858b' },
  tabText: { fontSize: 16, color: '#666' },
  activeTabText: { color: '#61858b', fontWeight: '600' },
  content: { flex: 1 }
});
```

#### **Convert Spotlight Components:**
```bash
# Create and convert these components:
src/components/BoothCard.tsx          # From spotlight_tab_subcom/components
src/components/EventCard.tsx          # From spotlight_tab_subcom/components
src/components/UserBoothCard.tsx      # From spotlight_tab_subcom/components
src/components/FilterBar.tsx          # From spotlight_tab_subcom/components
src/components/HeaderSection.tsx      # From spotlight_tab_subcom/components
src/components/EmptyState.tsx         # From spotlight_tab_subcom/components

# Copy corresponding hooks:
src/hooks/useBoothFilters.ts         # From spotlight_tab_subcom/hooks
src/hooks/useBoothNavigation.ts      # From spotlight_tab_subcom/hooks
src/hooks/useSpotlightActions.ts     # From spotlight_tab_subcom/hooks
src/hooks/useTabState.ts             # From spotlight_tab_subcom/hooks
```

---

## **🔄 PHASE 3: COMPLEX MODALS & INTERACTIONS**
**Timeline: Week 4-5 (10 days)**
**Estimated Hours: 60-70 hours**

### **Week 4: Detail Modals**

#### **Day 16-17: Profile Edit Modal (8-10 hours)**

#### **Convert ProfileEditModal → React Native Modal:**
```typescript
// src/components/ProfileEditModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  userProfile: any;
  onUpdate: (updates: any) => void;
}

export default function ProfileEditModal({
  visible,
  onClose,
  userProfile,
  onUpdate
}: ProfileEditModalProps) {
  const [name, setName] = useState(userProfile?.name || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [location, setLocation] = useState(userProfile?.location || '');
  const [profileImage, setProfileImage] = useState(userProfile?.profileImage);

  const handleImagePicker = () => {
    Alert.alert(
      'Select Photo',
      'Choose from where you want to select a photo',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
    }).then(image => {
      setProfileImage(image.path);
    }).catch(error => {
      console.log('Camera error:', error);
    });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
    }).then(image => {
      setProfileImage(image.path);
    }).catch(error => {
      console.log('Gallery error:', error);
    });
  };

  const handleSave = async () => {
    try {
      const updates = {
        name,
        bio,
        location,
        profileImage
      };
      await onUpdate(updates);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Profile Image */}
          <View style={styles.imageSection}>
            <TouchableOpacity onPress={handleImagePicker}>
              <Image
                source={{ uri: profileImage || 'default-avatar.png' }}
                style={styles.profileImage}
              />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Where are you based?"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  cancelButton: { color: '#ff3b30', fontSize: 16 },
  title: { fontSize: 18, fontWeight: '600' },
  saveButton: { color: '#007aff', fontSize: 16, fontWeight: '600' },
  content: { flex: 1, padding: 20 },
  imageSection: { alignItems: 'center', marginBottom: 30 },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10
  },
  changePhotoText: { color: '#007aff', fontSize: 16 },
  formSection: { gap: 20 },
  fieldContainer: {},
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  textArea: { height: 100, textAlignVertical: 'top' }
});
```

#### **Day 18-19: Booth/Event Details Modals (10-12 hours)**

#### **Convert BoothDetailsModal & EventDetailsModal:**
```typescript
// src/components/BoothDetailsModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '../lib/supabase';

const { width, height } = Dimensions.get('window');

interface BoothDetailsModalProps {
  visible: boolean;
  booth: any;
  onClose: () => void;
  user?: any;
}

export default function BoothDetailsModal({
  visible,
  booth,
  onClose,
  user
}: BoothDetailsModalProps) {
  const [hasVisited, setHasVisited] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    if (visible && booth) {
      loadBoothData();
    }
  }, [visible, booth]);

  const loadBoothData = async () => {
    if (!supabase || !booth) return;

    try {
      // Get visitor count
      const { data: boothData } = await supabase
        .from('booths')
        .select('visitor_count')
        .eq('id', booth.id)
        .single();

      if (boothData) {
        setVisitorCount(boothData.visitor_count || 0);
      }

      // Check if user has visited
      if (user) {
        const { data: visitData } = await supabase
          .from('booth_visits')
          .select('id')
          .eq('booth_id', booth.id)
          .eq('user_id', user.id)
          .maybeSingle();

        setHasVisited(!!visitData);
      }
    } catch (error) {
      console.warn('Error loading booth data:', error);
    }
  };

  const handleVisitToggle = async () => {
    if (!user || !supabase) {
      Alert.alert('Please log in to track your visits');
      return;
    }

    try {
      if (hasVisited) {
        // Remove visit
        await supabase
          .from('booth_visits')
          .delete()
          .eq('booth_id', booth.id)
          .eq('user_id', user.id);

        setHasVisited(false);
        setVisitorCount(prev => prev - 1);
      } else {
        // Add visit
        await supabase
          .from('booth_visits')
          .insert({
            booth_id: booth.id,
            user_id: user.id
          });

        setHasVisited(true);
        setVisitorCount(prev => prev + 1);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update visit status');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Main Image */}
          <Image
            source={{ uri: booth?.image }}
            style={styles.mainImage}
            resizeMode="cover"
          />

          {/* Booth Info */}
          <View style={styles.infoSection}>
            <Text style={styles.boothName}>{booth?.name}</Text>
            <Text style={styles.artist}>by {booth?.artist}</Text>
            <Text style={styles.description}>{booth?.description}</Text>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{visitorCount}</Text>
                <Text style={styles.statLabel}>Visitors</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{booth?.artworks || 0}</Text>
                <Text style={styles.statLabel}>Artworks</Text>
              </View>
            </View>

            {/* Visit Button */}
            <TouchableOpacity
              style={[
                styles.visitButton,
                hasVisited && styles.visitedButton
              ]}
              onPress={handleVisitToggle}
            >
              <Text style={[
                styles.visitButtonText,
                hasVisited && styles.visitedButtonText
              ]}>
                {hasVisited ? 'Cancel Visit' : 'Visit Booth'}
              </Text>
            </TouchableOpacity>

            {/* Schedule */}
            <View style={styles.scheduleSection}>
              <Text style={styles.sectionTitle}>Schedule</Text>
              <Text style={styles.scheduleText}>
                {booth?.start_date} - {booth?.end_date}
              </Text>
              <Text style={styles.scheduleText}>
                {booth?.start_time} - {booth?.end_time}
              </Text>
            </View>

            {/* Location */}
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>Location</Text>
              <Text style={styles.locationText}>{booth?.location}</Text>

              {booth?.latitude && booth?.longitude && (
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: parseFloat(booth.latitude),
                    longitude: parseFloat(booth.longitude),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: parseFloat(booth.latitude),
                      longitude: parseFloat(booth.longitude),
                    }}
                    title={booth.name}
                  />
                </MapView>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1 },
  mainImage: { width, height: height * 0.4 },
  infoSection: { padding: 20 },
  boothName: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  artist: { fontSize: 16, color: '#666', marginBottom: 15 },
  description: { fontSize: 16, lineHeight: 24, marginBottom: 20 },
  statsRow: { flexDirection: 'row', marginBottom: 20 },
  stat: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#61858b' },
  statLabel: { fontSize: 14, color: '#666' },
  visitButton: {
    backgroundColor: '#61858b',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20
  },
  visitedButton: { backgroundColor: '#ff6b6b' },
  visitButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  visitedButtonText: { color: 'white' },
  scheduleSection: { marginBottom: 20 },
  locationSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  scheduleText: { fontSize: 16, color: '#666', marginBottom: 5 },
  locationText: { fontSize: 16, color: '#666', marginBottom: 10 },
  map: { height: 200, borderRadius: 10 }
});

// Similar structure for EventDetailsModal with event-specific fields
```

#### **Day 20: Artwork Detail Modal (4-5 hours)**

```typescript
// src/components/ArtworkDetailModal.tsx
// Convert existing artwork modal with:
// - Image gallery (horizontal scroll)
// - Artwork details
// - Purchase/inquiry buttons
// - Artist information
```

### **Week 5: Creation Modals**

#### **Day 21-23: Create Booth Modal (15-18 hours)**

#### **Convert CreateBoothModal → Multi-step React Native Modal:**
```typescript
// src/components/CreateBoothModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DatePicker from 'react-native-date-picker';
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '../lib/supabase';

interface CreateBoothModalProps {
  visible: boolean;
  onClose: () => void;
  user: any;
}

export default function CreateBoothModal({
  visible,
  onClose,
  user
}: CreateBoothModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    latitude: null,
    longitude: null,
    startDate: new Date(),
    endDate: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    image: null,
    highlightPhotos: []
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('start');
  const [loading, setLoading] = useState(false);

  const handleImagePicker = (type: 'main' | 'highlight') => {
    Alert.alert(
      'Select Photo',
      'Choose from where you want to select a photo',
      [
        { text: 'Camera', onPress: () => openCamera(type) },
        { text: 'Gallery', onPress: () => openGallery(type) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = (type: 'main' | 'highlight') => {
    ImagePicker.openCamera({
      width: 800,
      height: 600,
      cropping: true,
    }).then(image => {
      if (type === 'main') {
        setFormData(prev => ({ ...prev, image: image.path }));
      } else {
        setFormData(prev => ({
          ...prev,
          highlightPhotos: [...prev.highlightPhotos, image.path]
        }));
      }
    }).catch(error => {
      console.log('Camera error:', error);
    });
  };

  const openGallery = (type: 'main' | 'highlight') => {
    const options = type === 'main'
      ? { width: 800, height: 600, cropping: true }
      : { multiple: true, maxFiles: 5 };

    ImagePicker.openPicker(options).then(images => {
      if (type === 'main') {
        setFormData(prev => ({ ...prev, image: images.path }));
      } else {
        const paths = Array.isArray(images)
          ? images.map(img => img.path)
          : [images.path];
        setFormData(prev => ({
          ...prev,
          highlightPhotos: [...prev.highlightPhotos, ...paths]
        }));
      }
    }).catch(error => {
      console.log('Gallery error:', error);
    });
  };

  const handleLocationSelect = (coordinate) => {
    setFormData(prev => ({
      ...prev,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Upload images to Supabase storage
      let mainImageUrl = null;
      if (formData.image) {
        // Upload main image
        const mainImageUpload = await uploadImage(formData.image, 'booth');
        mainImageUrl = mainImageUpload.publicUrl;
      }

      // Upload highlight photos
      const highlightUrls = [];
      for (const photo of formData.highlightPhotos) {
        const upload = await uploadImage(photo, 'booth/highlights');
        highlightUrls.push(upload.publicUrl);
      }

      // Save booth to database
      const { data, error } = await supabase
        .from('booths')
        .insert([{
          name: formData.name,
          description: formData.description,
          location: formData.location,
          latitude: formData.latitude,
          longitude: formData.longitude,
          start_date: formData.startDate.toISOString().split('T')[0],
          end_date: formData.endDate.toISOString().split('T')[0],
          start_time: formData.startTime.toTimeString().slice(0, 5),
          end_time: formData.endTime.toTimeString().slice(0, 5),
          image: mainImageUrl,
          highlight_photos: highlightUrls,
          artist_id: user.id,
          operator_name: user.name || 'Artist',
          visitor_count: 0
        }]);

      if (error) throw error;

      Alert.alert('Success', 'Booth created successfully!');
      onClose();
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to create booth');
      console.error('Booth creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (imagePath: string, folder: string) => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const { data, error } = await supabase.storage
      .from('booth')
      .upload(`${user.id}/${folder}/${fileName}`, {
        uri: imagePath,
        type: 'image/jpeg',
        name: fileName,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('booth')
      .getPublicUrl(data.path);

    return { publicUrl };
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      name: '',
      description: '',
      location: '',
      latitude: null,
      longitude: null,
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      image: null,
      highlightPhotos: []
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Basic Information</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Booth Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter booth name"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Describe your booth"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Main Image</Text>
              <TouchableOpacity
                style={styles.imageUploader}
                onPress={() => handleImagePicker('main')}
              >
                {formData.image ? (
                  <Image source={{ uri: formData.image }} style={styles.uploadedImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Text style={styles.uploadText}>Tap to add image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Location</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                placeholder="Enter address"
              />
            </View>

            <Text style={styles.label}>Select on Map</Text>
            <MapView
              style={styles.mapPicker}
              onPress={(e) => handleLocationSelect(e.nativeEvent.coordinate)}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {formData.latitude && formData.longitude && (
                <Marker
                  coordinate={{
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                  }}
                />
              )}
            </MapView>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Schedule</Text>

            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => {
                    setDatePickerMode('start');
                    setShowDatePicker(true);
                  }}
                >
                  <Text>{formData.startDate.toDateString()}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateField}>
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => {
                    setDatePickerMode('end');
                    setShowDatePicker(true);
                  }}
                >
                  <Text>{formData.endDate.toDateString()}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <Text style={styles.label}>Start Time</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => {
                    setDatePickerMode('startTime');
                    setShowDatePicker(true);
                  }}
                >
                  <Text>{formData.startTime.toTimeString().slice(0, 5)}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateField}>
                <Text style={styles.label}>End Time</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => {
                    setDatePickerMode('endTime');
                    setShowDatePicker(true);
                  }}
                >
                  <Text>{formData.endTime.toTimeString().slice(0, 5)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Highlight Photos (Optional)</Text>

            <TouchableOpacity
              style={styles.addPhotosButton}
              onPress={() => handleImagePicker('highlight')}
            >
              <Text style={styles.addPhotosText}>+ Add Photos</Text>
            </TouchableOpacity>

            <ScrollView horizontal style={styles.photosPreview}>
              {formData.highlightPhotos.map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photo }} style={styles.previewPhoto} />
                  <TouchableOpacity
                    style={styles.removePhoto}
                    onPress={() => {
                      setFormData(prev => ({
                        ...prev,
                        highlightPhotos: prev.highlightPhotos.filter((_, i) => i !== index)
                      }));
                    }}
                  >
                    <Text style={styles.removePhotoText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Booth</Text>
          <TouchableOpacity
            onPress={currentStep === 4 ? handleSubmit : () => setCurrentStep(currentStep + 1)}
            disabled={loading}
          >
            <Text style={styles.nextButton}>
              {loading ? 'Creating...' : currentStep === 4 ? 'Create' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map(step => (
            <View
              key={step}
              style={[
                styles.progressStep,
                currentStep >= step && styles.activeProgressStep
              ]}
            />
          ))}
        </View>

        {/* Step Content */}
        <ScrollView style={styles.content}>
          {renderStep()}
        </ScrollView>

        {/* Step Navigation */}
        <View style={styles.stepNavigation}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Date Picker Modal */}
        <DatePicker
          modal
          open={showDatePicker}
          date={
            datePickerMode === 'start' ? formData.startDate :
            datePickerMode === 'end' ? formData.endDate :
            datePickerMode === 'startTime' ? formData.startTime :
            formData.endTime
          }
          mode={datePickerMode.includes('Time') ? 'time' : 'date'}
          onConfirm={(date) => {
            setShowDatePicker(false);
            setFormData(prev => ({
              ...prev,
              [datePickerMode === 'start' ? 'startDate' :
               datePickerMode === 'end' ? 'endDate' :
               datePickerMode === 'startTime' ? 'startTime' : 'endTime']: date
            }));
          }}
          onCancel={() => {
            setShowDatePicker(false);
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  cancelButton: { color: '#ff3b30', fontSize: 16 },
  title: { fontSize: 18, fontWeight: '600' },
  nextButton: { color: '#007aff', fontSize: 16, fontWeight: '600' },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    gap: 10
  },
  progressStep: {
    width: 60,
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2
  },
  activeProgressStep: { backgroundColor: '#61858b' },
  content: { flex: 1, padding: 20 },
  stepContainer: {},
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  fieldContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  imageUploader: {
    height: 200,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  uploadPlaceholder: { alignItems: 'center' },
  uploadText: { color: '#666', fontSize: 16 },
  uploadedImage: { width: '100%', height: '100%', borderRadius: 8 },
  mapPicker: { height: 200, borderRadius: 10 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  dateField: { flex: 1 },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center'
  },
  addPhotosButton: {
    backgroundColor: '#61858b',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20
  },
  addPhotosText: { color: 'white', fontWeight: '600' },
  photosPreview: { flexDirection: 'row' },
  photoContainer: { marginRight: 10, position: 'relative' },
  previewPhoto: { width: 80, height: 80, borderRadius: 8 },
  removePhoto: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  removePhotoText: { color: 'white', fontSize: 12 },
  stepNavigation: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  backButton: { alignSelf: 'flex-start' },
  backButtonText: { color: '#007aff', fontSize: 16 }
});
```

#### **Day 24-25: Create Event Modal (12-15 hours)**

```typescript
// src/components/CreateEventModal.tsx
// Similar structure to CreateBoothModal but with event-specific fields:
// - Event type selection (workshop, exhibition, etc.)
// - Price/ticketing options
// - Max attendees
// - Event-specific scheduling
// - Different image handling
```

---

## **🗺️ PHASE 4: NATIVE FEATURES & OPTIMIZATION**
**Timeline: Week 6 (5 days)**
**Estimated Hours: 25-35 hours**

### **Day 26-27: Device Features Integration (10-12 hours)**

#### **Camera & Photo Library Permissions:**
```bash
# iOS permissions in ios/LantinApp/Info.plist
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take photos for booths and events</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to select images for booths and events</string>
```

#### **Location Services:**
```bash
npm install @react-native-community/geolocation
cd ios && pod install && cd ..

# Add to Info.plist:
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to show nearby booths and events</string>
```

#### **Push Notifications Setup:**
```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
cd ios && pod install && cd ..

# Setup Firebase project for push notifications
# Configure APNs certificates
# Add notification handling
```

### **Day 28-29: Performance Optimization (10-12 hours)**

#### **Image Optimization:**
```typescript
// src/components/OptimizedImage.tsx
import React from 'react';
import { Image, ImageBackground } from 'react-native';
import FastImage from 'react-native-fast-image';

interface OptimizedImageProps {
  source: { uri: string };
  style: any;
  resizeMode?: 'cover' | 'contain' | 'stretch';
}

export default function OptimizedImage({ source, style, resizeMode = 'cover' }) {
  return (
    <FastImage
      source={{
        uri: source.uri,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable,
      }}
      style={style}
      resizeMode={FastImage.resizeMode[resizeMode]}
    />
  );
}
```

#### **List Performance:**
```typescript
// Optimize all FlatList components with:
// - getItemLayout for known item sizes
// - windowSize and maxToRenderPerBatch
// - removeClippedSubviews
// - keyExtractor optimization

const getItemLayout = (data, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

<FlatList
  data={items}
  renderItem={renderItem}
  getItemLayout={getItemLayout}
  windowSize={10}
  maxToRenderPerBatch={5}
  removeClippedSubviews={true}
  keyExtractor={(item) => item.id}
/>
```

#### **Memory Management:**
```typescript
// Add cleanup in useEffect hooks
useEffect(() => {
  const subscription = supabase
    .from('booths')
    .on('*', handleRealtimeUpdate)
    .subscribe();

  return () => {
    subscription.unsubscribe(); // Prevent memory leaks
  };
}, []);
```

### **Day 30: Platform-Specific UI (5-6 hours)**

#### **iOS/Android Differences:**
```typescript
// src/utils/platform.ts
import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const platformStyles = {
  shadow: isIOS ? {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  } : {
    elevation: 5,
  },

  headerHeight: isIOS ? 44 : 56,
  statusBarHeight: isIOS ? 20 : 0,
};
```

#### **Safe Area Handling:**
```typescript
// Wrap all screens with SafeAreaProvider and SafeAreaView
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <AppNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
```

---

## **🎨 PHASE 5: UI/UX MOBILE OPTIMIZATION**
**Timeline: Week 7 (5 days)**
**Estimated Hours: 25-30 hours**

### **Day 31-32: Touch Interactions & Gestures (8-10 hours)**

#### **Enhanced Touch Interactions:**
```typescript
// Convert all buttons to proper touch targets
import { TouchableOpacity, TouchableHighlight, Pressable } from 'react-native';

// Use proper touch feedback
<TouchableOpacity
  style={styles.button}
  onPress={handlePress}
  activeOpacity={0.7}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
>
  <Text style={styles.buttonText}>Tap Me</Text>
</TouchableOpacity>

// Add haptic feedback
import { HapticFeedback } from 'react-native';

const handlePress = () => {
  HapticFeedback.trigger('impactLight');
  // Handle press logic
};
```

#### **Swipe Gestures:**
```bash
npm install react-native-gesture-handler
cd ios && pod install && cd ..
```

```typescript
// Add swipe-to-delete for conversations
import { Swipeable } from 'react-native-gesture-handler';

const renderRightActions = (conversationId) => (
  <TouchableOpacity
    style={styles.deleteButton}
    onPress={() => deleteConversation(conversationId)}
  >
    <Text style={styles.deleteText}>Delete</Text>
  </TouchableOpacity>
);

<Swipeable renderRightActions={() => renderRightActions(item.id)}>
  <ConversationItem item={item} />
</Swipeable>
```

### **Day 33-34: Navigation & Animations (8-10 hours)**

#### **Smooth Navigation Transitions:**
```typescript
// Configure navigation animations
const screenOptions = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
};

<Stack.Navigator screenOptions={screenOptions}>
  <Stack.Screen name="Profile" component={ProfileScreen} />
  <Stack.Screen name="EditProfile" component={EditProfileScreen} />
</Stack.Navigator>
```

#### **Loading States & Skeleton Screens:**
```typescript
// src/components/SkeletonLoader.tsx
import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function SkeletonLoader({ width, height, style }) {
  const opacity = new Animated.Value(0.3);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, opacity },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
});
```

### **Day 35: Final Polish & Testing (6-8 hours)**

#### **App Icon & Splash Screen:**
```bash
# Generate app icons for all sizes
# Update ios/LantinApp/Images.xcassets/AppIcon.appiconset/
# Update android/app/src/main/res/mipmap-*/

# Configure splash screen
npm install react-native-splash-screen
cd ios && pod install && cd ..
```

#### **Error Boundaries:**
```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<any, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry for the inconvenience. Please try again.
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#61858b',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
```

---

## **📦 PHASE 6: APP STORE PREPARATION**
**Timeline: Week 8 (5 days)**
**Estimated Hours: 20-25 hours**

### **Day 36-37: Build Configuration (8-10 hours)**

#### **iOS Build Setup:**
```bash
# Update app information
# ios/LantinApp/Info.plist - App name, version, bundle ID
# ios/LantinApp.xcworkspace - Open in Xcode

# Configure signing & capabilities in Xcode:
# - Team selection
# - Bundle identifier: com.yourname.lantinapp
# - Version and build number
# - Required device capabilities
```

#### **Android Build Setup:**
```bash
# android/app/build.gradle
android {
    compileSdkVersion 33
    defaultConfig {
        applicationId "com.yourname.lantinapp"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
    }

    signingConfigs {
        release {
            // Add release signing configuration
        }
    }
}
```

#### **Environment Configuration:**
```typescript
// src/config/environment.ts
export const ENV = {
  SUPABASE_URL: __DEV__ ? 'dev-url' : 'prod-url',
  SUPABASE_KEY: __DEV__ ? 'dev-key' : 'prod-key',
  API_BASE_URL: __DEV__ ? 'dev-api' : 'prod-api',
};
```

### **Day 38-39: Testing & Quality Assurance (8-10 hours)**

#### **Device Testing:**
```bash
# Test on multiple devices:
# - iPhone (different models: 12, 13, 14, 15)
# - iPad (if supporting tablet)
# - Android phones (Samsung, Google Pixel)
# - Different screen sizes and orientations

# Performance testing:
# - Memory usage monitoring
# - Battery usage testing
# - Network connectivity scenarios
# - Offline functionality
```

#### **Automated Testing Setup:**
```bash
npm install --save-dev @testing-library/react-native jest
npm install --save-dev detox # for e2e testing

# Create test files:
# __tests__/components/
# __tests__/hooks/
# __tests__/screens/
# e2e/ (for end-to-end tests)
```

### **Day 40: Store Submission (4-5 hours)**

#### **App Store Connect Setup:**
1. **App Information:**
   - Name: Lantin - Art Community
   - Subtitle: Discover & Connect with Artists
   - Category: Entertainment / Social Networking
   - Content Rating: 4+

2. **App Description:**
   ```
   Discover amazing art, connect with talented artists, and explore creative booths and events in your area.

   Features:
   • Discover featured artists and their amazing artworks
   • Browse and visit creative booths near you
   • Join exciting art events and workshops
   • Connect with artists and art enthusiasts
   • Track your visits and build your art journey

   Perfect for:
   - Art lovers and collectors
   - Emerging and established artists
   - Event organizers
   - Creative communities
   ```

3. **Screenshots & Assets:**
   ```bash
   # Required screenshots for iPhone:
   # - 6.7" display (iPhone 14 Pro Max): 1290 x 2796 pixels
   # - 6.5" display (iPhone 11 Pro Max): 1242 x 2688 pixels
   # - 5.5" display (iPhone 8 Plus): 1242 x 2208 pixels

   # App Store screenshots should show:
   # - Discover screen with featured content
   # - Booth details with visit functionality
   # - Event registration and details
   # - Profile and community features
   # - Map view with locations
   ```

4. **Privacy Policy & Terms:**
   ```
   Required sections:
   - Data collection practices
   - Supabase data handling
   - User-generated content
   - Location data usage
   - Camera and photo access
   - Contact information
   ```

#### **Google Play Store Setup:**
1. **Store Listing:**
   - Same app description adapted for Android
   - Feature graphic: 1024 x 500 pixels
   - Screenshots: Various Android device sizes

2. **App Bundle Upload:**
   ```bash
   cd android
   ./gradlew bundleRelease
   # Upload generated .aab file to Play Console
   ```

---

## **📊 COMPONENT CONVERSION REFERENCE**

### **Complete Conversion Map:**

```typescript
// WEB → REACT NATIVE CONVERSION TABLE

// Layout Elements
div              → View
span, p, h1-h6   → Text
img              → Image
button           → TouchableOpacity
input            → TextInput
form             → View (with validation logic)
a                → TouchableOpacity (with navigation)
section, header  → View
ul, ol, li       → FlatList + renderItem

// Event Handlers
onClick          → onPress
onChange         → onChangeText (for TextInput)
onSubmit         → custom validation + API call
onFocus/onBlur   → onFocus/onBlur (same)

// Styling
CSS classes      → StyleSheet objects
inline styles    → style prop with objects
flexbox          → same properties, slightly different syntax
media queries    → Dimensions API + conditional styles
animations       → Animated API
transitions      → LayoutAnimation or Animated

// Navigation
<Link to="">     → navigation.navigate('')
history.push()   → navigation.navigate('')
window.location  → Linking API
back button      → navigation.goBack()

// Storage
localStorage     → AsyncStorage
sessionStorage   → AsyncStorage (with expiration logic)
cookies          → AsyncStorage or secure storage

// Network
fetch()          → fetch() (same, but consider network state)
axios            → axios (same)
WebSocket        → same, but handle app state changes

// File Handling
<input type="file"> → react-native-image-picker
drag & drop      → not available (use image picker)
file upload      → FormData with react-native-blob-util

// Maps
Google Maps embed → react-native-maps
Leaflet          → react-native-maps
Mapbox           → react-native-mapbox-gl

// Modals
CSS modal        → React Native Modal component
overlay          → Modal with transparent background
z-index          → not needed, Modal handles layering
```

---

## **🎯 SUCCESS METRICS & MILESTONES**

### **Weekly Checkpoints:**

#### **Week 1 Milestone:** ✅ Foundation Complete
- [ ] React Native project created and running
- [ ] Basic navigation between 4 main screens
- [ ] Supabase connection established
- [ ] Test data loading successfully
- [ ] Authentication working

#### **Week 2 Milestone:** ✅ Basic Screens Functional
- [ ] Profile screen displaying user data
- [ ] Messages screen showing conversations list
- [ ] Basic styling matching web app aesthetic
- [ ] Profile edit modal working with image picker

#### **Week 3 Milestone:** ✅ Core Features Working
- [ ] Discover screen with artist/artwork carousels
- [ ] Spotlight screen with booth/event cards
- [ ] Navigation between all screens smooth
- [ ] Pull-to-refresh implemented

#### **Week 4 Milestone:** ✅ Modals & Interactions Complete
- [ ] Booth/event detail modals with maps
- [ ] Visit/registration functionality working
- [ ] Real-time count updates
- [ ] Image galleries and carousels

#### **Week 5 Milestone:** ✅ Creation Flows Complete
- [ ] Create booth modal (multi-step)
- [ ] Create event modal (multi-step)
- [ ] Image upload to Supabase storage
- [ ] Location picker with maps
- [ ] Date/time selectors

#### **Week 6 Milestone:** ✅ Native Features Integrated
- [ ] Camera and photo library permissions
- [ ] Location services working
- [ ] Performance optimized (smooth scrolling)
- [ ] Memory management implemented
- [ ] Push notifications ready

#### **Week 7 Milestone:** ✅ Mobile UX Optimized
- [ ] All touch interactions polished
- [ ] Swipe gestures implemented
- [ ] Loading states and skeletons
- [ ] Error handling complete
- [ ] Haptic feedback added

#### **Week 8 Milestone:** ✅ App Store Ready
- [ ] iOS build configured and signed
- [ ] Android APK/bundle generated
- [ ] App Store Connect listing complete
- [ ] Google Play Store listing complete
- [ ] Screenshots and metadata uploaded
- [ ] Privacy policy and terms added

---

## **⚠️ POTENTIAL CHALLENGES & SOLUTIONS**

### **Technical Challenges:**

#### **1. Image Upload Performance**
**Challenge:** Large image files slow down the app
**Solution:**
```typescript
// Compress images before upload
import ImageResizer from 'react-native-image-resizer';

const compressImage = async (imagePath) => {
  const resizedImage = await ImageResizer.createResizedImage(
    imagePath,
    800,
    600,
    'JPEG',
    80, // Quality
    0,  // Rotation
    null // Output path
  );
  return resizedImage;
};
```

#### **2. Map Performance on Lists**
**Challenge:** Multiple maps in booth/event cards cause lag
**Solution:**
```typescript
// Use static map images for cards, full map for details
const StaticMapImage = ({ latitude, longitude, zoom = 15 }) => {
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=300x200&key=${GOOGLE_MAPS_API_KEY}`;

  return <Image source={{ uri: mapUrl }} style={styles.staticMap} />;
};
```

#### **3. Real-time Updates Battery Usage**
**Challenge:** Constant Supabase subscriptions drain battery
**Solution:**
```typescript
// Pause subscriptions when app is in background
import { AppState } from 'react-native';

useEffect(() => {
  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background') {
      // Unsubscribe from real-time updates
      subscriptions.forEach(sub => sub.unsubscribe());
    } else if (nextAppState === 'active') {
      // Resubscribe when app becomes active
      setupSubscriptions();
    }
  };

  AppState.addEventListener('change', handleAppStateChange);
  return () => AppState.removeEventListener('change', handleAppStateChange);
}, []);
```

#### **4. Navigation State Management**
**Challenge:** Complex navigation flow with modals
**Solution:**
```typescript
// Use navigation context and proper stack management
const NavigationContext = createContext();

// Centralized navigation actions
export const navigationActions = {
  openBoothDetails: (boothId) => {
    navigationRef.current?.navigate('BoothDetails', { boothId });
  },
  openCreateBooth: () => {
    navigationRef.current?.navigate('CreateBooth');
  },
  goBackToSpotlight: () => {
    navigationRef.current?.navigate('Spotlight');
  }
};
```

### **Business Challenges:**

#### **1. App Store Approval**
**Challenge:** App rejection due to policy violations
**Solution:**
- Review App Store guidelines thoroughly
- Ensure proper content moderation
- Add age-appropriate content warnings
- Include proper privacy disclosures

#### **2. Performance on Older Devices**
**Challenge:** App runs slowly on iPhone 8 or older Android devices
**Solution:**
```typescript
// Device capability detection
import { Platform } from 'react-native';

const isLowEndDevice = () => {
  // Implement device performance detection
  return Platform.OS === 'ios' ?
    parseFloat(Platform.Version) < 13 :
    Platform.constants.Release < '9';
};

// Conditionally reduce features for older devices
const ImageComponent = isLowEndDevice() ? Image : FastImage;
```

---

## **💰 BUDGET BREAKDOWN**

### **Development Costs:**
- **Developer Time:** 160-200 hours × $50-150/hour = $8,000-30,000
- **App Store Developer Account:** $99/year
- **Google Play Developer Account:** $25 one-time
- **Testing Devices:** $500-1,000
- **Design Assets (if outsourced):** $500-2,000
- **Total Estimated Cost:** $9,000-33,000

### **Ongoing Costs:**
- **Supabase:** Current plan (no change needed)
- **App Store Fees:** 30% of revenue after first $1M
- **Google Play Fees:** 30% of revenue after first $1M
- **Push Notifications (Firebase):** Free tier sufficient initially
- **Maps API Usage:** Based on usage, ~$200-500/month if popular

### **Revenue Potential:**
- **Freemium Model:** Basic features free, premium features paid
- **Commission on Sales:** Small percentage of art sales through app
- **Event Ticketing:** Small fee on event registrations
- **Premium Artist Profiles:** Monthly subscription for enhanced profiles
- **Sponsored Content:** Promoted booths/events

---

## **🚀 POST-LAUNCH ROADMAP**

### **Version 1.0 (Launch):** Core Features
- All current web features converted
- Basic booth/event functionality
- User profiles and authentication
- Messaging system

### **Version 1.1 (Month 2):** Enhanced Social
- Follow/follower system improvements
- Enhanced messaging (image sharing)
- Push notifications for events
- Offline mode for browsed content

### **Version 1.2 (Month 4):** Commerce Integration
- In-app artwork purchasing
- Payment processing (Stripe/Apple Pay)
- Shipping and fulfillment integration
- Artist payout system

### **Version 1.3 (Month 6):** Advanced Features
- AR artwork preview
- Video content support
- Live streaming events
- Advanced search and filtering

### **Version 2.0 (Month 12):** Platform Expansion
- iPad-optimized interface
- Apple Watch companion app
- Desktop companion app
- International expansion

---

## **📞 NEXT STEPS TO GET STARTED**

### **Immediate Actions (This Week):**

1. **Environment Setup:**
   ```bash
   # Install Xcode from App Store (start this first - it's huge!)
   # Install required dependencies
   xcode-select --install
   sudo gem install cocoapods
   ```

2. **Create Project:**
   ```bash
   cd /Users/omniscience/Desktop/
   npx react-native@latest init LantinAppNative --template react-native-template-typescript
   cd LantinAppNative
   npm start
   ```

3. **Test Basic Setup:**
   ```bash
   # In another terminal:
   npx react-native run-ios
   # Should open simulator with basic "Hello World" app
   ```

4. **Copy Core Files:**
   ```bash
   # Copy your existing types and Supabase config
   mkdir -p src/lib src/types
   cp ../lantin/app/src/lib/supabase.ts src/lib/
   cp ../lantin/app/src/types/* src/types/
   ```

### **Week 1 Goals:**
- Get React Native project running on iOS simulator
- Install and configure all core dependencies
- Create basic navigation structure
- Test Supabase connection from mobile app
- Convert one simple screen (Profile) as proof of concept

**Ready to start Phase 1? I can guide you through the initial setup step-by-step!**

---

**Document Version:** 1.0
**Last Updated:** September 2024
**Estimated Total Development Time:** 160-200 hours (8 weeks)
**Complexity Level:** Medium-High (leveraging existing React knowledge)
**Success Probability:** High (90%+ with existing codebase and Supabase integration)