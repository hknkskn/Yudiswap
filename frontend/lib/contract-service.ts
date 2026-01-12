// @ts-nocheck
// Supra SDK is not fully typed, so we use dynamic imports
import { getRpcUrl } from "./config";
import type { SwapQuote, TransactionResult } from "./types";

// Dynamically import SupraClient to avoid build issues
let SupraClient: any = null;

async function loadSupraClient() {
    if (!SupraClient) {
        try {
            const sdk = await import("supra-l1-sdk");
            SupraClient = sdk.SupraClient;
        } catch (error) {
            console.warn("supra-l1-sdk not available, using mock client");
        }
    }
    return SupraClient;
}

// Singleton SupraClient instance
let supraClient: any = null;

export async function getSupraClient(): Promise<any> {
    if (!supraClient) {
        const Client = await loadSupraClient();
        if (Client) {
            supraClient = await Client.init(getRpcUrl());
        }
    }
    return supraClient;
}

// Get account balance
export async function getBalance(address: string, coinType: string): Promise<string> {
    try {
        const client = await getSupraClient();
        if (!client) return "0";
        const balance = await client.getAccountCoinBalance(address, coinType);
        return balance.toString();
    } catch (error) {
        console.error("Failed to get balance:", error);
        return "0";
    }
}

// Get SUPRA balance (native coin)
export async function getSupraBalance(address: string): Promise<string> {
    return getBalance(address, "0x1::supra_coin::SupraCoin");
}

// Format balance with decimals
export function formatBalance(balance: string, decimals: number): string {
    try {
        const balanceBigInt = BigInt(balance);
        const divisor = BigInt(10 ** decimals);
        const integerPart = balanceBigInt / divisor;
        const fractionalPart = balanceBigInt % divisor;

        const fractionalStr = fractionalPart.toString().padStart(decimals, "0").slice(0, 4);
        return `${integerPart}.${fractionalStr}`;
    } catch {
        return "0.0000";
    }
}

// Calculate swap quote
export async function getSwapQuote(
    amountIn: string,
    tokenIn: string,
    tokenOut: string,
    poolAddress: string
): Promise<SwapQuote | null> {
    try {
        // This would call the AMM view function to get quote
        // For now, return placeholder
        const amountInNum = parseFloat(amountIn) || 0;
        const fee = amountInNum * 0.003; // 0.3%

        // Placeholder calculation - in real implementation this would call the contract
        return {
            amountIn,
            amountOut: "0", // Would be calculated by contract
            priceImpact: 0,
            fee: fee.toString(),
            route: [tokenIn, tokenOut],
        };
    } catch (error) {
        console.error("Failed to get swap quote:", error);
        return null;
    }
}

// Execute swap transaction
export async function executeSwap(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    minAmountOut: string,
    poolAddress: string
): Promise<TransactionResult> {
    const starkey = typeof window !== 'undefined' ? window.starkey?.supra : null;

    if (!starkey) {
        return { success: false, error: "Wallet not connected" };
    }

    try {
        // Build the transaction payload
        const payload = {
            function: `${poolAddress}::router::swap_exact_tokens_for_tokens`,
            type_arguments: [tokenIn, tokenOut],
            arguments: [poolAddress, amountIn, minAmountOut],
        };

        // Sign and submit transaction
        const result = await starkey.signAndSubmitTransaction({
            type: "entry_function_payload",
            ...payload,
        });

        return {
            success: true,
            hash: result.hash,
        };
    } catch (error) {
        console.error("Swap failed:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Transaction failed",
        };
    }
}

// Add liquidity
export async function addLiquidity(
    tokenA: string,
    tokenB: string,
    amountA: string,
    amountB: string,
    minAmountA: string,
    minAmountB: string,
    poolAddress: string
): Promise<TransactionResult> {
    const starkey = typeof window !== 'undefined' ? window.starkey?.supra : null;

    if (!starkey) {
        return { success: false, error: "Wallet not connected" };
    }

    try {
        const payload = {
            function: `${poolAddress}::router::add_liquidity`,
            type_arguments: [tokenA, tokenB],
            arguments: [poolAddress, amountA, amountB, minAmountA, minAmountB],
        };

        const result = await starkey.signAndSubmitTransaction({
            type: "entry_function_payload",
            ...payload,
        });

        return {
            success: true,
            hash: result.hash,
        };
    } catch (error) {
        console.error("Add liquidity failed:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Transaction failed",
        };
    }
}

// Remove liquidity
export async function removeLiquidity(
    tokenA: string,
    tokenB: string,
    lpAmount: string,
    minAmountA: string,
    minAmountB: string,
    poolAddress: string
): Promise<TransactionResult> {
    const starkey = typeof window !== 'undefined' ? window.starkey?.supra : null;

    if (!starkey) {
        return { success: false, error: "Wallet not connected" };
    }

    try {
        const payload = {
            function: `${poolAddress}::router::remove_liquidity`,
            type_arguments: [tokenA, tokenB],
            arguments: [poolAddress, lpAmount, minAmountA, minAmountB],
        };

        const result = await starkey.signAndSubmitTransaction({
            type: "entry_function_payload",
            ...payload,
        });

        return {
            success: true,
            hash: result.hash,
        };
    } catch (error) {
        console.error("Remove liquidity failed:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Transaction failed",
        };
    }
}
