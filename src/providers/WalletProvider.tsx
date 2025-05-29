
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
import { useMemo } from "react";

// Import the CSS using ES module import
import "@solana/wallet-adapter-react-ui/styles.css";

// Buffer polyfill - make sure this is imported and set BEFORE any wallet adapter code runs
if (typeof window !== 'undefined' && !window.Buffer) {
  try {
    window.Buffer = require('buffer').Buffer;
  } catch (e) {
    console.warn('Buffer polyfill failed to load');
  }
}

interface WalletProviderProps {
  children: React.ReactNode;
}

const WalletProvider = ({ children }: WalletProviderProps) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => {
    try {
      return clusterApiUrl(network);
    } catch (error) {
      console.error('Failed to get cluster API URL:', error);
      return 'https://api.devnet.solana.com';
    }
  }, [network]);
  
  const wallets = useMemo(
    () => {
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
    },
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProvider;
