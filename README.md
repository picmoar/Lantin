# 🎨 LANTIN APP - Complete Structure Tree

## 🏗️ Application Architecture Overview

The Lantin app is a comprehensive art community platform built with React + TypeScript. The architecture follows a modular pattern with clearly separated concerns for different features.

```
📁 LANTIN APP (React + TypeScript + Supabase)
│
├── 🎯 ENTRY POINT
│   ├── main.tsx ─────────────────── Application entry point
│   └── App.tsx ─────────────────── Main app component with tab navigation
│
├── 🧠 CORE INFRASTRUCTURE
│   ├── 📚 lib/
│   │   ├── supabase.ts ──────────── Database connection & authentication
│   │   └── utils.ts ─────────────── Utility functions
│   │
│   ├── 🎨 styles/
│   │   └── LantinApp.styles.ts ──── Global styling definitions
│   │
│   ├── 🔧 utils/
│   │   └── imageUtils.ts ────────── Image processing utilities
│   │
│   └── 💾 data/ (Static Data)
│       ├── artists.ts ───────────── Sample artist data
│       ├── booths.ts ────────────── Sample booth data
│       ├── events.ts ────────────── Sample event data
│       └── sampleArtworks.ts ────── Sample artwork data
│
└── 🏗️ MAIN COMPONENT TREE
    │
    ├── 🔝 LAYOUT COMPONENTS
    │   ├── Header.tsx ──────────────── Top navigation bar
    │   └── BottomNavigation.tsx ────── Bottom tab navigation
    │
    ├── 🔐 AUTHENTICATION
    │   ├── LoginForm.tsx ───────────── User login interface
    │   └── AuthenticationSection.tsx ─ Auth UI components
    │
    ├── 📱 MAIN TAB COMPONENTS
    │   │
    │   ├── 🔍 DISCOVER TAB (Modular Architecture)
    │   │   ├── DiscoverTab.tsx ─────────── Main discover interface
    │   │   └── 📁 discover_subcom/
    │   │       ├── index.ts ────────────── Export aggregator (components + hooks)
    │   │       ├── ArtistCard.tsx ──────── Individual artist display
    │   │       ├── ArtworkCarousel.tsx ─── Artwork slideshow
    │   │       ├── ArtworkSelector.tsx ─── Artwork selection UI
    │   │       ├── BiographyEditor.tsx ─── Bio editing interface
    │   │       ├── BiographySection.tsx ── Bio display section
    │   │       ├── BoothEditor.tsx ─────── Booth editing interface
    │   │       ├── BoothSection.tsx ────── Booth display section
    │   │       ├── ContactEditor.tsx ──── Contact editing interface
    │   │       ├── ContactSection.tsx ─── Contact display section
    │   │       ├── SaleArtworkSection.tsx ─ Sale artwork display
    │   │       ├── SaleEditor.tsx ──────── Sale editing interface
    │   │       └── 📁 hooks/
    │   │           ├── useBoothInfo.tsx ─── Booth information management
    │   │           ├── useContactInfo.tsx ── Contact information handling
    │   │           ├── useGalleryArtworks.tsx ─ Gallery artwork management
    │   │           └── useSaleArtworks.tsx ── Sale artwork management
    │   │
    │   ├── 🛍️ SHOPPING FUNCTIONALITY
    │   │   └── (Integrated into DiscoverTab - no separate shop tab)
    │   │
    │   ├── ⭐ SPOTLIGHT TAB (Refactored Architecture)
    │   │   ├── SpotlightTab.tsx ───────── Main spotlight interface
    │   │   └── 📁 spotlight_tab_subcom/
    │   │       ├── index.ts ───────────── Export aggregator
    │   │       ├── 📁 components/
    │   │       │   ├── BoothCard.tsx ──── Individual booth card
    │   │       │   ├── EmptyState.tsx ─── Empty state UI
    │   │       │   ├── EventCard.tsx ─── Individual event card
    │   │       │   ├── FilterBar.tsx ─── Filtering interface
    │   │       │   ├── HeaderSection.tsx ─ Spotlight header
    │   │       │   └── UserBoothCard.tsx ─ User-specific booth card
    │   │       ├── 📁 hooks/
    │   │       │   ├── useBoothFilters.ts ─── Booth filtering logic
    │   │       │   ├── useBoothNavigation.ts ─ Navigation logic
    │   │       │   ├── useSpotlightActions.ts ─ Action handlers
    │   │       │   └── useTabState.ts ───── Tab state management
    │   │       └── 📁 styles/
    │   │           ├── buttonStyles.ts ──── Button styling
    │   │           ├── cardStyles.ts ────── Card styling
    │   │           └── layoutStyles.ts ──── Layout styling
    │   │
    │   ├── 🗺️ MAP SECTION
    │   │   └── MapSection.tsx ─────────── Geographic map interface
    │   │
    │   ├── 💬 MESSAGES TAB
    │   │   ├── MessagesTab.tsx ───────── Main messaging interface
    │   │ 
    │   │
    │   └── 👤 PROFILE TAB (Modular Architecture)
    │       ├── ProfileTab.tsx ─────────── Main profile interface
    │       └── 📁 profile_subcom/
    │           ├── index.tsx ─────────── Export aggregator (components only)
    │           ├── ArtworkCarousel.tsx ── Artwork display carousel
    │           ├── DiscoverCardSection.tsx ─ Discovery card section
    │           ├── ProfileEditModal.tsx ── Profile editing modal
    │           ├── ProfileHeader.tsx ──── Profile header section
    │           ├── StatsGrid.tsx ──────── Statistics display grid
    │           └── 📁 hooks/
    │               ├── index.tsx ──────── Hook export aggregator
    │               ├── useArtworkCarousel.tsx ─ Artwork carousel logic
    │               ├── useDiscoverCard.tsx ── Discover card functionality
    │               └── useProfileEdit.tsx ─── Profile editing logic
    │
    ├── 🎭 ARTIST & CONTENT COMPONENTS
    │   ├── ArtistBooths.tsx ───────────── Artist booth management
    │   ├── ArtistCards.tsx ────────────── Artist card displays
    │   ├── ArtistProfile.tsx ──────────── Artist profile view
    │   ├── Events.tsx ─────────────────── Event management
    │   ├── SavedArtists.tsx ───────────── Saved artists list
    │   └── UserProfile.tsx ────────────── User profile component
    │
    ├── 🎨 CREATION MODALS (Complex Components)
    │   │
    │   ├── 🏪 BOOTH CREATION (Refactored Architecture)
    │   │   ├── CreateBoothModal.tsx ──── Main booth creation modal
    │   │   └── 📁 booth_create_subcom/
    │   │       ├── index.ts ──────────── Export aggregator
    │   │       ├── 📁 components/
    │   │       │   ├── ActionButtons.tsx ── Modal action buttons
    │   │       │   ├── BasicInfoSection.tsx ─ Basic info form
    │   │       │   ├── HighlightPhotos.tsx ── Photo highlights
    │   │       │   ├── ImageUploader.tsx ── Image upload component
    │   │       │   ├── LocationPicker.tsx ── Location selection
    │   │       │   ├── ModalHeader.tsx ─── Modal header
    │   │       │   └── ScheduleSection.tsx ── Schedule configuration
    │   │       ├── 📁 hooks/
    │   │       │   ├── useBoothForm.ts ──── Form state management
    │   │       │   ├── useGooglePlaces.ts ── Location services
    │   │       │   └── useImageUpload.ts ── Image upload logic
    │   │       └── 📁 styles/
    │   │           └── formStyles.ts ───── Form styling
    │   │
    │   ├── 🎉 EVENT CREATION (Refactored Architecture)
    │   │   ├── CreateEventModal.tsx ──── Main event creation modal
    │   │   └── 📁 event_modal_subcom/
    │   │       ├── index.ts ──────────── Export aggregator
    │   │       ├── 📁 components/
    │   │       │   ├── EventBasicInfoSection.tsx ─ Basic event info
    │   │       │   ├── EventDetailsSection.tsx ── Event details
    │   │       │   ├── EventHighlightsSection.tsx ─ Event highlights
    │   │       │   ├── EventImageUploadSection.tsx ─ Image upload
    │   │       │   ├── EventLocationSection.tsx ── Location selection
    │   │       │   ├── EventScheduleSection.tsx ── Schedule setup
    │   │       │   └── ModalHeader.tsx ──── Modal header
    │   │       ├── 📁 hooks/
    │   │       │   ├── useEventForm.ts ──── Form state management
    │   │       │   ├── useFileUpload.ts ─── File upload logic
    │   │       │   └── useGooglePlaces.ts ── Location services
    │   │       └── 📁 styles/
    │   │           └── formStyles.ts ───── Form styling
    │   │
    │   └── 🖼️ ARTWORK CREATION
    │       └── CreateArtworkModal.tsx ─── Artwork creation modal
    │
    ├── 📋 DETAIL MODALS
    │   ├── ArtworkDetailModal.tsx ────── Artwork detail view
    │   ├── BoothDetailsModal.tsx ─────── Booth detail view
    │   ├── EventDetailsModal.tsx ─────── Event detail view
    │   ├── FullImageModal.tsx ────────── Full-screen image view
    │   ├── ShoppingCartModal.tsx ─────── Shopping cart interface
    │   └── ModalContainer.tsx ────────── Generic modal container
    │
    └── 🧩 UI COMPONENT LIBRARY
        └── 📁 ui/ (Reusable Components)
            ├── accordion.tsx ──────────── Collapsible content
            ├── alert-dialog.tsx ───────── Alert dialogs
            ├── alert.tsx ───────────────── Alert notifications
            ├── aspect-ratio.tsx ────────── Aspect ratio container
            ├── avatar.tsx ──────────────── Avatar component
            ├── badge.tsx ───────────────── Badge/chip component
            ├── breadcrumb.tsx ──────────── Navigation breadcrumbs
            ├── button.tsx ──────────────── Button variants
            ├── calendar.tsx ────────────── Date picker
            ├── card.tsx ────────────────── Card layouts
            ├── carousel.tsx ────────────── Image carousels
            ├── chart.tsx ───────────────── Data visualization
            ├── checkbox.tsx ────────────── Checkbox inputs
            ├── collapsible.tsx ─────────── Collapsible sections
            ├── command.tsx ─────────────── Command palette
            ├── context-menu.tsx ────────── Right-click menus
            ├── dialog.tsx ──────────────── Modal dialogs
            ├── drawer.tsx ──────────────── Side drawers
            ├── dropdown-menu.tsx ───────── Dropdown menus
            ├── form.tsx ────────────────── Form utilities
            ├── hover-card.tsx ──────────── Hover tooltips
            ├── input-otp.tsx ───────────── OTP input fields
            ├── input.tsx ───────────────── Text inputs
            ├── label.tsx ───────────────── Form labels
            ├── menubar.tsx ─────────────── Menu bars
            ├── navigation-menu.tsx ─────── Navigation menus
            ├── pagination.tsx ──────────── Page navigation
            ├── popover.tsx ─────────────── Popup content
            ├── progress.tsx ────────────── Progress indicators
            ├── radio-group.tsx ─────────── Radio button groups
            ├── resizable.tsx ───────────── Resizable panels
            ├── scroll-area.tsx ─────────── Custom scrollbars
            ├── select.tsx ──────────────── Select dropdowns
            ├── separator.tsx ───────────── Visual separators
            ├── sheet.tsx ───────────────── Side sheets
            ├── sidebar.tsx ─────────────── Sidebar navigation
            ├── skeleton.tsx ────────────── Loading skeletons
            ├── slider.tsx ──────────────── Range sliders
            ├── sonner.tsx ──────────────── Toast notifications
            ├── switch.tsx ──────────────── Toggle switches
            ├── table.tsx ───────────────── Data tables
            ├── tabs.tsx ────────────────── Tab interfaces
            ├── textarea.tsx ────────────── Multi-line text inputs
            ├── toggle-group.tsx ────────── Toggle button groups
            ├── toggle.tsx ──────────────── Toggle buttons
            ├── tooltip.tsx ─────────────── Hover tooltips
            ├── use-mobile.ts ───────────── Mobile detection hook
            └── utils.ts ────────────────── UI utility functions
```

