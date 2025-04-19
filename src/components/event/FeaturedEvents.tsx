
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useEventSubscription } from '@/hooks/useEventSubscription';

const fetchFeaturedEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }
};

const FeaturedEvents = () => {
  // Use the real-time subscription hook
  useEventSubscription();

  const { data: events = [] } = useQuery({
    queryKey: ['events', 'featured'],
    queryFn: fetchFeaturedEvents,
  });

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">Featured Events</h2>
          <p className="text-gray-400">Discover the hottest events on BlockTix</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="border border-white/10 bg-blocktix-dark/50 overflow-hidden hover:shadow-lg hover:shadow-blocktix-purple/20 transition-all duration-300">
              <div className="h-48 overflow-hidden relative">
                <img
                  src={event.image_url || 'https://source.unsplash.com/random/400x300/?event'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-blocktix-purple/80 text-white text-xs px-2 py-1 rounded-full">
                  {event.category}
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-bold text-xl mb-2 line-clamp-1">{event.title}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDateTime(event.date)}
                </div>
                
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    <span className="text-blocktix-purple">{event.price} {event.currency}</span>
                  </div>
                  <Button size="sm" className="bg-gradient-purple hover:opacity-90" asChild>
                    <Link to={`/events/${event.id}`}>View Event</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button variant="outline" className="border-blocktix-purple text-blocktix-purple hover:bg-blocktix-purple/10" asChild>
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvents;
