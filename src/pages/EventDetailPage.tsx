
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, User, Share, Heart, Ticket, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEventInteraction } from "@/hooks/useEventInteraction";
import { useTicketPurchase } from "@/hooks/useTicketPurchase";
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [ticketClass, setTicketClass] = useState<'general' | 'vip' | 'platinum'>('general');
  
  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { toast: hookToast } = useToast();
  const { toggleFavorite, isFavorite, isChecking } = useEventInteraction(id || '');
  const { purchaseTicket, isProcessing } = useTicketPurchase(id || '');
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // First try to get from Supabase
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setEvent(data);
        } else {
          // If not found in Supabase, try to use mock data
          const mockEvents = await import('@/data/mockData').then(module => module.mockEvents);
          const mockEvent = mockEvents.find(e => e.id === id);
          
          if (mockEvent) {
            setEvent(mockEvent);
          } else {
            setEvent(null);
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        // Try to use mock data as fallback
        try {
          const mockEvents = await import('@/data/mockData').then(module => module.mockEvents);
          const mockEvent = mockEvents.find(e => e.id === id);
          
          if (mockEvent) {
            setEvent(mockEvent);
          } else {
            setEvent(null);
          }
        } catch (fallbackError) {
          console.error('Error fetching mock data:', fallbackError);
          setEvent(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error("Failed to copy link");
    }
  };

  const handlePurchase = () => {
    if (!connected) {
      hookToast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase tickets",
        variant: "destructive"
      });
      setVisible(true);
      return;
    }
    
    setPurchaseDialogOpen(true);
  };
  
  const confirmPurchase = async () => {
    if (!event) return;
    
    // Calculate price based on ticket class
    let priceMultiplier = 1;
    switch (ticketClass) {
      case 'vip':
        priceMultiplier = 2.5;
        break;
      case 'platinum':
        priceMultiplier = 5;
        break;
      default:
        priceMultiplier = 1;
    }
    
    const success = await purchaseTicket(event, ticketQuantity, ticketClass);
    
    if (success) {
      setPurchaseDialogOpen(false);
      
      // Update the event ticket count in the UI
      setEvent(prev => ({
        ...prev,
        soldTickets: prev.soldTickets + ticketQuantity
      }));
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-2/4 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
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
                src={event.image_url || event.image} 
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
                  className={`border-white/20 ${isFavorite ? 'bg-blocktix-dark/80' : ''}`}
                  onClick={toggleFavorite}
                  disabled={isChecking}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-white/20"
                  onClick={handleShare}
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
                  <p className="font-medium">{event.time || "19:00"}</p>
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
                  <p className="font-medium">
                    {event.organizer || event.organizer_wallet?.substring(0, 6) + '...' + event.organizer_wallet?.slice(-4)}
                  </p>
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
                  disabled={isProcessing}
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  {isProcessing ? "Processing..." : "Purchase NFT Ticket"}
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
      
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="bg-blocktix-dark/90 border-white/10">
          <DialogHeader>
            <DialogTitle>Purchase Tickets</DialogTitle>
            <DialogDescription>
              Select ticket type and quantity for "{event.title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="ticket-class">
                Ticket Class
              </label>
              <Select 
                value={ticketClass} 
                onValueChange={(value) => setTicketClass(value as 'general' | 'vip' | 'platinum')}
              >
                <SelectTrigger className="bg-blocktix-dark/50 border-white/10">
                  <SelectValue placeholder="Select ticket class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Admission ({event.price} {event.currency})</SelectItem>
                  <SelectItem value="vip">VIP ({(event.price * 2.5).toFixed(2)} {event.currency})</SelectItem>
                  <SelectItem value="platinum">Platinum ({(event.price * 5).toFixed(2)} {event.currency})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="ticket-quantity">
                Quantity
              </label>
              <Select 
                value={ticketQuantity.toString()} 
                onValueChange={(value) => setTicketQuantity(Number(value))}
              >
                <SelectTrigger className="bg-blocktix-dark/50 border-white/10">
                  <SelectValue placeholder="Select quantity" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'ticket' : 'tickets'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-black/30 p-4 rounded mt-2">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Price per ticket:</span>
                <span>
                  {ticketClass === 'vip' 
                    ? (event.price * 2.5).toFixed(2)
                    : ticketClass === 'platinum'
                      ? (event.price * 5).toFixed(2)
                      : event.price
                  } {event.currency}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Quantity:</span>
                <span>{ticketQuantity}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  {ticketClass === 'vip'
                    ? (event.price * 2.5 * ticketQuantity).toFixed(2)
                    : ticketClass === 'platinum'
                      ? (event.price * 5 * ticketQuantity).toFixed(2)
                      : (event.price * ticketQuantity).toFixed(2)
                  } {event.currency}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setPurchaseDialogOpen(false)}
              className="border-white/20"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmPurchase}
              className="bg-gradient-purple hover:opacity-90"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Purchase"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EventDetailPage;
