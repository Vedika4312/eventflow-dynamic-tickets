
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export const useEventCreation = () => {
  const [loading, setLoading] = useState(false);
  const { publicKey } = useWallet();
  const navigate = useNavigate();

  const createEvent = async (eventData: any, coverImage: File | null, ticketDesign: File | null) => {
    if (!publicKey) {
      toast.error("Wallet connection required", {
        description: "Please connect your wallet to create an event"
      });
      return false;
    }

    setLoading(true);
    const eventId = uuidv4();
    let coverImageUrl = null;
    let ticketDesignUrl = null;

    try {
      // Upload cover image if provided
      if (coverImage) {
        const fileExt = coverImage.name.split('.').pop();
        const filePath = `event-covers/${eventId}.${fileExt}`;
        
        const { data: imageData, error: imageError } = await supabase.storage
          .from('events')
          .upload(filePath, coverImage, {
            cacheControl: '3600',
            upsert: true
          });

        if (imageError) throw imageError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('events')
          .getPublicUrl(filePath);
          
        coverImageUrl = publicUrl;
      }

      // Upload ticket design if provided
      if (ticketDesign) {
        const fileExt = ticketDesign.name.split('.').pop();
        const filePath = `ticket-designs/${eventId}.${fileExt}`;
        
        const { data: designData, error: designError } = await supabase.storage
          .from('events')
          .upload(filePath, ticketDesign, {
            cacheControl: '3600',
            upsert: true
          });

        if (designError) throw designError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('events')
          .getPublicUrl(filePath);
          
        ticketDesignUrl = publicUrl;
      }

      // Insert event into database
      const { data, error } = await supabase
        .from('events')
        .insert({
          id: eventId,
          title: eventData.title,
          description: eventData.description,
          date: new Date(eventData.date + 'T' + eventData.time).toISOString(),
          location: eventData.location,
          category: eventData.category,
          price: parseFloat(eventData.price),
          currency: eventData.currency,
          total_tickets: parseInt(eventData.totalTickets),
          sold_tickets: 0,
          image_url: coverImageUrl,
          organizer_wallet: publicKey.toString()
        })
        .select();

      if (error) throw error;

      // Add user interaction record
      await supabase
        .from('user_events')
        .insert({
          user_wallet: publicKey.toString(),
          event_id: eventId,
          interaction_type: 'created'
        });

      toast.success("Event created successfully!", {
        description: "Your event is now live on BlockTix"
      });
      
      setLoading(false);
      navigate(`/events/${eventId}`);
      return true;
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event", {
        description: "There was a problem creating your event. Please try again."
      });
      setLoading(false);
      return false;
    }
  };

  return { createEvent, loading };
};
