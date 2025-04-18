import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { mockEvents } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const fetchEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.length > 0 ? data : mockEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    toast.error('Failed to load events', {
      description: 'Please try again later'
    });
    return mockEvents;
  }
};

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const { 
    data: events = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    retry: 1
  });

  const categories = Array.from(new Set(events.map(event => event.category)));
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? event.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Events</h1>
            <p className="text-gray-400">Discover events and secure your NFT tickets</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button className="bg-gradient-purple hover:opacity-90" asChild>
              <Link to="/create">Create Event</Link>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-3/4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events, venues, locations..." 
                className="w-full pl-10 pr-4 py-2 bg-blocktix-dark/50 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-blocktix-purple focus:border-blocktix-purple"
              />
            </div>
          </div>
          
          <div className="md:w-1/4">
            <div className="bg-blocktix-dark/50 border border-white/10 rounded-md p-4">
              <div className="flex items-center mb-4">
                <Filter className="h-4 w-4 mr-2" />
                <h3 className="font-medium">Filter Events</h3>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Categories</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Button 
                      variant={selectedCategory === null ? "default" : "outline"}
                      size="sm"
                      className={selectedCategory === null ? "bg-blocktix-purple" : "text-white border-white/20"}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All
                    </Button>
                  </div>
                  
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <Button 
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        className={selectedCategory === category ? "bg-blocktix-purple" : "text-white border-white/20"}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="border border-white/10 bg-blocktix-dark/50 overflow-hidden">
                <div className="h-48 bg-gray-800 animate-pulse"></div>
                <CardContent className="p-5">
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-4/5 mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-4 animate-pulse"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-700 rounded w-1/3 animate-pulse"></div>
                    <div className="h-8 bg-gray-700 rounded w-1/3 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load events. Please try again later.</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card 
                key={event.id} 
                className="border border-white/10 bg-blocktix-dark/50 overflow-hidden hover:shadow-lg hover:shadow-blocktix-purple/20 transition-all duration-300"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={event.image_url || event.image}
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
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })} • {event.time || '19:00'}
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventsPage;
