
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Wallet } from 'lucide-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWalletIntegration } from '@/hooks/useWallet';
import { truncateAddress } from '@/lib/utils';

const Navbar = () => {
  const { setVisible } = useWalletModal();
  const { connected, publicKey } = useWalletIntegration();
  
  const handleConnectWallet = () => {
    setVisible(true);
  };

  return (
    <nav className="sticky top-0 z-50 bg-blocktix-dark/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-purple flex items-center justify-center">
            <span className="font-bold text-white">BT</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-purple">
            BlockTix
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-white/80 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/events" className="text-white/80 hover:text-white transition-colors">
            Events
          </Link>
          <Link to="/create" className="text-white/80 hover:text-white transition-colors">
            Create Event
          </Link>
          <Link to="/my-tickets" className="text-white/80 hover:text-white transition-colors">
            My Tickets
          </Link>
        </div>

        <Button 
          onClick={handleConnectWallet}
          variant={connected ? "outline" : "default"}
          className={connected ? "border-blocktix-purple text-blocktix-purple" : "bg-gradient-purple hover:opacity-90"}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {connected && publicKey ? truncateAddress(publicKey.toString()) : "Connect Wallet"}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
