
import { ethers } from "ethers";

// Monad blockchain configuration 
const MONAD_RPC_URL = "https://rpc.monad.xyz/testnet";
const MONAD_CHAIN_ID = 1942;
const MONAD_CHAIN_NAME = "Monad Testnet";
const MONAD_CURRENCY_SYMBOL = "MON";
const MONAD_CURRENCY_DECIMALS = 18;
const MONAD_BLOCK_EXPLORER = "https://explorer.monad.xyz/testnet";

// Initialize ethers provider for Monad
export const getMonadProvider = (): ethers.JsonRpcProvider => {
  return new ethers.JsonRpcProvider(MONAD_RPC_URL);
};

// Add Monad network to MetaMask
export const addMonadNetworkToMetaMask = async (): Promise<boolean> => {
  try {
    // Check if ethereum object is available (MetaMask is installed)
    if (window.ethereum) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${MONAD_CHAIN_ID.toString(16)}`,
            chainName: MONAD_CHAIN_NAME,
            nativeCurrency: {
              name: MONAD_CURRENCY_SYMBOL,
              symbol: MONAD_CURRENCY_SYMBOL,
              decimals: MONAD_CURRENCY_DECIMALS,
            },
            rpcUrls: [MONAD_RPC_URL],
            blockExplorerUrls: [MONAD_BLOCK_EXPLORER],
          },
        ],
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to add Monad network:", error);
    return false;
  }
};

// Connect to MetaMask and switch to Monad network
export const connectToMonad = async (): Promise<string | null> => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Switch to Monad network
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${MONAD_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        await addMonadNetworkToMetaMask();
      } else {
        throw switchError;
      }
    }

    return accounts[0];
  } catch (error) {
    console.error("Failed to connect to Monad:", error);
    return null;
  }
};

// Convert price to wei
export const convertPriceToWei = (price: number): string => {
  return ethers.parseEther(price.toString()).toString();
};

// Send transaction on Monad
export const sendMonadTransaction = async (
  toAddress: string,
  amount: number
): Promise<string | null> => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const fromAddress = accounts[0];

    // Create transaction object
    const transactionParameters = {
      from: fromAddress,
      to: toAddress,
      value: ethers.toBeHex(ethers.parseEther(amount.toString())),
      gasLimit: ethers.toBeHex(21000),
    };

    // Send transaction
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    return txHash;
  } catch (error) {
    console.error("Transaction failed:", error);
    return null;
  }
};

// Define the window ethereum property for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default {
  getMonadProvider,
  addMonadNetworkToMetaMask,
  connectToMonad,
  convertPriceToWei,
  sendMonadTransaction,
};