## 🔗 HOOKS ARCHITECTURE

```
📁 hooks/ (Custom React Hooks)
│
├── 🎯 CORE HOOKS
│   ├── useAuth.ts ──────────────── Authentication state & logic
│   ├── useModals.ts ────────────── Modal state management
│   ├── useShoppingCart.ts ──────── Shopping cart functionality
│   ├── useSocial.ts ────────────── Social features (follow/like)
│   └── useUserContent.ts ───────── User content management
│
├── 🔍 DISCOVER TAB HOOKS
│   └── (Moved to /src/components/discover_subcom/hooks/ - see Discover Tab section above)
│
├── 👤 PROFILE TAB HOOKS
│   └── (Moved to /src/components/profile_subcom/hooks/ - see Profile Tab section above)
│
└── 💬 MESSAGING HOOKS
    ├── useConversations.tsx ───── Conversation management
    └── useMessages.tsx ────────── Message handling
```

## 📱 DATA FLOW ARCHITECTURE

```
🔄 COMPONENT HIERARCHY & DATA FLOW

App.tsx (Root State Manager)
│
├── 🔐 Authentication Flow
│   ├── useAuth() ──────────────── Manages user login/logout
│   └── LoginForm ──────────────── Renders when not authenticated
│
├── 🧭 Navigation Flow
│   ├── Header ─────────────────── Top navigation with user controls
│   ├── BottomNavigation ───────── Tab switching interface
│   └── activeTab state ────────── Controls which tab is displayed
│
├── 🏪 Modal Management Flow
│   ├── useModals() ────────────── Central modal state
│   ├── ModalContainer ─────────── Modal rendering wrapper
│   └── Various *Modal.tsx ────── Specific modal implementations
│
├── 🛒 Commerce Flow
│   ├── useShoppingCart() ──────── Cart state management
│   ├── ShoppingCartModal ──────── Cart display interface
│   └── Shop components ────────── Product browsing & purchasing
│
├── 👥 Social Flow
│   ├── useSocial() ────────────── Social interactions state
│   ├── useUserContent() ───────── User-generated content
│   └── Various display components ─ Social feature UI
│
└── 📊 Data Persistence
    ├── Supabase integration ───── Database operations
    ├── Real-time subscriptions ── Live data updates
    └── Local state caching ────── Performance optimization
```

