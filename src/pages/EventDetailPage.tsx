
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, User, Share, Heart, Ticket, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { mockEvents } from '@/data/mockData';
import { useToast } from "@/hooks/use-toast";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const event = mockEvents.find(e => e.id === id);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  
  const handlePurchase = () => {
    toast({
      title: "Processing purchase",
      description: "Connecting to wallet for payment...",
    });
  };
  
  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <p className="mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" className="border-white/20" asChild>
            <Link to="/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-64 object-cover"
              />
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-white/20"
                  onClick={() => {
                    setIsLiked(!isLiked);
                    toast({
                      title: isLiked ? "Removed from favorites" : "Added to favorites",
                      description: isLiked ? "Event removed from your favorites" : "Event added to your favorites",
                    });
                  }}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-white/20"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link copied",
                      description: "Event link copied to clipboard",
                    });
                  }}
                >
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center p-4 bg-blocktix-dark/50 rounded-lg border border-white/10">
                <Calendar className="h-5 w-5 mr-3 text-blocktix-purple" />
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blocktix-dark/50 rounded-lg border border-white/10">
                <Clock className="h-5 w-5 mr-3 text-blocktix-purple" />
                <div>
                  <p className="text-sm text-gray-400">Time</p>
                  <p className="font-medium">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blocktix-dark/50 rounded-lg border border-white/10">
                <MapPin className="h-5 w-5 mr-3 text-blocktix-purple" />
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">About this event</h2>
              <p className="text-gray-300">{event.description}</p>
              <p className="text-gray-300 mt-4">
                Join us for this incredible event where blockchain enthusiasts gather to experience
                the future of digital ownership and community engagement. This event features the latest
                in NFT technology, with special perks for ticket holders.
              </p>
              <p className="text-gray-300 mt-4">
                Your NFT ticket will dynamically evolve as the event date approaches and transform into
                a unique collectible after you attend, complete with exclusive utilities and benefits.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Organizer</h2>
              <div className="flex items-center">
                <div className="h-12 w-12 bg-blocktix-dark rounded-full flex items-center justify-center mr-4">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">{event.organizer}</p>
                  <p className="text-sm text-gray-400">Event Organizer</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="border border-white/10 bg-blocktix-dark/50 sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Ticket Information</h2>
                
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Price:</span>
                    <span className="font-bold">{event.price} {event.currency}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Available:</span>
                    <span>{event.totalTickets - event.soldTickets} tickets</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sold:</span>
                    <span>{Math.round((event.soldTickets / event.totalTickets) * 100)}%</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
                  <div 
                    className="bg-gradient-purple h-2.5 rounded-full" 
                    style={{ width: `${(event.soldTickets / event.totalTickets) * 100}%` }}
                  ></div>
                </div>
                
                <div className="mb-8">
                  <h3 className="font-medium mb-2">Ticket Includes:</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-blocktix-purple mr-2"></div>
                      <span>Event entry</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-blocktix-purple mr-2"></div>
                      <span>Evolving NFT collectible</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-blocktix-purple mr-2"></div>
                      <span>Exclusive post-event perks</span>
                    </li>
                  </ul>
                </div>
                
                <Button 
                  className="w-full bg-gradient-purple hover:opacity-90" 
                  size="lg"
                  onClick={handlePurchase}
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  Purchase NFT Ticket
                </Button>
                
                <p className="text-xs text-gray-400 text-center mt-4">
                  By purchasing, you agree to the terms and conditions.
                  Resale is allowed within the platform's guidelines.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailPage;
