// Supra Network Configuration
export const SUPRA_CONFIG = {
    // Network endpoints
    TESTNET_RPC: "https://rpc-testnet.supra.com",
    MAINNET_RPC: "https://rpc-mainnet.supra.com",

    // Chain IDs
    TESTNET_CHAIN_ID: 6,
    MAINNET_CHAIN_ID: 8,

    // Faucet (Testnet only)
    FAUCET_URL: "https://rpc-testnet.supra.com/rpc/v1/wallet/faucet",

    // Contract addresses (to be updated after deployment)
    CONTRACTS: {
        AMM: "",
        ROUTER: "",
    },

    // Default tokens
    TOKENS: [
        {
            symbol: "SUPRA",
            name: "Supra Token",
            decimals: 8,
            address: "0x1::supra_coin::SupraCoin",
            icon: "S",
            isNative: true,
        },
        {
            symbol: "USDC",
            name: "USD Coin",
            decimals: 6,
            address: "", // To be added
            icon: "U",
            isNative: false,
        },
        {
            symbol: "USDT",
            name: "Tether USD",
            decimals: 6,
            address: "", // To be added
            icon: "T",
            isNative: false,
        },
    ],
} as const;

// Current network (switch between testnet/mainnet)
export const CURRENT_NETWORK = "testnet" as const;

export function getRpcUrl(): string {
    return CURRENT_NETWORK === "testnet"
        ? SUPRA_CONFIG.TESTNET_RPC
        : SUPRA_CONFIG.MAINNET_RPC;
}

export function getChainId(): number {
    return CURRENT_NETWORK === "testnet"
        ? SUPRA_CONFIG.TESTNET_CHAIN_ID
        : SUPRA_CONFIG.MAINNET_CHAIN_ID;
}
