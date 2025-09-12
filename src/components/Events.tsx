import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Share, Heart, Filter, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';

interface Event {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  artistAvatar: string;
  description: string;
  startDate: string;
  endDate?: string;
  time: string;
  venue: string;
  location: string;
  price: 'free' | number;
  attendees: number;
  maxAttendees?: number;
  image: string;
  isFeatured: boolean;
  type: 'exhibition' | 'gallery opening' | 'workshop' | 'art fair' | 'studio visit';
  tags: string[];
  rsvpRequired: boolean;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Abstract Expressions: New Works',
    artist: 'Elena Rodriguez',
    artistId: '1',
    artistAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b422?w=100&h=100&fit=crop&crop=face',
    description: 'Experience the latest collection of abstract paintings exploring themes of emotion and movement.',
    startDate: 'Dec 20, 2024',
    endDate: 'Jan 15, 2025',
    time: '6:00 PM - 9:00 PM',
    venue: 'Gallery Modern, SoHo, NYC',
    location: 'New York, NY',
    price: 'free',
    attendees: 89,
    maxAttendees: 150,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
    isFeatured: true,
    type: 'exhibition',
    tags: ['Abstract', 'Contemporary', 'Opening Reception'],
    rsvpRequired: true
  },
  {
    id: '2',
    title: 'Urban Photography Workshop',
    artist: 'Marcus Chen',
    artistId: '2',
    artistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    description: 'Learn street photography techniques and urban composition in this hands-on workshop.',
    startDate: 'Dec 28, 2024',
    time: '2:00 PM - 5:00 PM',
    venue: 'Brooklyn Arts Center',
    location: 'Brooklyn, NY',
    price: 85,
    attendees: 12,
    maxAttendees: 15,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    isFeatured: false,
    type: 'workshop',
    tags: ['Photography', 'Workshop', 'Urban'],
    rsvpRequired: true
  },
  {
    id: '3',
    title: 'Nordic Ceramics Studio Visit',
    artist: 'Sofia Andersson',
    artistId: '3',
    artistAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    description: 'Visit Sofia\'s private studio and see the ceramic creation process up close.',
    startDate: 'Jan 5, 2025',
    time: '11:00 AM - 1:00 PM',
    venue: 'Private Studio',
    location: 'Queens, NY',
    price: 25,
    attendees: 8,
    maxAttendees: 10,
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&h=400&fit=crop',
    isFeatured: false,
    type: 'studio visit',
    tags: ['Ceramics', 'Studio Visit', 'Nordic'],
    rsvpRequired: true
  },
  {
    id: '4',
    title: 'Digital Art Collective Show',
    artist: 'Multiple Artists',
    artistId: 'collective',
    artistAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    description: 'A group exhibition featuring emerging digital artists from around the world.',
    startDate: 'Jan 12, 2025',
    endDate: 'Feb 15, 2025',
    time: '10:00 AM - 8:00 PM',
    venue: 'Digital Arts Museum',
    location: 'Manhattan, NY',
    price: 15,
    attendees: 234,
    image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&h=400&fit=crop',
    isFeatured: true,
    type: 'exhibition',
    tags: ['Digital Art', 'Group Show', 'Technology'],
    rsvpRequired: false
  }
];

