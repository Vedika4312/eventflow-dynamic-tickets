
import { useEffect, useState } from 'react';
import { useWalletIntegration } from './useWallet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdmin = () => {
  const { publicKey } = useWalletIntegration();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!publicKey) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('is_admin', { wallet_address: publicKey.toString() });

        if (error) throw error;
        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [publicKey]);

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      
      toast.success('Event deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      return false;
    }
  };

  return { isAdmin, deleteEvent };
};
