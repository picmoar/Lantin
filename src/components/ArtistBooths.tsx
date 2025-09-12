import { useState } from 'react';
import { MapPin, Clock, Calendar, Search, Filter, List, Map as MapIcon, Navigation, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ArtistBooth {
  id: string;
  artistName: string;
  artistAvatar: string;
  artistId: string;
  title: string;
  description: string;
  location: string;
  address: string;
  coordinates: { lat: number; lng: number };
  type: 'popup' | 'permanent' | 'market';
  schedule: string;
  hours: string;
  startDate?: string;
  endDate?: string;
  image: string;
  images: string[];
  medium: string[];
  isFeatured: boolean;
  isOpen: boolean;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  tags: string[];
}

const mockBooths: ArtistBooth[] = [
  {
    id: '1',
    artistName: 'Elena Rodriguez',
    artistAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b422?w=100&h=100&fit=crop&crop=face',
    artistId: '1',
    title: 'Abstract Dreams Pop-up',
    description: 'Showcasing my latest abstract paintings in an intimate gallery setting',
    location: 'SoHo Art District',
    address: '123 Spring Street, New York, NY 10012',
    coordinates: { lat: 40.7232, lng: -74.0028 },
    type: 'popup',
    schedule: 'Dec 15-22, 2024',
    hours: '10 AM - 8 PM',
    startDate: 'Dec 15-22, 2024',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&h=400&fit=crop'
    ],
    medium: ['painting', 'abstract', 'contemporary'],
    isFeatured: true,
    isOpen: true,
    contact: {
      phone: '+1 (555) 123-4567',
      website: 'elenaart.com'
    },
    tags: ['painting', 'abstract', 'contemporary']
  },
  {
    id: '2',
    artistName: 'Sofia Andersson',
    artistAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    artistId: '3',
    title: 'Ceramic Studio & Shop',
    description: 'Working ceramics studio where you can watch the creative process and purchase finished pieces',
    location: 'Brooklyn Arts District',
    address: '456 Williamsburg Ave, Brooklyn, NY 11222',
    coordinates: { lat: 40.7128, lng: -73.9632 },
    type: 'permanent',
    schedule: 'Open Daily',
    hours: '9 AM - 7 PM',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=400&fit=crop'
    ],
    medium: ['ceramic', 'pottery', 'sculpture'],
    isFeatured: true,
    isOpen: true,
    contact: {
      phone: '+1 (555) 987-6543',
      email: 'sofia@ceramicstudio.com',
      website: 'sofiaandersson.com'
    },
    tags: ['ceramic', 'pottery', 'sculpture']
  },
  {
    id: '3',
    artistName: 'Marcus Chen',
    artistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    artistId: '2',
    title: 'Street Photography Studio',
    description: 'Urban photography prints and services. Custom photo sessions available.',
    location: 'Manhattan, NY',
    address: '789 Broadway, New York, NY 10003',
    coordinates: { lat: 40.7405, lng: -73.9892 },
    type: 'market',
    schedule: 'Weekends Only',
    hours: '11 AM - 6 PM',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop'
    ],
    medium: ['photography', 'digital', 'prints'],
    isFeatured: false,
    isOpen: false,
    contact: {
      phone: '+1 (555) 456-7890',
      website: 'marcuschenphotography.com'
    },
    tags: ['photography', 'digital', 'prints']
  },
  {
    id: '4',
    artistName: 'David Park',
    artistAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    artistId: '4',
    title: 'Digital Arts Collective',
    description: 'Collaborative space showcasing cutting-edge digital art and NFTs',
    location: 'Lower East Side',
    address: '321 Rivington St, New York, NY 10002',
    coordinates: { lat: 40.7209, lng: -73.9896 },
    type: 'popup',
    schedule: 'Jan 10-20, 2025',
    hours: '12 PM - 9 PM',
    startDate: 'Jan 10-20, 2025',
    image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop'
    ],
    medium: ['digital', 'nft', 'interactive'],
    isFeatured: false,
    isOpen: true,
    contact: {
      email: 'info@digitalcollective.art',
      website: 'digitalcollective.art'
    },
    tags: ['digital', 'nft', 'interactive']
  }
];

