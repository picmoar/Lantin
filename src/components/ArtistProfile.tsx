import { useState } from 'react';
import { ArrowLeft, Heart, MapPin, Calendar, Tag, MessageCircle, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { type Artist } from '../data/artists';
import { ArtworkCarousel } from './ArtworkCarousel';

interface ArtistProfileProps {
  artist: Artist;
  isSaved: boolean;
  onSave: () => void;
  onBack: () => void;
  onMessage?: () => void;
}

export function ArtistProfile({ artist, isSaved, onSave, onBack, onMessage }: ArtistProfileProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [isArtworkDialogOpen, setIsArtworkDialogOpen] = useState(false);

  // Check if tags exceed one line (approximate)
  const maxTagsInOneLine = 3;
  const hasMoreTags = artist.tags.length > maxTagsInOneLine;
  const visibleTags = showAllTags ? artist.tags : artist.tags.slice(0, maxTagsInOneLine);

  // Get artworks that are for sale
  const forSaleArtworks = artist.artworks ? artist.artworks.filter(artwork => artwork.isForSale) : [];

  const handleArtworkClick = (artwork: any) => {
    setSelectedArtwork(artwork);
    setIsArtworkDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onMessage}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </Button>
            
            <Button
              variant={isSaved ? "default" : "outline"}
              size="sm"
              onClick={onSave}
              className={isSaved ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <Heart className={`h-4 w-4 mr-1 ${isSaved ? "fill-white" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* Artist Header */}
      <div className="p-4">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={artist.profileImage}
            alt={artist.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-xl text-primary mb-1">{artist.name}</h1>
            <div className="flex items-center gap-1 text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span>{artist.location}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{artist.yearsActive} years active</span>
            </div>
          </div>
        </div>

        {/* Tags with View More/Less */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {visibleTags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          
          {hasMoreTags && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllTags(!showAllTags)}
              className="text-primary hover:text-primary/80 p-0 h-auto"
            >
              {showAllTags ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  View Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  View More
                </>
              )}
            </Button>
          )}
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h3 className="mb-2">About</h3>
          <p className="text-muted-foreground leading-relaxed">{artist.bio}</p>
        </div>

        <Separator className="mb-6" />

        {/* Artwork Gallery - Like My Profile Section */}
        <div className="mb-6">
          <h3 className="mb-4">Artworks</h3>
          
          {artist.artworks && artist.artworks.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {artist.artworks.map((artwork) => {
                const primaryPhoto = artwork.photos.find(p => p.isPrimary) || artwork.photos[0];
                
                return (
                  <Card 
                    key={artwork.id} 
                    className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow" 
                    onClick={() => handleArtworkClick(artwork)}
                  >
                    <div className="relative aspect-square">
                      {primaryPhoto ? (
                        <>
                          <img
                            src={primaryPhoto.url}
                            alt={artwork.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          {artwork.photos.length > 1 && (
                            <Badge className="absolute top-2 right-2 bg-black/70 text-white text-xs">
                              +{artwork.photos.length - 1}
                            </Badge>
                          )}
                          {artwork.isForSale && (
                            <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                              For Sale
                            </Badge>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Tag className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3">
                      <h4 className="font-medium text-sm truncate">{artwork.title}</h4>
                      <p className="text-xs text-muted-foreground">{artwork.medium} • {artwork.year}</p>
                      {artwork.isForSale && artwork.price && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          ${artwork.price}
                        </Badge>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Fallback to original artwork images for backward compatibility */
            <div className="grid grid-cols-2 gap-3">
              {artist.artworkImages.map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200">
                  <img
                    src={image}
                    alt={`${artist.name}'s artwork ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* On Sale Section */}
        {forSaleArtworks.length > 0 && (
          <>
            <Separator className="mb-6" />
            
            <div className="mb-6">
              <h3 className="mb-4">On Sale</h3>
              
              <div className="flex gap-3 overflow-x-auto pb-2">
                {forSaleArtworks.map((artwork) => {
                  const primaryPhoto = artwork.photos.find(p => p.isPrimary) || artwork.photos[0];
                  
                  return (
                    <div 
                      key={artwork.id}
                      className="flex-shrink-0 w-24 cursor-pointer group"
                      onClick={() => handleArtworkClick(artwork)}
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                        {primaryPhoto && (
                          <img
                            src={primaryPhoto.url}
                            alt={artwork.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs font-medium truncate">{artwork.title}</p>
                        <p className="text-xs text-green-600 font-medium">${artwork.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Artwork Detail Dialog */}
      <Dialog open={isArtworkDialogOpen} onOpenChange={setIsArtworkDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedArtwork && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedArtwork.title}</DialogTitle>
                <DialogDescription>
                  {selectedArtwork.medium} • {selectedArtwork.year}
                  {selectedArtwork.dimensions && ` • ${selectedArtwork.dimensions}`}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Artwork Photos */}
                {selectedArtwork.photos.length > 0 && (
                  <div>
                    <ArtworkCarousel
                      photos={selectedArtwork.photos}
                      title={selectedArtwork.title}
                      showControls={true}
                      showCounter={true}
                      className="rounded-lg overflow-hidden"
                    />
                  </div>
                )}

                {/* Description */}
                {selectedArtwork.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedArtwork.description}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {selectedArtwork.tags && selectedArtwork.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedArtwork.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price and Purchase */}
                {selectedArtwork.isForSale && selectedArtwork.price && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Price</span>
                      <span className="text-2xl font-bold text-green-600">${selectedArtwork.price}</span>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Purchase Now
                    </Button>
                  </div>
                )}

                {/* Contact Artist */}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={onMessage}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Contact Artist
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onSave}
                    className={isSaved ? "bg-red-50 text-red-600 border-red-200" : ""}
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
