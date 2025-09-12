export interface Artist {
  id: number;
  name: string;
  specialty: string;
  location: string;
  description: string;
  fullBio: string;
  image: string;
  profileImage: string;
  artworkImages: string[];
  featured: boolean;
  followers: string;
  artworks: number;
  exhibitions: number;
}

export const artists: Artist[] = [
  {
    id: 1,
    name: 'Elena Rodriguez',
    specialty: 'Abstract Artist',
    location: 'SoHo, NYC',
    description: 'Creating vibrant abstract paintings that explore emotion and color.',
    fullBio: 'Elena Rodriguez is a visionary abstract artist whose work transcends traditional boundaries of color and form. Born in Barcelona and raised in New York City, her multicultural background deeply influences her artistic vision. Elena\'s paintings are explosive symphonies of color that seem to dance across the canvas, each brushstroke a deliberate yet intuitive expression of human emotion.\n\nHer signature technique involves layering translucent glazes over bold, gestural marks, creating depth that seems to pulse with life. Critics have described her work as "emotional landscapes that exist in a realm between dream and reality." Her latest series, "Urban Rhythms," captures the energy of city life through abstract interpretations of subway sounds, street conversations, and the constant motion of metropolitan existence.\n\nElena\'s work has been featured in over 30 solo exhibitions across New York, Los Angeles, and Barcelona. She holds an MFA from Parsons School of Design and has been the recipient of the prestigious Pollock-Krasner Foundation Grant. Her pieces are held in permanent collections at the Whitney Museum of American Art and the Brooklyn Museum.\n\nWhen not in her SoHo studio, Elena teaches master classes on color theory and serves as a mentor for emerging Latino artists. She believes art should be a bridge between communities, and regularly organizes community art workshops in underserved neighborhoods.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b6c5?w=500&h=600&fit=crop&crop=face',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b6c5?w=200&h=200&fit=crop&crop=face',
    artworkImages: [
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500&h=600&fit=crop'
    ],
    featured: true,
    followers: '12.4k',
    artworks: 47,
    exhibitions: 30
  },
  {
    id: 2,
    name: 'Marcus Chen',
    specialty: 'Street Photographer',
    location: 'Brooklyn, NYC',
    description: 'Capturing authentic moments of urban life and human connection.',
    fullBio: 'Marcus Chen is a master of the decisive moment, a street photographer whose lens captures the poetry hidden in everyday urban life. Growing up in Chinatown and later moving to Brooklyn, Marcus developed an intimate understanding of how communities shape and are shaped by their environments.\n\nHis photography philosophy centers on patience and empathy. Marcus can spend hours in a single location, becoming part of the scenery until people forget about his camera entirely. This approach allows him to capture genuine, unguarded moments that reveal the humanity in strangers\' faces, the stories written in body language, and the beauty found in mundane interactions.\n\nHis recent project "Invisible Neighbors" documents the lives of essential workers during the pandemic, showing both their struggles and resilience. The series was featured in TIME Magazine and led to a photobook that raised over $50,000 for community support organizations.\n\nMarcus\' work has been exhibited internationally, including at the International Center of Photography in New York, the Victoria and Albert Museum in London, and the Tokyo Metropolitan Museum of Photography. He is also a contributing photographer for National Geographic and teaches photography workshops focused on ethical street photography.\n\nHis gear of choice is a vintage Leica M6 with a 35mm lens, believing that the mechanical nature of film photography forces him to be more intentional with each frame. Marcus is currently working on a long-term project documenting the changing face of Brooklyn\'s neighborhoods.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=600&fit=crop&crop=face',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    artworkImages: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&h=600&fit=crop'
    ],
    featured: false,
    followers: '18.9k',
    artworks: 156,
    exhibitions: 25
  },
  {
    id: 3,
    name: 'Sofia Andersson',
    specialty: 'Ceramic Artist',
    location: 'Queens, NYC',
    description: 'Handcrafted ceramics blending traditional and contemporary techniques.',
    fullBio: 'Sofia Andersson bridges two worlds through clay: the ancient traditions of Scandinavian pottery and the innovative spirit of contemporary New York art. Born in Stockholm and trained at the prestigious Konstfack (University of Arts, Crafts and Design), Sofia moved to New York fifteen years ago, bringing with her centuries-old techniques that she continuously reinvents for modern life.\n\nHer studio in Long Island City is a sanctuary of controlled chaos, where traditional pottery wheels stand alongside 3D printers, and ancient glazing techniques meet experimental materials. Sofia\'s work is characterized by clean, minimalist forms that somehow manage to feel both timeless and futuristic. Her signature piece, the "Meditation Vessel" series, consists of large-scale ceramic sculptures designed for public spaces that change color throughout the day as light shifts across their surfaces.\n\nWhat sets Sofia apart is her commitment to sustainability in ceramics. She developed her own clay body using recycled materials from New York construction sites, turning urban waste into beautiful, functional art. Her glazes are lead-free and often incorporate ash from specific New York trees, connecting each piece to the city\'s natural history.\n\nSofia\'s work has been commissioned for major installations at the Museum of Arts and Design, Lincoln Center, and several high-profile restaurants throughout the city. She regularly collaborates with architects on large-scale public art projects and has taught master classes at the Brooklyn Clay Works and Anderson Ranch Arts Center.\n\nBeyond her artistic practice, Sofia is an advocate for artisan mental health, having founded "Clay Therapy NYC," a non-profit that provides ceramics-based therapy sessions for veterans and trauma survivors.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=600&fit=crop&crop=face',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    artworkImages: [
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&h=600&fit=crop'
    ],
    featured: true,
    followers: '9.2k',
    artworks: 89,
    exhibitions: 18
  },
  {
    id: 4,
    name: 'Alex Kim',
    specialty: 'Digital Artist',
    location: 'Manhattan, NYC',
    description: 'Exploring the future of art through AI and digital mediums.',
    fullBio: 'Alex Kim stands at the intersection of art and technology, creating digital experiences that challenge our understanding of creativity in the age of artificial intelligence. With a background in computer science from MIT and fine arts training at RISD, Alex represents a new generation of artists who see code as just another medium for creative expression.\n\nTheir work spans virtual reality installations, AI-generated paintings, and interactive digital sculptures that respond to viewer presence and emotion. Alex\'s breakthrough piece, "Neural Dreams," is a constantly evolving AI painting that learns from visitor interactions at the Whitney Biennial, creating unique iterations that can never be repeated.\n\nWhat makes Alex\'s work particularly compelling is their philosophical approach to AI collaboration. Rather than viewing artificial intelligence as a tool, Alex treats AI systems as creative partners, engaging in a genuine dialogue between human intuition and machine logic. This approach has led to groundbreaking works that neither human nor AI could create alone.\n\nAlex\'s recent series "Digital Ancestry" uses machine learning to analyze and reinterpret traditional Korean art forms, creating pieces that honor their cultural heritage while pushing the boundaries of digital art. This work was featured in a solo exhibition at the New Museum and sparked important conversations about cultural representation in the digital age.\n\nBeyond their artistic practice, Alex is a sought-after speaker at technology conferences worldwide, advocating for ethical AI development and the importance of artistic voices in shaping our technological future. They currently serve as an artist-in-residence at Google\'s Creative Lab and teach a popular course on AI and creativity at the School of Visual Arts.\n\nAlex\'s work has been collected by major institutions including MoMA, the Hirshhorn Museum, and the Centre Pompidou in Paris.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&crop=face',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    artworkImages: [
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662015701-6b9c83b65be7?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=500&h=600&fit=crop'
    ],
    featured: false,
    followers: '25.7k',
    artworks: 203,
    exhibitions: 22
  },
  {
    id: 5,
    name: 'Maya Patel',
    specialty: 'Sculpture Artist',
    location: 'Bronx, NYC',
    description: 'Large-scale installations that challenge perceptions of space.',
    fullBio: 'Maya Patel creates sculptures that don\'t just occupy space—they transform it, challenge it, and invite viewers to reconsider their relationship with the world around them. Born in Mumbai and raised in the Bronx, Maya\'s work is deeply informed by her experience navigating between cultures, communities, and expectations.\n\nHer monumental installations are characterized by their bold use of industrial materials—steel, concrete, reclaimed wood—transformed into flowing, organic forms that seem to defy gravity. Maya\'s signature technique involves heating and bending massive steel beams into curves that appear almost fluid, creating sculptures that feel both ancient and futuristic.\n\nMaya\'s most celebrated work, "Rising Tides," is a permanent installation in Battery Park that responds to actual tidal data from New York Harbor. As water levels rise and fall, elements of the sculpture move and change color, creating a living artwork that connects viewers to climate change in a visceral, immediate way.\n\nHer commitment to social justice is woven throughout her artistic practice. Maya regularly creates community-centered installations that bring neighbors together around shared issues. Her project "Voices of the Concourse" in the South Bronx involved recording hundreds of community members talking about their hopes for their neighborhood, then translating those conversations into a massive steel and bronze installation that spans an entire city block.\n\nMaya\'s work has been featured in major public art projects across the globe, from the Venice Biennale to the sculpture gardens of Storm King Art Center. She holds an MFA from Yale School of Art and has received numerous awards, including the prestigious Joan Mitchell Foundation Grant.\n\nWhen not working on large-scale commissions, Maya teaches sculpture to high school students in the Bronx and runs workshops on metalworking for women and non-binary artists. She believes that art has the power to rebuild communities and regularly advocates for more public art funding in underserved neighborhoods.',
    image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500&h=600&fit=crop&crop=face',
    profileImage: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&h=200&fit=crop&crop=face',
    artworkImages: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542042161784-2031cd45ffcb?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=600&fit=crop'
    ],
    featured: true,
    followers: '14.8k',
    artworks: 34,
    exhibitions: 21
  }
];