## 🏗️ ARCHITECTURAL PATTERNS

### 1. **Modular Subcomponent Pattern**
- **Used in**: SpotlightTab, CreateBoothModal, CreateEventModal, Messages
- **Structure**: Main component + dedicated subcom folder with components/hooks/styles
- **Benefits**: Better organization, easier testing, clearer responsibilities

### 2. **Hook-Based State Management**
- **Custom hooks** handle complex state logic
- **Separation of concerns** between UI and business logic
- **Reusable logic** across components

### 3. **Modal-Centric UI Pattern**
- **Central modal management** with useModals hook
- **Layered modal system** for complex workflows
- **Consistent modal behavior** across the app

### 4. **Tab-Based Navigation**
- **Single-page application** with tab switching
- **State preservation** across tab changes
- **Smooth transitions** with scroll management

## 🔧 CURRENT ISSUES & STATUS

### ⚠️ Known Issues:
1. **Chat Modal Layout**: Message display formatting may need minor fixes
2. **Message Data Transformation**: Field mapping between database and UI components

### ✅ Recently Completed:
1. **Icon Replacement System**: Emoji → PNG image replacements throughout app (`/message.png`, `/profile.png`, `/shop.png`)
2. **UserAvatar Enhancement**: Added fallback image support with `/profile.png`
3. **Comprehensive Type System**: Full TypeScript coverage for messaging components
4. **Export Structure**: Proper module exports for all subcomponents
5. **Hook Reorganization**: Moved discover_tab_hooks and profile_tab_hooks to their respective subcomponent folders
6. **Shop Tab Removal**: Removed unused Shop.tsx and ShopTab.tsx components
7. **Modular Architecture**: Completed modular refactoring for Discover and Profile tabs
8. **Mobile Navigation Improvements**: Fixed bottom navigation positioning and appearance for mobile devices
9. **Discover Tab Stability**: Resolved blank page issues with always-refresh strategy
10. **Booth & Event System Implementation**: Complete booth visit and event registration tracking with database integration
11. **Profile Bio Persistence**: Fixed bio reset issue during login/logout cycles
12. **Z-index Layer Management**: Resolved modal/navigation overlay conflicts across booth, event, and profile modals

