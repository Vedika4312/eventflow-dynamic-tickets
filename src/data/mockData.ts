
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  price: number;
  currency: string;
  totalTickets: number;
  soldTickets: number;
  image: string;
  category: string;
  tags: string[];
  featured: boolean;
}

export interface Ticket {
  id: string;
  eventId: string;
  tokenId: string;
  owner: string;
  purchaseDate: string;
  status: 'upcoming' | 'active' | 'used' | 'expired';
  seat?: string;
  ticketClass: 'general' | 'vip' | 'platinum';
  transferable: boolean;
  resellable: boolean;
  qrCode: string;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Solana Summit 2025',
    description: 'The biggest Solana developer conference with workshops, talks, and networking opportunities.',
    date: '2025-06-15',
    time: '09:00',
    location: 'San Francisco, CA',
    organizer: 'Solana Foundation',
    price: 0.5,
    currency: 'SOL',
    totalTickets: 1000,
    soldTickets: 750,
    image: 'https://source.unsplash.com/random/400x300/?blockchain',
    category: 'Conference',
    tags: ['blockchain', 'developers', 'web3'],
    featured: true
  },
  {
    id: '2',
    title: 'NFT Art Exhibition',
    description: 'Showcasing the best NFT artists on Solana with live minting and auctions.',
    date: '2025-07-22',
    time: '18:00',
    location: 'New York, NY',
    organizer: 'MetaGallery',
    price: 0.2,
    currency: 'SOL',
    totalTickets: 500,
    soldTickets: 320,
    image: 'https://source.unsplash.com/random/400x300/?art',
    category: 'Art',
    tags: ['nft', 'art', 'exhibition'],
    featured: true
  },
  {
    id: '3',
    title: 'Web3 Music Festival',
    description: 'A 3-day music festival where all tickets are dynamic NFTs with exclusive content.',
    date: '2025-08-10',
    time: '16:00',
    location: 'Austin, TX',
    organizer: 'Soundwave DAO',
    price: 1.2,
    currency: 'SOL',
    totalTickets: 5000,
    soldTickets: 3800,
    image: 'https://source.unsplash.com/random/400x300/?music',
    category: 'Music',
    tags: ['music', 'festival', 'entertainment'],
    featured: true
  },
  {
    id: '4',
    title: 'DeFi Investment Workshop',
    description: 'Learn about yield farming, liquidity pools and DeFi strategies on Solana.',
    date: '2025-05-05',
    time: '14:00',
    location: 'Online',
    organizer: 'DeFi Alliance',
    price: 0.1,
    currency: 'SOL',
    totalTickets: 200,
    soldTickets: 150,
    image: 'https://source.unsplash.com/random/400x300/?finance',
    category: 'Workshop',
    tags: ['defi', 'investment', 'finance'],
    featured: false
  },
  {
    id: '5',
    title: 'Metaverse Gaming Tournament',
    description: 'Compete in the first cross-metaverse gaming tournament with NFT prizes.',
    date: '2025-09-18',
    time: '12:00',
    location: 'Virtual World',
    organizer: 'GameFi Labs',
    price: 0.3,
    currency: 'SOL',
    totalTickets: 1000,
    soldTickets: 950,
    image: 'https://source.unsplash.com/random/400x300/?gaming',
    category: 'Gaming',
    tags: ['metaverse', 'gaming', 'tournament'],
    featured: false
  },
  {
    id: '6',
    title: 'Blockchain Developer Bootcamp',
    description: 'Intensive 2-day bootcamp for developers to learn Solana programming.',
    date: '2025-07-05',
    time: '09:00',
    location: 'Miami, FL',
    organizer: 'SolDev Academy',
    price: 0.8,
    currency: 'SOL',
    totalTickets: 100,
    soldTickets: 80,
    image: 'https://source.unsplash.com/random/400x300/?coding',
    category: 'Education',
    tags: ['development', 'coding', 'education'],
    featured: false
  }
];

export const mockTickets: Ticket[] = [
  {
    id: '1',
    eventId: '1',
    tokenId: 'NFT12345',
    owner: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    purchaseDate: '2025-04-01',
    status: 'upcoming',
    ticketClass: 'general',
    transferable: true,
    resellable: true,
    qrCode: 'data:image/png;base64,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'
  },
  {
    id: '2',
    eventId: '3',
    tokenId: 'NFT67890',
    owner: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    purchaseDate: '2025-03-15',
    status: 'upcoming',
    ticketClass: 'vip',
    transferable: true,
    resellable: true,
    qrCode: 'data:image/png;base64,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'
  }
];
