export interface Booth {
  name: string;
  artist: string;
  location: string;
  image: string;
}

export const booths: Booth[] = [
  {
    name: "Ceramic Studio & Shop",
    artist: "Sofia Andersson", 
    location: "Brooklyn Arts District",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=80&fit=crop"
  },
  {
    name: "Street Photography Studio",
    artist: "Marcus Chen",
    location: "Williamsburg Market", 
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=80&h=80&fit=crop"
  }
];