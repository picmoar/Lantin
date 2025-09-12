import React, { useState } from 'react';
import { Heart, ShoppingCart, Filter, Star, Truck, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  price: number;
  originalPrice?: number;
  image: string;
  medium: string;
  dimensions: string;
  year: number;
  description: string;
  isFeatured: boolean;
  isOnSale: boolean;
  rating: number;
  reviews: number;
  availability: 'available' | 'limited' | 'sold';
  shippingInfo: string;
  tags: string[];
}

const mockArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Midnight Reflections',
    artist: 'Elena Rodriguez',
    artistId: '1',
    price: 850,
    originalPrice: 1200,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop',
    medium: 'Oil on Canvas',
    dimensions: '24" × 36"',
    year: 2024,
    description: 'A captivating abstract piece that explores the interplay between darkness and light, creating a sense of depth and movement.',
    isFeatured: true,
    isOnSale: true,
    rating: 4.8,
    reviews: 23,
    availability: 'available',
    shippingInfo: 'Free shipping',
    tags: ['Abstract', 'Large', 'Contemporary']
  },
  {
    id: '2',
    title: 'Urban Poetry',
    artist: 'Marcus Chen',
    artistId: '2',
    price: 320,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    medium: 'Digital Print',
    dimensions: '16" × 20"',
    year: 2024,
    description: 'A striking street photography piece that captures the raw beauty and energy of city life.',
    isFeatured: false,
    isOnSale: false,
    rating: 4.6,
    reviews: 18,
    availability: 'limited',
    shippingInfo: '$15 shipping',
    tags: ['Photography', 'Urban', 'Black & White']
  },
  {
    id: '3',
    title: 'Nordic Dawn Bowl',
    artist: 'Sofia Andersson',
    artistId: '3',
    price: 180,
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=600&fit=crop',
    medium: 'Ceramic',
    dimensions: '8" diameter',
    year: 2024,
    description: 'Handcrafted ceramic bowl with Nordic-inspired glazing techniques, perfect for both functional and decorative use.',
    isFeatured: true,
    isOnSale: false,
    rating: 4.9,
    reviews: 31,
    availability: 'available',
    shippingInfo: 'Fragile item - $25 shipping',
    tags: ['Ceramic', 'Functional', 'Nordic']
  },
  {
    id: '4',
    title: 'Digital Dreams #3',
    artist: 'David Park',
    artistId: '4',
    price: 450,
    image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&h=600&fit=crop',
    medium: 'Digital Art Print',
    dimensions: '18" × 24"',
    year: 2024,
    description: 'Part of the Digital Dreams series, this piece explores futuristic themes through vibrant digital illustration.',
    isFeatured: false,
    isOnSale: false,
    rating: 4.7,
    reviews: 12,
    availability: 'available',
    shippingInfo: 'Free shipping',
    tags: ['Digital', 'Futuristic', 'Colorful']
  }
];

