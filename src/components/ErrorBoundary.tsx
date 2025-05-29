
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const isWalletError = this.state.error?.message?.includes('wallet') || 
                           this.state.error?.message?.includes('Buffer') ||
                           this.state.error?.message?.includes('Phantom');
      
      return (
        <div className="min-h-screen bg-blocktix-dark text-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">
              {isWalletError ? 'Wallet Connection Issue' : 'Something went wrong'}
            </h1>
            <p className="text-gray-400 mb-4">
              {isWalletError 
                ? 'There was a problem connecting to your wallet. Please try refreshing the page.'
                : this.state.error?.message || 'An unexpected error occurred'
              }
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.reload()}
                className="bg-blocktix-purple hover:bg-blocktix-purple/80 text-white px-4 py-2 rounded w-full"
              >
                Reload Page
              </button>
              {isWalletError && (
                <p className="text-sm text-gray-500">
                  Make sure you have a Solana wallet extension installed (like Phantom)
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
