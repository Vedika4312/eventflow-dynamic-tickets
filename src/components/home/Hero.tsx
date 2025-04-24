
import React from 'react';
import { Button } from "@/components/ui/button";
import { SearchIcon, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-blocktix-dark overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1920x1080/?concert')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blocktix-dark/80 to-blocktix-dark"></div>
      
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 py-20 md:py-32">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
            Discover the Future of Event Ticketing
          </h1>
          <p className="text-xl text-white/80 mb-8">
            BlockTix transforms event experiences with dynamic NFT tickets on Solana blockchain.
            Experience transparency, security, and unique digital collectibles that evolve over time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-gradient-purple hover:opacity-90 text-white px-8 py-6 hover-float pulse-on-hover" 
              size="lg" 
              asChild
            >
              <Link to="/events">
                <Ticket className="mr-2 h-5 w-5" />
                Browse Events
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 hover-float" 
              size="lg" 
              asChild
            >
              <Link to="/create">
                Create Event
              </Link>
            </Button>
          </div>
          
          <div className="mt-12">
            <div className="glass-effect rounded-lg p-4 transition-all duration-300 hover:bg-white/10">
              <div className="flex items-center">
                <input 
                  type="text" 
                  placeholder="Search events, artists, venues..." 
                  className="bg-transparent border-0 outline-none text-white flex-grow placeholder:text-white/50"
                />
                <SearchIcon className="text-white/70 h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
