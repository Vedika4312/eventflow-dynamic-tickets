
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
  const { publicKey, connected } = useWalletIntegration();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTickets = async () => {
      console.log('=== TICKET FETCH START ===');
      console.log('Connected:', connected);
      console.log('Public Key:', publicKey?.toString());
      
      setLoading(true);
      setError(null);
      
      try {
        let allTickets: Ticket[] = [];

        // If wallet is connected, fetch from database
        if (connected && publicKey) {
          console.log('Fetching tickets from database for wallet:', publicKey.toString());
          
          const { data: dbTickets, error: dbError } = await supabase
            .from('tickets')
            .select(`
              id,
              event_id,
              purchase_price,
              purchase_currency,
              token_id,
              ticket_class,
              qr_code,
              status,
              owner_wallet,
              events!inner (
                title,
                date,
                location
              )
            `)
            .eq('owner_wallet', publicKey.toString());

          console.log('Database tickets result:', dbTickets);
          console.log('Database error:', dbError);

          if (dbError) {
            console.error('Database error:', dbError);
            setError(`Database error: ${dbError.message}`);
          } else if (dbTickets && dbTickets.length > 0) {
            // Transform database tickets
            const transformedDbTickets = dbTickets.map(ticket => ({
              ...ticket,
              events: Array.isArray(ticket.events) ? ticket.events[0] : ticket.events
            }));
            allTickets = [...allTickets, ...transformedDbTickets];
            console.log('Added database tickets:', transformedDbTickets);
          }
        }

        // Always check for localStorage tickets (for free events)
        const localTicketsStr = localStorage.getItem('freeTickets');
        if (localTicketsStr) {
          try {
            const localTickets = JSON.parse(localTicketsStr);
            console.log('Found local tickets:', localTickets);
            allTickets = [...allTickets, ...localTickets];
          } catch (parseError) {
            console.error('Error parsing localStorage tickets:', parseError);
          }
        }

        console.log('Final all tickets:', allTickets);
        setTickets(allTickets);

      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        setError(`Failed to fetch tickets: ${fetchError}`);
      } finally {
        setLoading(false);
        console.log('=== TICKET FETCH END ===');
      }
    };
    
    fetchTickets();
  }, [connected, publicKey]);

  // Helper function to determine if an event is upcoming or past
  const isUpcomingEvent = (eventDate: string) => {
    const now = new Date();
    const eventDateTime = new Date(eventDate);
    return eventDateTime > now;
  };

  // Filter tickets by event date
  const upcomingTickets = tickets.filter(ticket => 
    ticket.events?.date ? isUpcomingEvent(ticket.events.date) : true
  );
  
  const pastTickets = tickets.filter(ticket => 
    ticket.events?.date ? !isUpcomingEvent(ticket.events.date) : false
  );

  console.log('FILTERED - Upcoming:', upcomingTickets.length, upcomingTickets);
  console.log('FILTERED - Past:', pastTickets.length, pastTickets);

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

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 bg-red-900/20 rounded-lg border border-red-500/20">
            <h3 className="text-xl font-medium mb-2 text-red-400">Error Loading Tickets</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
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
        
        {/* Debug info - remove in production */}
        <div className="mb-4 p-4 bg-gray-800 rounded text-sm">
          <p>Connected: {connected ? 'Yes' : 'No'}</p>
          <p>Wallet: {publicKey?.toString() || 'None'}</p>
          <p>Total Tickets: {tickets.length}</p>
          <p>Upcoming: {upcomingTickets.length}</p>
          <p>Past: {pastTickets.length}</p>
        </div>
        
        {!connected ? (
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
                <h3 className="text-xl font-semibold mb-4">Free Tickets ({tickets.length})</h3>
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
