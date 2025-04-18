
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useWalletIntegration = () => {
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    const setupWallet = async () => {
      if (connected && publicKey) {
        const walletAddress = publicKey.toString();
        
        // Set the current wallet in Supabase context
        await supabase.rpc('set_current_wallet', {
          wallet: walletAddress
        });
        
        console.log('Wallet connected and set in Supabase:', walletAddress);
      }
    };

    setupWallet();
  }, [connected, publicKey]);

  return { publicKey, connected };
};