export function ArtistBooths() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedBooth, setSelectedBooth] = useState<ArtistBooth | null>(null);

  const filteredBooths = mockBooths.filter(booth => {
    const matchesSearch = booth.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booth.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booth.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === 'all' || booth.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = typeFilter === 'all' || booth.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const featuredBooths = filteredBooths.filter(booth => booth.isFeatured);
  const regularBooths = filteredBooths.filter(booth => !booth.isFeatured);

  const getTypeIcon = (type: ArtistBooth['type']) => {
    switch (type) {
      case 'popup':
        return '⚡';
      case 'permanent':
        return '🏢';
      case 'market':
        return '🏪';
      default:
        return '🎨';
    }
  };

  const getTypeColor = (type: ArtistBooth['type']) => {
    switch (type) {
      case 'popup':
        return 'bg-yellow-100 text-yellow-800';
      case 'permanent':
        return 'bg-blue-100 text-blue-800';
      case 'market':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVisitBooth = (booth: ArtistBooth) => {
    // Simulate opening maps app
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(booth.address)}`;
    console.log(`Opening directions to: ${booth.address}`);
    console.log(`Maps URL: ${mapsUrl}`);
  };

  if (selectedBooth) {
    return (
      <div className="h-screen overflow-y-auto bg-white">
        <div className="relative">
          <div className="grid grid-cols-2 gap-1 h-64">
            {selectedBooth.images.slice(0, 4).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${selectedBooth.title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ))}
            {selectedBooth.images.length > 4 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                +{selectedBooth.images.length - 4} more
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className="absolute top-4 left-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            onClick={() => setSelectedBooth(null)}
          >
            ← Back
          </Button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <img
              src={selectedBooth.artistAvatar}
              alt={selectedBooth.artistName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-xl font-semibold mb-1">{selectedBooth.title}</h1>
              <p className="text-muted-foreground">{selectedBooth.artistName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Badge className={getTypeColor(selectedBooth.type)}>
              {getTypeIcon(selectedBooth.type)} {selectedBooth.type}
            </Badge>
            {selectedBooth.isFeatured && (
              <Badge variant="secondary">Featured</Badge>
            )}
            <Badge variant={selectedBooth.isOpen ? "default" : "secondary"}>
              {selectedBooth.isOpen ? "Open" : "Closed"}
            </Badge>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {selectedBooth.description}
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="font-medium">{selectedBooth.location}</p>
                <p className="text-sm text-muted-foreground">{selectedBooth.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <p>{selectedBooth.schedule}</p>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <p>{selectedBooth.hours}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3">Contact Information</h3>
            <div className="space-y-2">
              {selectedBooth.contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${selectedBooth.contact.phone}`} className="text-blue-600">
                    {selectedBooth.contact.phone}
                  </a>
                </div>
              )}
              {selectedBooth.contact.website && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">🌐</span>
                  <a 
                    href={`https://${selectedBooth.contact.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    {selectedBooth.contact.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <Button 
              className="w-full"
              onClick={() => handleVisitBooth(selectedBooth)}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Visit Booth
            </Button>
          </div>

          <div>
            <h3 className="font-medium mb-3">Medium & Style</h3>
            <div className="flex flex-wrap gap-2">
              {selectedBooth.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-white pb-16">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-lg">
              <span className="text-white text-sm">🏪</span>
            </div>
            <h1 className="text-xl font-semibold">Artist Booths</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button 
              variant={viewMode === 'map' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <MapIcon className="h-4 w-4 mr-1" />
              Map
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search artists, booths, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border-0"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="soho">SoHo</SelectItem>
              <SelectItem value="brooklyn">Brooklyn</SelectItem>
              <SelectItem value="manhattan">Manhattan</SelectItem>
              <SelectItem value="queens">Queens</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="popup">Pop-up</SelectItem>
              <SelectItem value="permanent">Permanent</SelectItem>
              <SelectItem value="market">Market</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {viewMode === 'map' ? (
          // Map View
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <MapIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Interactive Map</h3>
            <p className="text-muted-foreground mb-4">
              Map integration coming soon. This will show all artist booths and studios on an interactive map.
            </p>
            <Button onClick={() => setViewMode('list')}>
              View as List
            </Button>
          </div>
        ) : (
          // List View
          <>
            {/* Featured Booths */}
            {featuredBooths.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">⭐</span>
                  <h2 className="font-semibold">Featured Booths</h2>
                </div>
                
                <div className="space-y-4">
                  {featuredBooths.map((booth) => (
                    <Card 
                      key={booth.id} 
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedBooth(booth)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={booth.image}
                            alt={booth.title}
                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-medium mb-1">{booth.title}</h3>
                                <p className="text-sm text-muted-foreground">{booth.artistName}</p>
                              </div>
                              {booth.isFeatured && (
                                <Badge variant="secondary" className="text-xs">Featured</Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`${getTypeColor(booth.type)} text-xs`}>
                                {getTypeIcon(booth.type)} {booth.type}
                              </Badge>
                              <Badge variant={booth.isOpen ? "default" : "secondary"} className="text-xs">
                                {booth.isOpen ? "Open" : "Closed"}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <MapPin className="h-3 w-3" />
                              <span>{booth.location}</span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{booth.schedule}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{booth.hours}</span>
                              </div>
                            </div>
                            
                            <div className="mt-2 flex justify-end">
                              <Button 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVisitBooth(booth);
                                }}
                                className="text-xs px-3 py-1 h-auto"
                              >
                                Visit Booth
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Booths */}
            <div className="mb-4">
              <h2 className="font-semibold mb-4">All Booths ({filteredBooths.length})</h2>
              
              <div className="space-y-4">
                {regularBooths.map((booth) => (
                  <Card 
                    key={booth.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedBooth(booth)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={booth.artistAvatar}
                          alt={booth.artistName}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium text-sm truncate">{booth.title}</h3>
                              <p className="text-xs text-muted-foreground">{booth.artistName}</p>
                            </div>
                            <Badge className={`${getTypeColor(booth.type)} text-xs`}>
                              {getTypeIcon(booth.type)} {booth.type}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {booth.description}
                          </p>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3" />
                            <span>{booth.location}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{booth.schedule}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{booth.hours.split(' - ')[0]}</span>
                              </div>
                            </div>
                            
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVisitBooth(booth);
                              }}
                              className="text-xs px-3 py-1 h-auto"
                            >
                              Visit Booth
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {filteredBooths.length === 0 && (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🏪</span>
                </div>
                <h3 className="font-medium mb-2">No booths found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find artist booths in your area.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
