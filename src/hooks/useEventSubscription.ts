
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
          console.log('Realtime event received:', payload);
          
          // Invalidate and refetch all event queries
          await queryClient.invalidateQueries({ queryKey: ['events'] });
          
          // Show a toast notification for new events
          if (payload.eventType === 'INSERT') {
            toast.success('New event created!', {
              description: `"${payload.new.title}" has been added`
            });
          } else if (payload.eventType === 'UPDATE') {
            toast.info('Event updated', {
              description: `"${payload.new.title}" has been updated`
            });
          } else if (payload.eventType === 'DELETE') {
            toast.info('Event removed', {
              description: 'An event has been removed'
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Supabase realtime subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to events table changes');
        }
      });

    return () => {
      console.log('Cleaning up Supabase realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
