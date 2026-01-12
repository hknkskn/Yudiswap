import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WalletState, Token } from "./types";
import { SUPRA_CONFIG } from "./config";

interface WalletStore extends WalletState {
    // Actions
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    checkConnection: () => Promise<void>;
    setError: (error: string | null) => void;
}

export const useWalletStore = create<WalletStore>()(
    persist(
        (set, get) => ({
            // Initial state
            isConnected: false,
            isConnecting: false,
            address: null,
            chainId: null,
            error: null,

            // Connect wallet
            connect: async () => {
                const starkey = window.starkey?.supra;

                if (!starkey) {
                    set({ error: "StarKey wallet not installed. Please install StarKey extension." });
                    window.open("https://starkey.app", "_blank");
                    return;
                }

                try {
                    set({ isConnecting: true, error: null });

                    const result = await starkey.connect();
                    const network = await starkey.network();

                    set({
                        isConnected: true,
                        isConnecting: false,
                        address: result.address,
                        chainId: network.chainId,
                        error: null,
                    });

                    // Set up listeners
                    starkey.onAccountChange((account) => {
                        if (account) {
                            set({ address: account });
                        } else {
                            set({ isConnected: false, address: null });
                        }
                    });

                    starkey.onNetworkChange((network) => {
                        set({ chainId: network.chainId });
                    });

                } catch (error) {
                    console.error("Wallet connection error:", error);
                    set({
                        isConnecting: false,
                        error: error instanceof Error ? error.message : "Failed to connect wallet",
                    });
                }
            },

            // Disconnect wallet
            disconnect: async () => {
                const starkey = window.starkey?.supra;

                if (starkey) {
                    try {
                        await starkey.disconnect();
                    } catch (error) {
                        console.error("Disconnect error:", error);
                    }
                }

                set({
                    isConnected: false,
                    address: null,
                    chainId: null,
                    error: null,
                });
            },

            // Check existing connection
            checkConnection: async () => {
                const starkey = window.starkey?.supra;

                if (!starkey) return;

                try {
                    const isConnected = await starkey.isConnected();

                    if (isConnected) {
                        const accounts = await starkey.getAccounts();
                        const network = await starkey.network();

                        if (accounts.length > 0) {
                            set({
                                isConnected: true,
                                address: accounts[0],
                                chainId: network.chainId,
                            });
                        }
                    }
                } catch (error) {
                    console.error("Check connection error:", error);
                }
            },

            setError: (error) => set({ error }),
        }),
        {
            name: "yudiswap-wallet",
            partialize: (state) => ({
                // Only persist address for reconnection hint
                address: state.address,
            }),
        }
    )
);

// Token balances store
interface TokenStore {
    balances: Record<string, string>;
    isLoading: boolean;
    fetchBalances: (address: string) => Promise<void>;
}

export const useTokenStore = create<TokenStore>((set) => ({
    balances: {},
    isLoading: false,

    fetchBalances: async (address: string) => {
        set({ isLoading: true });

        try {
            // TODO: Implement actual balance fetching via supra-l1-sdk
            // For now, use placeholder
            const balances: Record<string, string> = {};

            SUPRA_CONFIG.TOKENS.forEach((token) => {
                balances[token.symbol] = "0.00";
            });

            set({ balances, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch balances:", error);
            set({ isLoading: false });
        }
    },
}));
