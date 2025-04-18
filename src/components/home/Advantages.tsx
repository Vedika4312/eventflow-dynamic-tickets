
import React from 'react';
import { Shield, RefreshCw, Users, Sparkles, DollarSign, Clock } from 'lucide-react';

const Advantages = () => {
  const advantages = [
    {
      icon: <Shield className="h-8 w-8 mb-4 text-blocktix-purple" />,
      title: 'Fraud Prevention',
      description: 'Blockchain verification eliminates counterfeit tickets and unauthorized resales.'
    },
    {
      icon: <RefreshCw className="h-8 w-8 mb-4 text-blocktix-purple" />,
      title: 'Dynamic NFT Tickets',
      description: 'Tickets that evolve before, during, and after events, becoming digital collectibles.'
    },
    {
      icon: <Users className="h-8 w-8 mb-4 text-blocktix-purple" />,
      title: 'Community Rewards',
      description: 'Loyalty systems that reward frequent attendees with airdrops and exclusive access.'
    },
    {
      icon: <Sparkles className="h-8 w-8 mb-4 text-blocktix-purple" />,
      title: 'Enhanced Experiences',
      description: 'Unlock special perks like backstage passes or exclusive content through NFT ownership.'
    },
    {
      icon: <DollarSign className="h-8 w-8 mb-4 text-blocktix-purple" />,
      title: 'Fair Revenue Sharing',
      description: 'Artists and organizers earn royalties from primary sales and secondary market resales.'
    },
    {
      icon: <Clock className="h-8 w-8 mb-4 text-blocktix-purple" />,
      title: 'Instant Settlement',
      description: 'Fast transactions and immediate ticket delivery with Solana\'s quick finality.'
    }
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose BlockTix</h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            Experience the advantages of blockchain-powered event ticketing with features
            that benefit both attendees and organizers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((item, index) => (
            <div key={index} className="p-6 rounded-lg border border-white/10 bg-blocktix-dark/50 hover:shadow-lg hover:shadow-blocktix-purple/10 transition-all">
              {item.icon}
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Advantages;
