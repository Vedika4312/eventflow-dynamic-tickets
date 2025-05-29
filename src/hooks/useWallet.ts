
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

export const useWalletIntegration = () => {
  const { publicKey, connected, connecting, disconnect } = useWallet();
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const setupWallet = async () => {
      if (connected && publicKey) {
        const walletAddress = publicKey.toString();
        setIsRegistering(true);
        
        try {
          // Set the current wallet in Supabase context
          await supabase.rpc('set_current_wallet', {
            wallet: walletAddress
          });
          
          // Check if this wallet has interacted before
          const { data: existingEvents } = await supabase
            .from('user_events')
            .select('id')
            .eq('user_wallet', walletAddress)
            .limit(1);
          
          if (!existingEvents || existingEvents.length === 0) {
            // First-time user
            toast.success("Welcome to BlockTix!", {
              description: "Your wallet is now connected. Start exploring events or create your own!"
            });
          } else {
            // Returning user
            toast.success("Wallet connected", {
              description: "Welcome back to BlockTix!"
            });
          }
          
          console.log('Wallet connected and set in Supabase:', walletAddress);
        } catch (error) {
          console.error('Error setting wallet in Supabase:', error);
          toast.error("Connection issue", {
            description: "There was a problem connecting your wallet to our services."
          });
        } finally {
          setIsRegistering(false);
        }
      }
    };

    setupWallet();
  }, [connected, publicKey]);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.info("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return { 
    publicKey, 
    connected, 
    connecting, 
    isRegistering,
    disconnect: handleDisconnect
  };
};
