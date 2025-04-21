
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Ticket, QrCode, Check, Clock, Calendar, Users, MapPin } from 'lucide-react';

interface DynamicTicketProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  ticketClass: 'general' | 'vip' | 'platinum';
  status: 'upcoming' | 'active' | 'used' | 'expired';
  tokenId: string;
  qrCode: string;
}

const DynamicTicket: React.FC<DynamicTicketProps> = ({
  eventTitle,
  eventDate,
  eventLocation,
  ticketClass,
  status,
  tokenId,
  qrCode
}) => {
  const [animateState, setAnimateState] = useState(false);
  
  // Simulate the dynamic NFT evolving over time
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateState(prev => !prev);
    }, 10000); // Change state every 10 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const getTicketColorClass = () => {
    switch (ticketClass) {
      case 'vip':
        return 'from-blocktix-purple to-blocktix-magenta';
      case 'platinum':
        return 'from-blue-500 to-indigo-600';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };
  
  const getStatusInfo = () => {
    switch (status) {
      case 'upcoming':
        return { 
          icon: <Clock className="h-5 w-5 mr-2 text-yellow-500" />, 
          text: 'Upcoming', 
          color: 'text-yellow-500'
        };
      case 'active':
        return { 
          icon: <Check className="h-5 w-5 mr-2 text-green-500" />, 
          text: 'Active', 
          color: 'text-green-500'
        };
      case 'used':
        return { 
          icon: <Check className="h-5 w-5 mr-2 text-gray-500" />, 
          text: 'Used', 
          color: 'text-gray-500'
        };
      case 'expired':
        return { 
          icon: <Clock className="h-5 w-5 mr-2 text-red-500" />, 
          text: 'Expired', 
          color: 'text-red-500'
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  return (
    <div className="ticket-container">
      <div className={`ticket-inner ${animateState ? 'animate-ticket-flip' : ''}`}>
        <div className="ticket-front">
          <Card className={`border-0 overflow-hidden neon-glow h-full`}>
            <div className={`bg-gradient-to-br ${getTicketColorClass()} px-6 py-4`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Ticket className="h-6 w-6 mr-2 text-white" />
                  <h3 className="text-lg font-bold text-white">{ticketClass.toUpperCase()} TICKET</h3>
                </div>
                <div className="flex items-center bg-black/30 rounded-full px-3 py-1">
                  {statusInfo.icon}
                  <span className={`text-sm font-medium ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6 bg-black/90 flex flex-col h-full">
              <h2 className="text-xl font-bold text-white mb-1">{eventTitle}</h2>
              
              <div className="flex items-center text-sm text-gray-300 mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(eventDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              
              <div className="flex items-center text-sm text-gray-300 mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                {eventLocation}
              </div>
              
              <div className="grow flex items-center justify-center py-4">
                <div className="bg-white p-3 rounded">
                  <img src={qrCode} alt="QR Code" className="w-32 h-32" />
                </div>
              </div>
              
              <div className="text-xs text-gray-400 text-center mt-4">
                <p>Token ID: {tokenId}</p>
                <p>Tap to view details</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="ticket-back">
          <Card className={`border-0 overflow-hidden h-full`}>
            <CardContent className="p-6 bg-gradient-dark h-full flex flex-col">
              <h2 className="text-lg font-bold text-white mb-4">Ticket Benefits</h2>
              
              <ul className="text-sm text-gray-300 space-y-2 mb-6">
                {ticketClass === 'vip' && (
                  <>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-0.5 text-blocktix-purple" />
                      <span>Priority venue entry</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-0.5 text-blocktix-purple" />
                      <span>Exclusive NFT collectible</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-0.5 text-blocktix-purple" />
                      <span>VIP lounge access</span>
                    </li>
                  </>
                )}
                
                {ticketClass === 'platinum' && (
                  <>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                      <span>All VIP benefits</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                      <span>Meet &amp; greet with artists</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                      <span>Limited edition merchandise</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                      <span>On-stage photo opportunity</span>
                    </li>
                  </>
                )}
                
                {ticketClass === 'general' && (
                  <>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                      <span>General admission</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                      <span>Digital event program</span>
                    </li>
                  </>
                )}
              </ul>
              
              <div className="mt-auto">
                <div className="bg-black/30 p-4 rounded">
                  <h3 className="text-sm font-bold text-white mb-2">NFT Utilities</h3>
                  <p className="text-xs text-gray-400">
                    This NFT ticket will transform into a collectible after the event. Hold it to unlock future benefits and airdrops.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DynamicTicket;
