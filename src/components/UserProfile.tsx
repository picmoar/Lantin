import { useState } from 'react';
import { Settings, Edit3, Camera, MapPin, Heart, Search, Calendar, Bell, Shield, HelpCircle, LogOut, Users, Plus, Image, Upload, X, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { ArtworkUpload } from './ArtworkUpload';

interface UserProfileProps {
  savedArtistsCount: number;
}

// Artwork interface for multi-photo support
interface ArtworkPhoto {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
}

interface Artwork {
  id: string;
  title: string;
  description: string;
  medium: string;
  year: string;
  dimensions?: string;
  price?: string;
  photos: ArtworkPhoto[];
  isForSale: boolean;
  tags: string[];
}

export function UserProfile({ savedArtistsCount }: UserProfileProps) {
  const [showPreview, setShowPreview] = useState(false);
  
  // Initialize with some sample artworks with multiple photos
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([
    {
      id: '1',
      title: 'Abstract Flow',
      description: 'A vibrant exploration of movement and color',
      medium: 'Acrylic on Canvas',
      year: '2024',
      dimensions: '24 x 36 inches',
      photos: [
        {
          id: '1a',
          url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&h=600&fit=crop',
          isPrimary: true
        },
        {
          id: '1b',
          url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop',
          isPrimary: false
        },
        {
          id: '1c',
          url: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&h=600&fit=crop',
          isPrimary: false
        }
      ],
      isForSale: true,
      tags: ['abstract', 'colorful', 'modern']
    },
    {
      id: '2',
      title: 'Ceramic Sculpture Series',
      description: 'Hand-thrown ceramic pieces exploring organic forms',
      medium: 'Ceramic',
      year: '2024',
      dimensions: '12 x 8 x 8 inches',
      photos: [
        {
          id: '2a',
          url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=600&fit=crop',
          isPrimary: true
        },
        {
          id: '2b',
          url: 'https://images.unsplash.com/photo-1569095068301-91f58eb70671?w=600&h=600&fit=crop',
          isPrimary: false
        }
      ],
      isForSale: false,
      tags: ['ceramic', 'sculpture', 'organic']
    }
  ]);

  const [artCategories, setArtCategories] = useState([
    "Photography", 
    "Digital Art", 
    "Portrait"
  ]);

  // Mock user data - in a real app, this would come from authentication
  const mockUser = {
    name: "Art Lover",
    email: "user@example.com",
    location: "New York, NY",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
  };

  const handleArtworksChange = (newArtworks: Artwork[]) => {
    setUserArtworks(newArtworks);
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setArtCategories(prev => prev.filter(cat => cat !== categoryToRemove));
  };

  const handleAddCategory = () => {
    const newCategories = ["Oil Painting", "Watercolor", "Sculpture", "Mixed Media", "Street Art", "Abstract", "Nail Art", "Ceramics"];
    const availableCategories = newCategories.filter(cat => !artCategories.includes(cat));
    if (availableCategories.length > 0) {
      const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
      setArtCategories(prev => [...prev, randomCategory]);
    }
  };

  if (showPreview) {
    // ProfilePreview component removed - add back later if needed
    return (
      <div className="p-4">
        <Button onClick={() => setShowPreview(false)} className="mb-4">
          Back to Profile
        </Button>
        <div className="text-center">
          <h3>Profile Preview</h3>
          <p className="text-muted-foreground">Preview functionality will be added later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img
              src={mockUser.profileImage}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
            />
            <Button
              size="sm"
              className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0 bg-primary"
            >
              <Camera className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2>{mockUser.name}</h2>
              <Button variant="ghost" size="sm" className="p-1">
                <Edit3 className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
              <MapPin className="h-3 w-3" />
              <span>{mockUser.location}</span>
            </div>
            
            {/* Art Categories Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {artCategories.map((category) => (
                <Badge 
                  key={category} 
                  variant="secondary" 
                  className="text-xs flex items-center gap-1"
                >
                  {category}
                  <button
                    onClick={() => handleRemoveCategory(category)}
                    className="hover:text-destructive"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddCategory}
                className="h-6 px-2 text-xs"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-3 text-center">
            <div className="text-lg font-medium">{savedArtistsCount}</div>
            <div className="text-xs text-muted-foreground">Saved Artists</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-medium">{userArtworks.length}</div>
            <div className="text-xs text-muted-foreground">My Artwork</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-medium">7</div>
            <div className="text-xs text-muted-foreground">Following</div>
          </Card>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* My Artwork Section with Multi-Photo Support */}
        <ArtworkUpload
          artworks={userArtworks}
          onArtworksChange={handleArtworksChange}
        />

        <Separator />

        {/* Profile Completion Notice */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-blue-900 mb-1">Limited Profile Features</h4>
              <p className="text-sm text-blue-700 mb-3">
                This is currently a demo with mock data. To enable full profile editing, artwork uploads, and data persistence, connect to Supabase.
              </p>
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                Frontend Only
              </Badge>
            </div>
          </div>
        </Card>

        {/* Account Settings */}
        <div>
          <h3 className="mb-3">Account Settings</h3>
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="h-4 w-4 mr-3" />
              Preview My Profile
              <Badge variant="secondary" className="ml-auto text-xs bg-blue-100 text-blue-800">New</Badge>
            </Button>

            <Button variant="ghost" className="w-full justify-start" disabled>
              <Edit3 className="h-4 w-4 mr-3" />
              Edit Profile
              <Badge variant="secondary" className="ml-auto text-xs">Coming Soon</Badge>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start" disabled>
              <Camera className="h-4 w-4 mr-3" />
              Change Photo
              <Badge variant="secondary" className="ml-auto text-xs">Coming Soon</Badge>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start" disabled>
              <MapPin className="h-4 w-4 mr-3" />
              Update Location
              <Badge variant="secondary" className="ml-auto text-xs">Coming Soon</Badge>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Preferences */}
        <div>
          <h3 className="mb-3">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">Push Notifications</div>
                  <div className="text-xs text-muted-foreground">Get notified about new artists</div>
                </div>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">Location Services</div>
                  <div className="text-xs text-muted-foreground">Show nearby artists</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">Public Profile</div>
                  <div className="text-xs text-muted-foreground">Let artists see your profile</div>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <Separator />

        {/* Discovery Settings */}
        <div>
          <h3 className="mb-3">Discovery</h3>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Heart className="h-4 w-4 mr-3" />
              Liked Mediums
              <Badge variant="secondary" className="ml-auto">3</Badge>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              <Search className="h-4 w-4 mr-3" />
              Search History
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              <MapPin className="h-4 w-4 mr-3" />
              Favorite Locations
              <Badge variant="secondary" className="ml-auto">2</Badge>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Support */}
        <div>
          <h3 className="mb-3">Support</h3>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-3" />
              Help Center
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-3" />
              Privacy Policy
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-3" />
              Terms of Service
            </Button>
          </div>
        </div>

        <Separator />

        {/* Sign Out */}
        <Button variant="destructive" className="w-full" disabled>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
          <Badge variant="secondary" className="ml-auto text-xs">Requires Auth</Badge>
        </Button>

        {/* Version Info */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          ArtistConnect v1.0.0 (Demo)
        </div>
      </div>
    </div>
  );
}
