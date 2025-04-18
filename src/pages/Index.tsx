
import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import FeaturedEvents from '@/components/event/FeaturedEvents';
import HowItWorks from '@/components/home/HowItWorks';
import Advantages from '@/components/home/Advantages';
import DynamicTicket from '@/components/ticket/DynamicTicket';
import { mockEvents, mockTickets } from '@/data/mockData';

const Index = () => {
  // Sample ticket for demonstration
  const demoEvent = mockEvents[0];
  const demoTicket = mockTickets[0];

  return (
    <Layout>
      <Hero />
      <FeaturedEvents />
      <HowItWorks />
      
      <div className="bg-gradient-dark py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Dynamic NFT Tickets</h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              Each ticket is a unique digital asset that transforms throughout the event lifecycle.
              Hover over or tap the ticket to see it in action.
            </p>
          </div>
          
          <div className="max-w-xs mx-auto">
            <DynamicTicket
              eventTitle={demoEvent.title}
              eventDate={demoEvent.date}
              eventLocation={demoEvent.location}
              ticketClass="vip"
              status="upcoming"
              tokenId={demoTicket.tokenId}
              qrCode={demoTicket.qrCode}
            />
          </div>
        </div>
      </div>
      
      <Advantages />
    </Layout>
  );
};

export default Index;
