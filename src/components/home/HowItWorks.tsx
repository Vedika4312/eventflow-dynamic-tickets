
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Ticket, QrCode, Wallet, Calendar } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Wallet className="h-10 w-10 text-blocktix-purple" />,
      title: 'Connect Your Wallet',
      description: 'Link your Solana wallet (Phantom, Solflare, or Backpack) to buy and manage your NFT tickets securely.'
    },
    {
      icon: <Ticket className="h-10 w-10 text-blocktix-purple" />,
      title: 'Purchase NFT Tickets',
      description: 'Browse events and purchase tickets that are minted as NFTs directly to your wallet.'
    },
    {
      icon: <QrCode className="h-10 w-10 text-blocktix-purple" />,
      title: 'Attend the Event',
      description: 'Present your NFT ticket via QR code for seamless entry. Your ticket evolves after attendance.'
    },
    {
      icon: <Calendar className="h-10 w-10 text-blocktix-purple" />,
      title: 'Collect and Earn',
      description: 'Keep your ticket NFTs as collectibles and unlock special perks from event organizers.'
    }
  ];

  return (
    <div className="bg-blocktix-dark py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How BlockTix Works</h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            BlockTix revolutionizes event ticketing with dynamic NFTs on the Solana blockchain,
            creating a seamless experience from purchase to post-event collectible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="border border-white/10 bg-black/20 hover:shadow-md hover:shadow-blocktix-purple/20 transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-blocktix-dark p-4 mb-4">
                  {step.icon}
                </div>
                <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
