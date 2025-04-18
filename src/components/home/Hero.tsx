
import React from 'react';
import { Button } from "@/components/ui/button";
import { SearchIcon, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-blocktix-dark overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1920x1080/?concert')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blocktix-dark"></div>
      
      <div className="container mx-auto px-4 relative z-10 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover the Future of Event Ticketing
          </h1>
          <p className="text-xl text-white/80 mb-8">
            BlockTix transforms event experiences with dynamic NFT tickets on Solana blockchain.
            Experience transparency, security, and unique digital collectibles that evolve over time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-gradient-purple hover:opacity-90 text-white px-8 py-6" size="lg" asChild>
              <Link to="/events">
                <Ticket className="mr-2 h-5 w-5" />
                Browse Events
              </Link>
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6" size="lg" asChild>
              <Link to="/create">
                Create Event
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 bg-blocktix-dark/70 backdrop-blur-md rounded-lg border border-white/10 p-4">
            <div className="flex">
              <input 
                type="text" 
                placeholder="Search events, artists, venues..." 
                className="bg-transparent border-0 outline-none text-white flex-grow"
              />
              <SearchIcon className="text-white/70 h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
