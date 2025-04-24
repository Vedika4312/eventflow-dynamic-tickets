
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Wallet, Menu, X } from 'lucide-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWalletIntegration } from '@/hooks/useWallet';
import { truncateAddress } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { setVisible } = useWalletModal();
  const { connected, publicKey, disconnect, isRegistering } = useWalletIntegration();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  
  const handleConnectWallet = () => {
    setVisible(true);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/create', label: 'Create Event' },
    { path: '/my-tickets', label: 'My Tickets' },
  ];

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
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`transition-colors ${
                isActive(link.path) 
                  ? "text-white font-medium" 
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {connected && publicKey ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-blocktix-purple text-blocktix-purple"
                  disabled={isRegistering}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {isRegistering ? "Connecting..." : truncateAddress(publicKey.toString())}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-blocktix-dark border-white/10">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/my-tickets" className="w-full cursor-pointer">
                    My Tickets
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/create" className="w-full cursor-pointer">
                    Create Event
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={disconnect}
                  className="text-red-500 cursor-pointer"
                >
                  Disconnect Wallet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={handleConnectWallet}
              className="bg-gradient-purple hover:opacity-90"
              disabled={isRegistering}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isRegistering ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blocktix-dark/95 border-b border-white/10 py-4">
          <div className="container mx-auto px-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`py-2 px-4 rounded-md transition-colors ${
                  isActive(link.path) 
                    ? "bg-blocktix-purple/20 text-white font-medium" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