export function Shop() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [filterBy, setFilterBy] = useState('all');

  const handleSaveItem = (artworkId: string) => {
    setSavedItems(prev => 
      prev.includes(artworkId) 
        ? prev.filter(id => id !== artworkId)
        : [...prev, artworkId]
    );
  };

  const handleAddToCart = (artworkId: string) => {
    setCartItems(prev => 
      prev.includes(artworkId) 
        ? prev
        : [...prev, artworkId]
    );
  };

  const filteredArtworks = mockArtworks.filter(artwork => {
    if (filterBy === 'all') return true;
    if (filterBy === 'available') return artwork.availability === 'available';
    if (filterBy === 'sale') return artwork.isOnSale;
    return artwork.tags.some(tag => tag.toLowerCase().includes(filterBy.toLowerCase()));
  });

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.year - a.year;
      default:
        return b.isFeatured ? 1 : -1;
    }
  });

  if (selectedArtwork) {
    return (
      <div className="h-screen overflow-y-auto bg-white">
        <div className="relative">
          <img
            src={selectedArtwork.image}
            alt={selectedArtwork.title}
            className="w-full h-80 object-cover"
          />
          <Button
            variant="ghost"
            className="absolute top-4 left-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            onClick={() => setSelectedArtwork(null)}
          >
            ← Back
          </Button>
          <Button
            variant="ghost"
            className="absolute top-4 right-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            onClick={() => handleSaveItem(selectedArtwork.id)}
          >
            <Heart className={`h-5 w-5 ${savedItems.includes(selectedArtwork.id) ? 'fill-current text-red-500' : ''}`} />
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h1>{selectedArtwork.title}</h1>
              {selectedArtwork.isFeatured && (
                <Badge variant="secondary">Featured</Badge>
              )}
              {selectedArtwork.isOnSale && (
                <Badge className="bg-red-500">Sale</Badge>
              )}
            </div>
            <p className="text-muted-foreground">by {selectedArtwork.artist}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= selectedArtwork.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {selectedArtwork.rating} ({selectedArtwork.reviews} reviews)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {selectedArtwork.isOnSale && selectedArtwork.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${selectedArtwork.originalPrice}
                  </span>
                )}
                <span className="text-2xl font-medium">
                  ${selectedArtwork.price}
                </span>
              </div>
              <Badge 
                variant={selectedArtwork.availability === 'available' ? 'secondary' : 'outline'}
                className={selectedArtwork.availability === 'sold' ? 'bg-red-100 text-red-800' : ''}
              >
                {selectedArtwork.availability === 'available' && 'In Stock'}
                {selectedArtwork.availability === 'limited' && 'Limited Stock'}
                {selectedArtwork.availability === 'sold' && 'Sold Out'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Medium:</span>
                <span className="text-sm">{selectedArtwork.medium}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Size:</span>
                <span className="text-sm">{selectedArtwork.dimensions}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Year:</span>
                <span className="text-sm">{selectedArtwork.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Shipping:</span>
                <span className="text-sm">{selectedArtwork.shippingInfo}</span>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {selectedArtwork.description}
          </p>

          <div className="mb-6">
            <h3 className="mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {selectedArtwork.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {selectedArtwork.shippingInfo} • Secure packaging • 30-day return policy
            </span>
          </div>

          <div className="space-y-3">
            {selectedArtwork.availability !== 'sold' && (
              <Button 
                className="w-full" 
                onClick={() => handleAddToCart(selectedArtwork.id)}
                disabled={cartItems.includes(selectedArtwork.id)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {cartItems.includes(selectedArtwork.id) ? 'Added to Cart' : 'Add to Cart'}
              </Button>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleSaveItem(selectedArtwork.id)}
              >
                <Heart className={`h-4 w-4 mr-2 ${savedItems.includes(selectedArtwork.id) ? 'fill-current' : ''}`} />
                {savedItems.includes(selectedArtwork.id) ? 'Saved' : 'Save'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  // Handle message artist functionality
                  console.log(`Message artist ${selectedArtwork.artist} about ${selectedArtwork.title}`);
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-white pb-16">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="mb-2">Art Shop</h1>
          <p className="text-muted-foreground">
            Discover and purchase original artworks directly from talented artists in our community.
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex gap-3 mb-6">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="All Items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sale">On Sale</SelectItem>
              <SelectItem value="abstract">Abstract</SelectItem>
              <SelectItem value="photography">Photography</SelectItem>
              <SelectItem value="ceramic">Ceramic</SelectItem>
              <SelectItem value="digital">Digital</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Items */}
        {sortBy === 'featured' && (
          <div className="mb-8">
            <h2 className="mb-4">Featured Artworks</h2>
            <div className="grid grid-cols-2 gap-4">
              {sortedArtworks.filter(artwork => artwork.isFeatured).map((artwork) => (
                <Card key={artwork.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedArtwork(artwork)}>
                  <div className="relative">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-32 object-cover"
                    />
                    {artwork.isOnSale && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        Sale
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveItem(artwork.id);
                      }}
                    >
                      <Heart className={`h-3 w-3 ${savedItems.includes(artwork.id) ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="text-sm font-medium mb-1 truncate">{artwork.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">by {artwork.artist}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {artwork.isOnSale && artwork.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${artwork.originalPrice}
                          </span>
                        )}
                        <span className="text-sm font-medium">${artwork.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{artwork.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Artworks */}
        <div>
          <h2 className="mb-4">
            {filterBy === 'all' ? 'All Artworks' : `${filterBy.charAt(0).toUpperCase() + filterBy.slice(1)} Artworks`}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {sortedArtworks.map((artwork) => (
              <Card key={artwork.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedArtwork(artwork)}>
                <div className="relative">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-32 object-cover"
                  />
                  {artwork.isOnSale && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      Sale
                    </Badge>
                  )}
                  {artwork.availability === 'limited' && (
                    <Badge variant="outline" className="absolute top-2 left-2 bg-white">
                      Limited
                    </Badge>
                  )}
                  {artwork.availability === 'sold' && (
                    <Badge className="absolute top-2 left-2 bg-gray-500">
                      Sold
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveItem(artwork.id);
                    }}
                  >
                    <Heart className={`h-3 w-3 ${savedItems.includes(artwork.id) ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                </div>
                <CardContent className="p-3">
                  <h4 className="text-sm font-medium mb-1 truncate">{artwork.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">by {artwork.artist}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {artwork.isOnSale && artwork.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${artwork.originalPrice}
                        </span>
                      )}
                      <span className="text-sm font-medium">${artwork.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{artwork.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
