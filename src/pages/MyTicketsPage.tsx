
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import DynamicTicket from '@/components/ticket/DynamicTicket';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockTickets, mockEvents } from '@/data/mockData';

const MyTicketsPage = () => {
  const upcomingTickets = mockTickets.filter(ticket => ticket.status === 'upcoming');
  const usedTickets = mockTickets.filter(ticket => ticket.status === 'used' || ticket.status === 'expired');
  
  const getEventDetails = (eventId: string) => {
    return mockEvents.find(event => event.id === eventId);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
        <p className="text-gray-400 mb-8">Manage your NFT tickets and collectibles</p>
        
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {upcomingTickets.map((ticket) => {
                  const event = getEventDetails(ticket.eventId);
                  return event ? (
                    <div key={ticket.id} className="h-[400px]">
                      <DynamicTicket
                        eventTitle={event.title}
                        eventDate={event.date}
                        eventLocation={event.location}
                        ticketClass={ticket.ticketClass}
                        status={ticket.status}
                        tokenId={ticket.tokenId}
                        qrCode={ticket.qrCode}
                      />
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-blocktix-dark/50 rounded-lg border border-white/10">
                <h3 className="text-xl font-medium mb-2">No upcoming events</h3>
                <p className="text-gray-400">You don't have any upcoming event tickets</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {usedTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {usedTickets.map((ticket) => {
                  const event = getEventDetails(ticket.eventId);
                  return event ? (
                    <div key={ticket.id} className="h-[400px]">
                      <DynamicTicket
                        eventTitle={event.title}
                        eventDate={event.date}
                        eventLocation={event.location}
                        ticketClass={ticket.ticketClass}
                        status={ticket.status}
                        tokenId={ticket.tokenId}
                        qrCode={ticket.qrCode}
                      />
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-blocktix-dark/50 rounded-lg border border-white/10">
                <h3 className="text-xl font-medium mb-2">No past events</h3>
                <p className="text-gray-400">You haven't attended any events yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyTicketsPage;
