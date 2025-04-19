
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEventSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'events'
        },
        async (payload) => {
          // Invalidate and refetch events queries
          await queryClient.invalidateQueries({ queryKey: ['events'] });
          
          // Show a toast notification for new events
          if (payload.eventType === 'INSERT') {
            toast.success('New event created!', {
              description: `"${payload.new.title}" has been added`
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
