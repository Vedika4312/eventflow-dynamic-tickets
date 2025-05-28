
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  TransactionMessage,
  VersionedTransaction 
} from "@solana/web3.js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { useMonadPayment } from "./useMonadPayment";

export const useTicketPurchase = (eventId: string) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const { processMonadPayment } = useMonadPayment();
  
  const purchaseTicket = async (
    event: any, 
    quantity: number = 1, 
    ticketClass: 'general' | 'vip' | 'platinum' = 'general',
    paymentMethod: 'SOL' | 'TOKEN' | 'MONAD' = 'SOL'
  ) => {
    // For free events, don't require wallet connection for non-blockchain payments
    const isFreeEvent = event.price === 0 || event.price === '0';
    
    if (!publicKey && !isFreeEvent) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to purchase tickets"
      });
      return false;
    }

    setIsProcessing(true);

    try {
      // Check if eventId is a valid UUID
      let isValidUuid = true;
      try {
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        isValidUuid = uuidPattern.test(eventId);
      } catch(err) {
        isValidUuid = false;
      }

      let eventData;
      
      if (isValidUuid) {
        // Get data from Supabase for real events
        const { data: supabaseEventData, error: eventError } = await supabase
          .from('events')
          .select('organizer_wallet, price, currency')
          .eq('id', eventId)
          .single();

        if (eventError) throw eventError;
        eventData = supabaseEventData;
      } else {
        // For mock events or non-UUID IDs
        eventData = {
          organizer_wallet: event.organizer_wallet || "8YUNPvWkKvTajZGEVSmGzh1mTKXzFLCwvKrYLZQ5iT1H",
          price: event.price,
          currency: event.currency || "SOL"
        };
      }

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
      const isFree = totalPrice === 0;

      // Handle payment based on selected method
      let paymentSuccess = false;
      
      if (isFree) {
        // For free events, no payment processing needed
        paymentSuccess = true;
        toast.success("Free ticket claimed!", {
          description: `You have successfully claimed ${quantity} free ticket${quantity > 1 ? 's' : ''}`
        });
      } else if (paymentMethod === 'SOL') {
        // For SOL transactions (existing code)
        if (!publicKey) {
          toast.error("Wallet not connected", {
            description: "Please connect your wallet to purchase paid tickets"
          });
          setIsProcessing(false);
          return false;
        }

        const connection = new Connection(
          clusterApiUrl(WalletAdapterNetwork.Devnet), 
          'confirmed'
        );

        // Convert price to lamports (SOL's smallest unit)
        const lamports = totalPrice * LAMPORTS_PER_SOL;
        
        // Get latest blockhash
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

        // Create instruction
        const transferInstruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(eventData.organizer_wallet),
          lamports,
        });

        // Create message with metadata
        const messageV0 = new TransactionMessage({
          payerKey: publicKey,
          recentBlockhash: blockhash,
          instructions: [transferInstruction],
        }).compileToV0Message();

        // Create versioned transaction
        const transaction = new VersionedTransaction(messageV0);

        // Send transaction
        const signature = await sendTransaction(transaction, connection);
        
        // Wait for confirmation
        const confirmation = await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight,
        });
        
        if (confirmation.value.err) {
          throw new Error("Transaction failed to confirm");
        }
        
        paymentSuccess = true;
      } else if (paymentMethod === 'TOKEN') {
        // Placeholder for token transactions
        console.log("Token payment selected - would process token transfer here");
        
        toast.info("Token payment simulation", {
          description: "In a production app, this would process a real token transfer"
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        paymentSuccess = true;
      } else if (paymentMethod === 'MONAD') {
        // For Monad blockchain payments
        const monadWalletAddress = eventData.organizer_monad_wallet || "0x1234567890123456789012345678901234567890";
        
        paymentSuccess = await processMonadPayment(monadWalletAddress, totalPrice);
      } else {
        throw new Error("Unsupported payment method");
      }
      
      if (!paymentSuccess) {
        setIsProcessing(false);
        return false;
      }

      // Generate ticket records
      const tickets = [];
      for (let i = 0; i < quantity; i++) {
        const ticketId = uuidv4();
        const qrCode = `https://blocktix-qr.vercel.app/ticket/${ticketId}`;
        
        const ticket = {
          id: ticketId,
          event_id: eventId,
          owner_wallet: publicKey ? publicKey.toString() : "free-user",
          purchase_price: isFree ? 0 : eventData.price * priceMultiplier,
          purchase_currency: isFree ? 'FREE' : (paymentMethod === 'MONAD' ? 'MONAD' : 
                             paymentMethod === 'TOKEN' ? 'TOKEN' : eventData.currency),
          token_id: `${isFree ? 'FREE' : paymentMethod}-TICKET-${ticketId.substring(0, 8)}`,
          ticket_class: ticketClass.toUpperCase(),
          qr_code: qrCode,
          status: 'upcoming'
        };
        
        tickets.push(ticket);
      }

      console.log('Generated tickets:', tickets);

      try {
        // For free events without wallet, store in localStorage
        if (isFree && !publicKey) {
          const existingLocalTickets = localStorage.getItem('freeTickets');
          let localTickets = [];
          
          if (existingLocalTickets) {
            try {
              localTickets = JSON.parse(existingLocalTickets);
            } catch (error) {
              console.error('Error parsing existing local tickets:', error);
              localTickets = [];
            }
          }
          
          // Add event data to tickets for localStorage
          const ticketsWithEventData = tickets.map(ticket => ({
            ...ticket,
            events: {
              title: event.title,
              date: event.date,
              location: event.location
            }
          }));
          
          localTickets.push(...ticketsWithEventData);
          localStorage.setItem('freeTickets', JSON.stringify(localTickets));
          console.log('Saved free tickets to localStorage:', localTickets);
        }
        
        // Only insert to database for valid UUIDs (real events) and when we have a wallet
        if (isValidUuid) {
          console.log('Inserting tickets to database:', tickets);
          
          // Insert tickets to database
          const { data: insertedTickets, error: ticketError } = await supabase
            .from('tickets')
            .insert(tickets)
            .select();

          if (ticketError) {
            console.error('Database error inserting tickets:', ticketError);
            throw ticketError;
          }
          
          console.log('Successfully inserted tickets:', insertedTickets);
          
          // Update event sold tickets count
          const { error: updateError } = await supabase
            .from('events')
            .update({ sold_tickets: event.sold_tickets + quantity })
            .eq('id', eventId);
            
          if (updateError) {
            console.error('Error updating sold tickets:', updateError);
          }

          // Record the purchase interaction
          if (publicKey) {
            const { error: interactionError } = await supabase
              .from('user_events')
              .insert({
                user_wallet: publicKey.toString(),
                event_id: eventId,
                interaction_type: 'purchased'
              });
              
            if (interactionError) {
              console.error('Error recording interaction:', interactionError);
            }
          }
        }
        
        if (!isFree) {
          toast.success("Purchase successful!", {
            description: `You have purchased ${quantity} ${ticketClass} ticket${quantity > 1 ? 's' : ''}`
          });
        }
        
        setIsProcessing(false);
        return true;
      } catch (dbError) {
        console.error("Database operation failed but payment transaction succeeded:", dbError);
        // Still return true since the payment transaction was successful
        if (!isFree) {
          toast.success("Purchase successful!", {
            description: `You have purchased ${quantity} ${ticketClass} ticket${quantity > 1 ? 's' : ''}`
          });
        }
        setIsProcessing(false);
        return true;
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