export function Events() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  const [rsvpEvents, setRsvpEvents] = useState<string[]>([]);

  const handleSaveEvent = (eventId: string) => {
    setSavedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleRSVP = (eventId: string) => {
    setRsvpEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const filteredEvents = mockEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredEvents = filteredEvents.filter(event => event.isFeatured);
  const regularEvents = filteredEvents.filter(event => !event.isFeatured);

  const getTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'exhibition':
        return '🎨';
      case 'gallery opening':
        return '🖼️';
      case 'workshop':
        return '🛠️';
      case 'art fair':
        return '🎪';
      case 'studio visit':
        return '🏠';
      default:
        return '🎨';
    }
  };

  const getTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'exhibition':
        return 'bg-blue-100 text-blue-800';
      case 'gallery opening':
        return 'bg-purple-100 text-purple-800';
      case 'workshop':
        return 'bg-green-100 text-green-800';
      case 'art fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'studio visit':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedEvent) {
    return (
      <div className="h-screen overflow-y-auto bg-white">
        <div className="relative">
          <img
            src={selectedEvent.image}
            alt={selectedEvent.title}
            className="w-full h-64 object-cover"
          />
          <Button
            variant="ghost"
            className="absolute top-4 left-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            ← Back
          </Button>
          <Button
            variant="ghost"
            className="absolute top-4 right-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            onClick={() => handleSaveEvent(selectedEvent.id)}
          >
            <Heart className={`h-5 w-5 ${savedEvents.includes(selectedEvent.id) ? 'fill-current text-red-500' : ''}`} />
          </Button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={selectedEvent.artistAvatar}
              alt={selectedEvent.artist}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h1 className="text-xl font-semibold mb-1">{selectedEvent.title}</h1>
              <p className="text-muted-foreground">by {selectedEvent.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Badge className={getTypeColor(selectedEvent.type)}>
              {getTypeIcon(selectedEvent.type)} {selectedEvent.type}
            </Badge>
            {selectedEvent.isFeatured && (
              <Badge variant="secondary">Featured</Badge>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {selectedEvent.description}
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {selectedEvent.startDate}
                  {selectedEvent.endDate && ` - ${selectedEvent.endDate}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <p>{selectedEvent.time}</p>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{selectedEvent.venue}</p>
                <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <p>
                {selectedEvent.attendees} attending
                {selectedEvent.maxAttendees && ` (${selectedEvent.maxAttendees} max)`}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {selectedEvent.price === 'free' ? 'Free' : `$${selectedEvent.price}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.rsvpRequired ? 'RSVP Required' : 'Drop-in welcome'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Button 
              className="flex-1"
              onClick={() => handleRSVP(selectedEvent.id)}
              disabled={rsvpEvents.includes(selectedEvent.id)}
            >
              {rsvpEvents.includes(selectedEvent.id) ? 'RSVP Confirmed' : 'RSVP'}
            </Button>
            
            <Button variant="outline" onClick={() => console.log('Share event')}>
              <Share className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <h3 className="font-medium mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {selectedEvent.tags.map((tag) => (
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
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Art Events</h1>
          <div className="ml-auto">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search events, artists, or venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border-0"
          />
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">⭐</span>
              <h2 className="font-semibold">Featured Events</h2>
            </div>
            
            <div className="space-y-4">
              {featuredEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className={`absolute top-3 left-3 ${getTypeColor(event.type)}`}>
                      {getTypeIcon(event.type)} {event.type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveEvent(event.id);
                      }}
                    >
                      <Heart className={`h-4 w-4 ${savedEvents.includes(event.id) ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                    {event.isFeatured && (
                      <Badge className="absolute top-3 right-14 bg-yellow-500">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={event.artistAvatar}
                        alt={event.artist}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.artist}</p>
                      </div>
                      {event.isFeatured && (
                        <Badge variant="secondary" className="text-xs">Featured</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{event.startDate} {event.endDate && `- ${event.endDate}`}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.venue}, {event.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">
                          {event.price === 'free' ? 'Free' : `$${event.price}`}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRSVP(event.id);
                        }}
                        disabled={rsvpEvents.includes(event.id)}
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        {rsvpEvents.includes(event.id) ? 'RSVP\'d' : 'RSVP'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Events */}
        {regularEvents.length > 0 && (
          <div>
            <h2 className="font-semibold mb-4">All Events</h2>
            <div className="space-y-4">
              {regularEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedEvent(event)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium mb-1 truncate">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.artist}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveEvent(event.id);
                            }}
                            className="p-1"
                          >
                            <Heart className={`h-4 w-4 ${savedEvents.includes(event.id) ? 'fill-current text-red-500' : 'text-muted-foreground'}`} />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getTypeColor(event.type)} text-xs`}>
                            {getTypeIcon(event.type)} {event.type}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{event.startDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{event.time.split(' - ')[0]}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {event.price === 'free' ? 'Free' : `$${event.price}`}
                          </span>
                          <Button 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRSVP(event.id);
                            }}
                            disabled={rsvpEvents.includes(event.id)}
                            className="text-xs px-3 py-1 h-auto"
                          >
                            {rsvpEvents.includes(event.id) ? 'RSVP\'d' : 'RSVP'}
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

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or check back later for new events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
