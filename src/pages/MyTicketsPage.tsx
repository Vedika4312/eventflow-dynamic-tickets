
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
  event?: {
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
      if (!publicKey) {
        setTickets([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('tickets')
          .select(`
            *,
            event:event_id (
              title, 
              date, 
              location
            )
          `)
          .eq('owner_wallet', publicKey.toString());
          
        if (error) throw error;
        
        if (data) {
          setTickets(data);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, [publicKey]);

  // Filter tickets by status
  const upcomingTickets = tickets.filter(ticket => ticket.status === 'upcoming');
  const usedTickets = tickets.filter(ticket => ticket.status === 'used' || ticket.status === 'expired');

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
          <div className="text-center py-12 bg-blocktix-dark/50 rounded-lg border border-white/10">
            <h3 className="text-xl font-medium mb-4">Wallet Not Connected</h3>
            <p className="text-gray-400 mb-6">Please connect your wallet to view your tickets</p>
            <Button variant="default" className="bg-gradient-purple hover:opacity-90">
              Connect Wallet
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {upcomingTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {upcomingTickets.map((ticket) => (
                    <div key={ticket.id} className="h-[400px]">
                      <DynamicTicket
                        eventTitle={ticket.event?.title || "Untitled Event"}
                        eventDate={ticket.event?.date || new Date().toISOString()}
                        eventLocation={ticket.event?.location || "Location Unknown"}
                        ticketClass={(ticket.ticket_class.toLowerCase() as "general" | "vip" | "platinum") || "general"}
                        status={(ticket.status as "upcoming" | "active" | "used" | "expired")}
                        tokenId={ticket.token_id}
                        qrCode={ticket.qr_code || undefined}
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
              {usedTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {usedTickets.map((ticket) => (
                    <div key={ticket.id} className="h-[400px]">
                      <DynamicTicket
                        eventTitle={ticket.event?.title || "Untitled Event"}
                        eventDate={ticket.event?.date || new Date().toISOString()}
                        eventLocation={ticket.event?.location || "Location Unknown"}
                        ticketClass={(ticket.ticket_class.toLowerCase() as "general" | "vip" | "platinum") || "general"}
                        status={(ticket.status as "upcoming" | "active" | "used" | "expired")}
                        tokenId={ticket.token_id}
                        qrCode={ticket.qr_code || undefined}
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