### 🚧 Architecture Evolution:
- **Phase 1**: Basic component structure ✅
- **Phase 2**: Modular subcomponent adoption ✅
- **Phase 3**: Hook-based state management ✅
- **Phase 4**: Full TypeScript integration ✅
- **Phase 5**: Performance optimization ✅
- **Phase 6**: Database integration & real-time features ✅

## 🎯 KEY DESIGN PRINCIPLES

1. **Modularity**: Each major feature has its own subcomponent structure
2. **Reusability**: Shared components in `/ui` folder
3. **Type Safety**: Full TypeScript coverage with proper interfaces
4. **Performance**: Lazy loading and efficient state management
5. **Maintainability**: Clear folder structure and consistent naming conventions
6. **Scalability**: Easy to add new features without breaking existing code

## 🗄️ DATABASE ARCHITECTURE

### Core Tables:
```
📊 SUPABASE DATABASE SCHEMA
│
├── 👥 USER MANAGEMENT
│   ├── artists ─────────── Artist profiles (id, name, bio, profile_image_url, etc.)
│   └── user_metadata ──── Extended user information
│
├── 🎨 CONTENT TABLES
│   ├── booths ──────────── Booth information (id, name, description, visitor_count, etc.)
│   ├── events ──────────── Event information (id, title, description, attendee_count, etc.)
│   └── artworks ────────── Artwork catalog
│
├── 🤝 INTERACTION TABLES
│   ├── booth_visits ───── User booth visits (booth_id, user_id, created_at)
│   ├── event_registrations ─ User event registrations (event_id, user_id, created_at)
│   └── followers ──────── User following relationships
│
└── 🔄 REAL-TIME TRIGGERS
    ├── update_booth_visitor_count() ─── Auto-increment/decrement booth visitor counts
    └── update_event_attendee_count() ── Auto-increment/decrement event attendee counts
```

### Key Features:
- **Real-time Count Updates**: Database triggers automatically maintain accurate visitor/attendee counts
- **Multi-user Support**: Proper accumulation of visits/registrations across different users
- **Data Integrity**: Foreign key constraints and RLS (Row Level Security) policies
- **Scalable Architecture**: Optimized for concurrent user interactions

---

**Last Updated**: September 2024 - Database Integration & Real-time Features
**Maintainer**: Claude Code Assistant
**Version**: 1.2.0

### 📋 **Recent Updates in v1.2.0:**
- ✅ **Complete Database Integration**: Full Supabase integration with booth_visits and event_registrations tables
- ✅ **Real-time Count System**: Auto-updating visitor/attendee counts with database triggers
- ✅ **Multi-user Support**: Fixed count accumulation across different user accounts
- ✅ **Mobile Optimization**: Enhanced mobile navigation positioning and appearance
- ✅ **UI/UX Improvements**: Resolved blank page issues, modal z-index conflicts, and profile bio persistence
- ✅ **Color Scheme Standardization**: Consistent #61858b color theme across booth and event systems
- ✅ **Navigation Bar Fixes**: Proper z-index layering for all modals (booth, event, profile edit)
