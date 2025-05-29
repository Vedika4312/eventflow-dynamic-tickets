
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
          console.log('Setting up wallet:', walletAddress);
          
          // Set the current wallet in Supabase context
          const { error: rpcError } = await supabase.rpc('set_current_wallet', {
            wallet: walletAddress
          });
          
          if (rpcError) {
            console.warn('RPC call failed, continuing without it:', rpcError);
          }
          
          // Check if this wallet has interacted before
          const { data: existingEvents, error: queryError } = await supabase
            .from('user_events')
            .select('id')
            .eq('user_wallet', walletAddress)
            .limit(1);
          
          if (queryError) {
            console.warn('Query failed:', queryError);
          }
          
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
          
          console.log('Wallet connected successfully:', walletAddress);
        } catch (error) {
          console.error('Error setting up wallet:', error);
          toast.error("Connection issue", {
            description: "Your wallet is connected but there was a problem with our services."
          });
        } finally {
          setIsRegistering(false);
        }
      } else if (!connected && !connecting) {
        setIsRegistering(false);
      }
    };

    setupWallet();
  }, [connected, publicKey, connecting]);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.info("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Error disconnecting wallet");
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
