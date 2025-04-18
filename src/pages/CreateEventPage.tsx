
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Upload, TicketIcon, CurrencyIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const CreateEventPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    price: '',
    currency: 'SOL',
    totalTickets: '',
    royaltyPercentage: '5',
    resellable: true
  });
  
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate blockchain interaction
    toast({
      title: "Processing event creation",
      description: "Connecting to blockchain...",
    });
    
    // After simulated delay
    setTimeout(() => {
      toast({
        title: "Event created successfully",
        description: "Your event has been created and tickets are ready to be minted.",
      });
    }, 2000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Create Event</h1>
        <p className="text-gray-400 mb-8">Set up your event and mint NFT tickets on the blockchain</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="title">
                  Event Title
                </label>
                <Input 
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  className="bg-blocktix-dark/50 border-white/10"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="description">
                  Event Description
                </label>
                <Textarea 
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event"
                  className="bg-blocktix-dark/50 border-white/10 resize-none min-h-[150px]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="date">
                    Event Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="bg-blocktix-dark/50 border-white/10 pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="time">
                    Event Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="bg-blocktix-dark/50 border-white/10 pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="location">
                  Event Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                    className="bg-blocktix-dark/50 border-white/10 pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="category">
                  Event Category
                </label>
                <Select name="category" onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger className="bg-blocktix-dark/50 border-white/10">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="price">
                    Ticket Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">Ⓢ</span>
                    <Input 
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="bg-blocktix-dark/50 border-white/10 pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="currency">
                    Currency
                  </label>
                  <Select name="currency" defaultValue="SOL" onValueChange={(value) => handleSelectChange('currency', value)}>
                    <SelectTrigger className="bg-blocktix-dark/50 border-white/10">
                      <SelectValue placeholder="SOL" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOL">SOL</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="totalTickets">
                    Total Tickets
                  </label>
                  <div className="relative">
                    <TicketIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="totalTickets"
                      name="totalTickets"
                      type="number"
                      min="1"
                      value={formData.totalTickets}
                      onChange={handleInputChange}
                      placeholder="100"
                      className="bg-blocktix-dark/50 border-white/10 pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="royaltyPercentage">
                    Resale Royalty %
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                    <Input 
                      id="royaltyPercentage"
                      name="royaltyPercentage"
                      type="number"
                      min="0"
                      max="15"
                      value={formData.royaltyPercentage}
                      onChange={handleInputChange}
                      placeholder="5"
                      className="bg-blocktix-dark/50 border-white/10 pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="resellable">
                    Allow Reselling
                  </label>
                  <Select name="resellable" defaultValue="true" onValueChange={(value) => handleSelectChange('resellable', value)}>
                    <SelectTrigger className="bg-blocktix-dark/50 border-white/10">
                      <SelectValue placeholder="Yes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="w-full bg-gradient-purple hover:opacity-90" size="lg">
                  Create Event & Mint Tickets
                </Button>
              </div>
            </form>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="border border-white/10 bg-blocktix-dark/50 sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Event Assets</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Event Cover Image
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400 text-center mb-2">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      Recommended: 1200 x 630px
                    </p>
                    <Button variant="outline" size="sm" className="mt-4 border-white/20">
                      Upload Image
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    NFT Ticket Design
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400 text-center mb-2">
                      Upload ticket artwork
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      This will be used for the NFT ticket design
                    </p>
                    <Button variant="outline" size="sm" className="mt-4 border-white/20">
                      Upload Design
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 bg-black/30 p-4 rounded">
                  <h3 className="text-sm font-bold text-white mb-2">NFT Metadata</h3>
                  <p className="text-xs text-gray-400">
                    Your tickets will be minted as dynamic NFTs on Solana blockchain 
                    using the Metaplex Token Metadata standard, allowing them to evolve 
                    before, during, and after the event.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEventPage;
