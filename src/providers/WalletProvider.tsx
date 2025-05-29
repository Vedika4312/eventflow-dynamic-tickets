
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo, useEffect } from "react";

// Import the CSS using ES module import
import "@solana/wallet-adapter-react-ui/styles.css";

// Setup Buffer polyfill without top-level await
const setupBufferPolyfill = async () => {
  if (typeof window !== 'undefined') {
    if (!window.Buffer) {
      try {
        const bufferModule = await import('buffer');
        window.Buffer = bufferModule.Buffer;
        console.log('Buffer polyfill loaded successfully');
      } catch (e) {
        console.warn('Buffer polyfill failed to load:', e);
        // Fallback polyfill
        window.Buffer = {
          from: (data: any) => new Uint8Array(data),
          alloc: (size: number) => new Uint8Array(size),
          isBuffer: () => false,
        } as any;
      }
    }
    
    // Ensure global is available for wallet adapters
    if (!window.global) {
      window.global = window;
    }
  }
};

interface WalletProviderProps {
  children: React.ReactNode;
}

const WalletProvider = ({ children }: WalletProviderProps) => {
  const network = WalletAdapterNetwork.Devnet;
  
  // Setup polyfills on component mount
  useEffect(() => {
    setupBufferPolyfill();
  }, []);
  
  const endpoint = useMemo(() => {
    try {
      return clusterApiUrl(network);
    } catch (error) {
      console.error('Failed to get cluster API URL:', error);
      return 'https://api.devnet.solana.com';
    }
  }, [network]);
  
  const wallets = useMemo(() => {
    try {
      return [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
        new LedgerWalletAdapter(),
      ];
    } catch (error) {
      console.error('Failed to initialize wallets:', error);
      return [];
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProvider;
