
import { useState } from "react";
import { toast } from "sonner";
import {
  ensureMonadConnection,
  sendMonadTransaction,
} from "@/integrations/monad/client";

export const useMonadPayment = () => {
  const [isMonadConnected, setIsMonadConnected] = useState(false);
  const [monadAddress, setMonadAddress] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Check if already connected to Monad and ensure correct network
  const checkMonadConnection = async () => {
    try {
      const address = await ensureMonadConnection();
      if (address) {
        setMonadAddress(address);
        setIsMonadConnected(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking Monad connection:", error);
      return false;
    }
  };

  // Process payment with Monad
  const processMonadPayment = async (
    recipientAddress: string,
    amount: number
  ): Promise<boolean> => {
    setIsProcessingPayment(true);

    try {
      const connected = await checkMonadConnection();
      if (!connected) {
        toast.error("Monad wallet not connected", {
          description: "Please ensure MetaMask is installed and connected to Monad network",
        });
        setIsProcessingPayment(false);
        return false;
      }

      const txHash = await sendMonadTransaction(recipientAddress, amount);
      
      if (txHash) {
        toast.success("Payment successful", {
          description: `Transaction hash: ${txHash.substring(0, 10)}...`,
        });
        setIsProcessingPayment(false);
        return true;
      } else {
        toast.error("Payment failed", {
          description: "Transaction was rejected or failed",
        });
        setIsProcessingPayment(false);
        return false;
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Payment processing error", {
        description: "Please try again or use a different payment method",
      });
      setIsProcessingPayment(false);
      return false;
    }
  };

  return {
    isMonadConnected,
    monadAddress,
    checkMonadConnection,
    processMonadPayment,
    isProcessingPayment,
  };
};
