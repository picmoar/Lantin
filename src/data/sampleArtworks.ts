export interface ArtworkPhoto {
  id: string;
  url: string;
}

export interface SampleArtwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  medium: string;
  dimensions: string;
  year: string;
  photos: ArtworkPhoto[];
  tags: string[];
}

export const generateSampleArtworks = (artistName: string = 'Demo Artist'): SampleArtwork[] => {
  return [
    {
      id: 'sample-1',
      title: 'Abstract Expression Series',
      artist: artistName,
      description: 'A powerful collection of abstract paintings exploring emotion through bold colors and dynamic brushstrokes. Each piece in this series represents a different emotional state, from chaos to tranquility.',
      price: 1850,
      medium: 'Acrylic on Canvas',
      dimensions: '48" x 60"',
      year: '2024',
      photos: [
        { id: 'p1-1', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=800&fit=crop' },
        { id: 'p1-2', url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&h=800&fit=crop' },
        { id: 'p1-3', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop' },
        { id: 'p1-4', url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=800&fit=crop' },
        { id: 'p1-5', url: 'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=600&h=800&fit=crop' },
        { id: 'p1-6', url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=800&fit=crop' }
      ],
      tags: ['abstract', 'expressive', 'colorful', 'emotional']
    },
    {
      id: 'sample-2',
      title: 'Ceramic Poetry Collection',
      artist: artistName,
      description: 'Handcrafted ceramic vessels inspired by ancient techniques and modern minimalism. Each piece tells a story of earth, fire, and human touch.',
      price: 420,
      medium: 'Stoneware Clay, Natural Glazes',
      dimensions: '8"-14" height',
      year: '2024',
      photos: [
        { id: 'p2-1', url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=800&fit=crop' },
        { id: 'p2-2', url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=800&fit=crop' },
        { id: 'p2-3', url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&h=800&fit=crop' },
        { id: 'p2-4', url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=800&fit=crop' }
      ],
      tags: ['ceramics', 'handmade', 'functional', 'minimalist']
    },
    {
      id: 'sample-3',
      title: 'Street Photography: NYC Moments',
      artist: artistName,
      description: 'Candid moments captured on the streets of New York City. Black and white photography that reveals the poetry in everyday urban life.',
      price: 550,
      medium: 'Digital Photography, Silver Gelatin Prints',
      dimensions: '16" x 24"',
      year: '2024',
      photos: [
        { id: 'p3-1', url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=800&fit=crop' },
        { id: 'p3-2', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=800&fit=crop' },
        { id: 'p3-3', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop' },
        { id: 'p3-4', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=800&fit=crop' },
        { id: 'p3-5', url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=800&fit=crop' }
      ],
      tags: ['photography', 'street', 'blackandwhite', 'urban']
    },
    {
      id: 'sample-4',
      title: 'Digital Metamorphosis',
      artist: artistName,
      description: 'A futuristic exploration of transformation and evolution through digital art. Combining AI-assisted creation with traditional artistic vision.',
      price: 890,
      medium: 'Digital Art, NFT Available',
      dimensions: '3840 x 5120 pixels',
      year: '2024',
      photos: [
        { id: 'p4-1', url: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&h=800&fit=crop' },
        { id: 'p4-2', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=800&fit=crop' },
        { id: 'p4-3', url: 'https://images.unsplash.com/photo-1578662015701-6b9c83b65be7?w=600&h=800&fit=crop' },
        { id: 'p4-4', url: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&h=800&fit=crop' }
      ],
      tags: ['digital', 'futuristic', 'technology', 'NFT']
    },
    {
      id: 'sample-5',
      title: 'Botanical Studies in Watercolor',
      artist: artistName,
      description: 'Delicate watercolor paintings of rare flowers and plants. Each study captures the ephemeral beauty of nature with scientific precision and artistic sensitivity.',
      price: 320,
      medium: 'Watercolor on Cold Press Paper',
      dimensions: '12" x 16"',
      year: '2023',
      photos: [
        { id: 'p5-1', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=800&fit=crop' },
        { id: 'p5-2', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&h=800&fit=crop' },
        { id: 'p5-3', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop' }
      ],
      tags: ['watercolor', 'botanical', 'nature', 'delicate']
    },
    {
      id: 'sample-6',
      title: 'Mixed Media Portraits',
      artist: artistName,
      description: 'Contemporary portraits combining traditional painting techniques with collage, digital elements, and found objects. Each piece explores identity in the digital age.',
      price: 1650,
      medium: 'Mixed Media on Wood Panel',
      dimensions: '30" x 40"',
      year: '2024',
      photos: [
        { id: 'p6-1', url: 'https://images.unsplash.com/photo-1578632749014-ca4bb74fdb9e?w=600&h=800&fit=crop' },
        { id: 'p6-2', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=800&fit=crop' },
        { id: 'p6-3', url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=800&fit=crop' },
        { id: 'p6-4', url: 'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=600&h=800&fit=crop' },
        { id: 'p6-5', url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=800&fit=crop' },
        { id: 'p6-6', url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&h=800&fit=crop' },
        { id: 'p6-7', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop' }
      ],
      tags: ['portrait', 'mixedmedia', 'contemporary', 'identity']
    },
    {
      id: 'sample-7',
      title: 'Sculpture: Steel & Light',
      artist: artistName,
      description: 'Large-scale metal sculpture that plays with light and shadow throughout the day. The piece transforms as natural light changes, creating an ever-evolving artwork.',
      price: 12000,
      medium: 'Cor-Ten Steel, LED Integration',
      dimensions: '8\' x 6\' x 4\'',
      year: '2024',
      photos: [
        { id: 'p7-1', url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=800&fit=crop' },
        { id: 'p7-2', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop' },
        { id: 'p7-3', url: 'https://images.unsplash.com/photo-1542042161784-2031cd45ffcb?w=600&h=800&fit=crop' },
        { id: 'p7-4', url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&h=800&fit=crop' },
        { id: 'p7-5', url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=800&fit=crop' }
      ],
      tags: ['sculpture', 'steel', 'light', 'monumental']
    },
    {
      id: 'sample-8',
      title: 'Textile Art: Woven Stories',
      artist: artistName,
      description: 'Hand-woven textiles using traditional techniques with contemporary materials. Each piece incorporates recycled fibers and tells a story of sustainability and tradition.',
      price: 780,
      medium: 'Wool, Recycled Cotton, Metallic Threads',
      dimensions: '36" x 48"',
      year: '2024',
      photos: [
        { id: 'p8-1', url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=800&fit=crop' },
        { id: 'p8-2', url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=800&fit=crop' }
      ],
      tags: ['textile', 'sustainable', 'handwoven', 'traditional']
    }
  ];
};