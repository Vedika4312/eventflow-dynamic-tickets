
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL 
} from "@solana/web3.js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

export const useTicketPurchase = (eventId: string) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  
  const purchaseTicket = async (
    event: any, 
    quantity: number = 1, 
    ticketClass: 'general' | 'vip' | 'platinum' = 'general'
  ) => {
    if (!publicKey || !sendTransaction) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to purchase tickets"
      });
      return false;
    }

    setIsProcessing(true);

    try {
      // Get organizer wallet address
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('organizer_wallet, price, currency')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      // Calculate total price based on quantity and ticket class
      let priceMultiplier = 1;
      switch (ticketClass) {
        case 'vip':
          priceMultiplier = 2.5;
          break;
        case 'platinum':
          priceMultiplier = 5;
          break;
        default:
          priceMultiplier = 1;
      }

      const totalPrice = eventData.price * quantity * priceMultiplier;

      // For SOL transactions
      if (eventData.currency === 'SOL') {
        const connection = new Connection(
          clusterApiUrl(WalletAdapterNetwork.Devnet), 
          'confirmed'
        );

        // Convert price to lamports (SOL's smallest unit)
        const lamports = totalPrice * LAMPORTS_PER_SOL;
        
        // Create transaction
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(eventData.organizer_wallet),
            lamports,
          })
        );

        // Send transaction
        const signature = await sendTransaction(transaction, connection);
        
        // Wait for confirmation
        const confirmation = await connection.confirmTransaction(signature, 'confirmed');
        
        if (confirmation.value.err) {
          throw new Error("Transaction failed to confirm");
        }

        // Generate ticket records
        const tickets = [];
        for (let i = 0; i < quantity; i++) {
          const ticketId = uuidv4();
          const qrCode = `https://blocktix-qr.vercel.app/ticket/${ticketId}`;
          
          tickets.push({
            id: ticketId,
            event_id: eventId,
            owner_wallet: publicKey.toString(),
            purchase_price: eventData.price * priceMultiplier,
            purchase_currency: eventData.currency,
            token_id: `SOL-TICKET-${ticketId.substring(0, 8)}`,
            ticket_class: ticketClass.toUpperCase(),
            qr_code: qrCode
          });
        }

        // Insert tickets to database
        const { error: ticketError } = await supabase
          .from('tickets')
          .insert(tickets);

        if (ticketError) throw ticketError;
        
        // Update event sold tickets count
        await supabase
          .from('events')
          .update({ sold_tickets: event.sold_tickets + quantity })
          .eq('id', eventId);

        // Record the purchase interaction
        await supabase
          .from('user_events')
          .insert({
            user_wallet: publicKey.toString(),
            event_id: eventId,
            interaction_type: 'purchased'
          });
        
        toast.success("Purchase successful!", {
          description: `You have purchased ${quantity} ${ticketClass} ticket${quantity > 1 ? 's' : ''}`
        });
        
        setIsProcessing(false);
        return true;
      } else {
        // For other currencies like USDC
        // Implement similar logic for other currency types
        toast.error("Currency not supported yet", {
          description: `${eventData.currency} transactions are not yet supported`
        });
        setIsProcessing(false);
        return false;
      }
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      toast.error("Purchase failed", {
        description: "There was a problem processing your purchase. Please try again."
      });
      setIsProcessing(false);
      return false;
    }
  };

  return { purchaseTicket, isProcessing };
};
