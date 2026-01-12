// StarKey Wallet Type Definitions
export interface StarKeyProvider {
    connect(): Promise<{ address: string }>;
    disconnect(): Promise<void>;
    isConnected(): Promise<boolean>;
    getAccounts(): Promise<string[]>;
    signTransaction(transaction: unknown): Promise<unknown>;
    signAndSubmitTransaction(transaction: unknown): Promise<{ hash: string }>;
    signMessage(message: string): Promise<{ signature: string }>;
    network(): Promise<{ chainId: number; name: string }>;
    onAccountChange(callback: (account: string | null) => void): void;
    onNetworkChange(callback: (network: { chainId: number }) => void): void;
}

declare global {
    interface Window {
        starkey?: {
            supra?: StarKeyProvider;
        };
    }
}

export interface WalletState {
    isConnected: boolean;
    isConnecting: boolean;
    address: string | null;
    chainId: number | null;
    error: string | null;
}

export interface Token {
    symbol: string;
    name: string;
    decimals: number;
    address: string;
    icon: string;
    isNative: boolean;
    balance?: string;
}

export interface SwapQuote {
    amountIn: string;
    amountOut: string;
    priceImpact: number;
    fee: string;
    route: string[];
}

export interface Pool {
    coinA: Token;
    coinB: Token;
    reserveA: string;
    reserveB: string;
    lpSupply: string;
    fee: number;
    apr: number;
}

export interface TransactionResult {
    success: boolean;
    hash?: string;
    error?: string;
}
