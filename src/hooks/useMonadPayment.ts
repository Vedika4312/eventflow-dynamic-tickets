
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  connectToMonad,
  sendMonadTransaction,
  addMonadNetworkToMetaMask,
} from "@/integrations/monad/client";

export const useMonadPayment = () => {
  const [isMonadConnected, setIsMonadConnected] = useState(false);
  const [monadAddress, setMonadAddress] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Check if already connected to Monad
  useEffect(() => {
    const checkMonadConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        try {
          // Check if the current chain is Monad
          const chainId = await window.ethereum.request({ method: "eth_chainId" });
          if (chainId === "0x796") { // 0x796 is hex for 1942 (Monad Testnet)
            setIsMonadConnected(true);
            setMonadAddress(window.ethereum.selectedAddress);
          }
        } catch (error) {
          console.error("Error checking Monad connection:", error);
        }
      }
    };

    checkMonadConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setMonadAddress(accounts[0]);
          setIsMonadConnected(true);
        } else {
          setMonadAddress(null);
          setIsMonadConnected(false);
        }
      };

      const handleChainChanged = (_chainId: string) => {
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  // Connect to Monad wallet
  const connectMonadWallet = async () => {
    try {
      const address = await connectToMonad();
      if (address) {
        setMonadAddress(address);
        setIsMonadConnected(true);
        toast.success("Connected to Monad wallet", {
          description: `Address: ${address.substring(0, 6)}...${address.substring(
            address.length - 4
          )}`
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error connecting to Monad wallet:", error);
      toast.error("Failed to connect to Monad wallet", {
        description: "Please make sure MetaMask is installed and try again"
      });
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
      if (!isMonadConnected) {
        const connected = await connectMonadWallet();
        if (!connected) {
          setIsProcessingPayment(false);
          return false;
        }
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
    connectMonadWallet,
    processMonadPayment,
    isProcessingPayment,
    addMonadNetworkToMetaMask,
  };
};
