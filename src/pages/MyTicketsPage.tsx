
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import DynamicTicket from '@/components/ticket/DynamicTicket';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useWalletIntegration } from '@/hooks/useWallet';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Ticket {
  id: string;
  event_id: string;
  purchase_price: number;
  purchase_currency: string;
  token_id: string;
  ticket_class: string;
  qr_code: string | null;
  status: string;
  owner_wallet: string;
  events?: {
    title: string;
    date: string;
    location: string;
  };
}

const MyTicketsPage = () => {
  const { publicKey } = useWalletIntegration();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTickets = async () => {
      console.log('Fetching tickets for wallet:', publicKey?.toString());
      
      if (!publicKey) {
        // For users without wallet, try to get tickets from localStorage for free events
        const localTickets = localStorage.getItem('freeTickets');
        if (localTickets) {
          try {
            const parsedTickets = JSON.parse(localTickets);
            console.log('Found local free tickets:', parsedTickets);
            setTickets(parsedTickets);
          } catch (error) {
            console.error('Error parsing local tickets:', error);
            setTickets([]);
          }
        } else {
          setTickets([]);
        }
        setLoading(false);
        return;
      }

      try {
        // First, let's try a simpler query to see what tickets exist
        const { data: allTickets, error: ticketsError } = await supabase
          .from('tickets')
          .select('*')
          .eq('owner_wallet', publicKey.toString());
          
        console.log('Raw tickets query result:', allTickets);
        console.log('Tickets query error:', ticketsError);
        
        if (ticketsError) {
          console.error('Error fetching tickets:', ticketsError);
          setTickets([]);
          setLoading(false);
          return;
        }

        if (!allTickets || allTickets.length === 0) {
          console.log('No tickets found for wallet');
          setTickets([]);
          setLoading(false);
          return;
        }

        // Now fetch the events data separately
        const eventIds = allTickets.map(ticket => ticket.event_id);
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('id, title, date, location')
          .in('id', eventIds);
          
        console.log('Events data:', eventsData);
        console.log('Events error:', eventsError);

        // Combine tickets with event data
        const ticketsWithEvents = allTickets.map(ticket => ({
          ...ticket,
          events: eventsData?.find(event => event.id === ticket.event_id)
        }));
        
        console.log('Final tickets with events:', ticketsWithEvents);
        setTickets(ticketsWithEvents);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, [publicKey]);

  // Helper function to determine if an event is upcoming or past
  const isUpcomingEvent = (eventDate: string) => {
    const now = new Date();
    const eventDateTime = new Date(eventDate);
    return eventDateTime > now;
  };

  // Filter tickets by event date instead of status
  const upcomingTickets = tickets.filter(ticket => 
    ticket.events?.date ? isUpcomingEvent(ticket.events.date) : true // Default to upcoming if no date
  );
  
  const pastTickets = tickets.filter(ticket => 
    ticket.events?.date ? !isUpcomingEvent(ticket.events.date) : false
  );

  console.log('Upcoming tickets:', upcomingTickets);
  console.log('Past tickets:', pastTickets);

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
        <p className="text-gray-400 mb-8">Manage your NFT tickets and collectibles</p>
        
        {!publicKey ? (
          <div className="space-y-6">
            <div className="text-center py-8 bg-blocktix-dark/50 rounded-lg border border-white/10">
              <h3 className="text-lg font-medium mb-2">Limited Access</h3>
              <p className="text-gray-400 mb-4">
                You can view free tickets claimed without a wallet, but connecting your wallet will give you access to all features.
              </p>
              <Button variant="default" className="bg-gradient-purple hover:opacity-90">
                Connect Wallet for Full Access
              </Button>
            </div>
            
            {tickets.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold mb-4">Free Tickets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="h-[400px]">
                      <DynamicTicket
                        eventTitle={ticket.events?.title || "Free Event"}
                        eventDate={ticket.events?.date || new Date().toISOString()}
                        eventLocation={ticket.events?.location || "Location TBD"}
                        ticketClass={(ticket.ticket_class.toLowerCase() as "general" | "vip" | "platinum")}
                        status="upcoming"
                        tokenId={ticket.token_id}
                        qrCode={ticket.qr_code || `https://blocktix-qr.vercel.app/ticket/${ticket.id}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-blocktix-dark/50 rounded-lg border border-white/10">
                <h3 className="text-xl font-medium mb-2">No tickets found</h3>
                <p className="text-gray-400 mb-6">You haven't claimed any free tickets yet</p>
                <Button asChild>
                  <Link to="/events">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Browse Events
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">
                Upcoming Events ({upcomingTickets.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past Events ({pastTickets.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {upcomingTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {upcomingTickets.map((ticket) => (
                    <div key={ticket.id} className="h-[400px]">
                      <DynamicTicket
                        eventTitle={ticket.events?.title || "Untitled Event"}
                        eventDate={ticket.events?.date || new Date().toISOString()}
                        eventLocation={ticket.events?.location || "Location Unknown"}
                        ticketClass={(ticket.ticket_class.toLowerCase() as "general" | "vip" | "platinum")}
                        status="upcoming"
                        tokenId={ticket.token_id}
                        qrCode={ticket.qr_code || `https://blocktix-qr.vercel.app/ticket/${ticket.id}`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-blocktix-dark/50 rounded-lg border border-white/10">
                  <h3 className="text-xl font-medium mb-2">No upcoming events</h3>
                  <p className="text-gray-400 mb-6">You don't have any upcoming event tickets</p>
                  <Button asChild>
                    <Link to="/events">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Browse Events
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {pastTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pastTickets.map((ticket) => (
                    <div key={ticket.id} className="h-[400px]">
                      <DynamicTicket
                        eventTitle={ticket.events?.title || "Untitled Event"}
                        eventDate={ticket.events?.date || new Date().toISOString()}
                        eventLocation={ticket.events?.location || "Location Unknown"}
                        ticketClass={(ticket.ticket_class.toLowerCase() as "general" | "vip" | "platinum")}
                        status="expired"
                        tokenId={ticket.token_id}
                        qrCode={ticket.qr_code || `https://blocktix-qr.vercel.app/ticket/${ticket.id}`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-blocktix-dark/50 rounded-lg border border-white/10">
                  <h3 className="text-xl font-medium mb-2">No past events</h3>
                  <p className="text-gray-400 mb-6">You haven't attended any events yet</p>
                  <Button asChild>
                    <Link to="/events">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Browse Events
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default MyTicketsPage;
