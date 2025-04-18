
import { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEventInteraction = (eventId: string) => {
  const { publicKey } = useWallet();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkInteraction = async () => {
      if (!publicKey) {
        setIsChecking(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_events')
          .select('id')
          .eq('user_wallet', publicKey.toString())
          .eq('event_id', eventId)
          .eq('interaction_type', 'favorite')
          .limit(1);
          
        if (error) throw error;
        
        setIsFavorite(data && data.length > 0);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkInteraction();
  }, [publicKey, eventId]);
  
  const toggleFavorite = async () => {
    if (!publicKey) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to save favorites"
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_events')
          .delete()
          .eq('user_wallet', publicKey.toString())
          .eq('event_id', eventId)
          .eq('interaction_type', 'favorite');
          
        if (error) throw error;
        
        setIsFavorite(false);
        toast("Removed from favorites");
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_events')
          .insert({
            user_wallet: publicKey.toString(),
            event_id: eventId,
            interaction_type: 'favorite'
          });
          
        if (error) throw error;
        
        setIsFavorite(true);
        toast("Added to favorites");
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error("Action failed", {
        description: "Unable to update favorites. Please try again."
      });
      setIsLoading(false);
      return false;
    }
  };
  
  return { 
    isFavorite, 
    isChecking, 
    isLoading, 
    toggleFavorite 
  };
};
