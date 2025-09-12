export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  price: number;
  icon: string;
  featured: boolean;
  gradient: string[];
  type: string;
}

export const eventData: Event[] = [
  {
    id: 1,
    name: 'Digital Art Exhibition',
    description: 'Explore contemporary digital artworks from emerging artists',
    date: 'Dec 15-20',
    location: 'SoHo Gallery',
    price: 25,
    icon: '🎨',
    featured: true,
    gradient: ['#667eea', '#764ba2'],
    type: 'Exhibition'
  },
  {
    id: 2,
    name: 'Pottery Workshop',
    description: 'Learn traditional pottery techniques with master artisans',
    date: 'Dec 22',
    location: 'Clay Studio NYC',
    price: 85,
    icon: '🏺',
    featured: false,
    gradient: ['#f093fb', '#f5576c'],
    type: 'Workshop'
  },
  {
    id: 3,
    name: 'Street Art Walking Tour',
    description: 'Discover hidden murals and street art in the city',
    date: 'Dec 18',
    location: 'Williamsburg',
    price: 0,
    icon: '🎭',
    featured: false,
    gradient: ['#4facfe', '#00f2fe'],
    type: 'Tour'
  },
  {
    id: 4,
    name: 'Photography Showcase',
    description: 'Black and white photography from local photographers',
    date: 'Dec 25-30',
    location: 'Photo Gallery',
    price: 15,
    icon: '📸',
    featured: true,
    gradient: ['#43e97b', '#38f9d7'],
    type: 'Exhibition'
  },
  {
    id: 5,
    name: 'Sculpture Garden Opening',
    description: 'Grand opening of the new outdoor sculpture installation',
    date: 'Dec 28',
    location: 'Central Park',
    price: 0,
    icon: '🗿',
    featured: false,
    gradient: ['#fa709a', '#fee140'],
    type: 'Opening'
  },
  {
    id: 6,
    name: 'Abstract Painting Class',
    description: 'Express yourself through abstract painting techniques',
    date: 'Dec 30',
    location: 'Art Studio',
    price: 65,
    icon: '🖌️',
    featured: false,
    gradient: ['#a8edea', '#fed6e3'],
    type: 'Workshop'
  }
];