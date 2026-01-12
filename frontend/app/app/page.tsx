"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDown, Settings, ChevronDown, X, Loader2 } from "lucide-react";
import { useWalletStore } from "@/lib/wallet-store";
import { SUPRA_CONFIG } from "@/lib/config";

// Token type
interface Token {
    symbol: string;
    name: string;
    icon: string;
    balance: string;
    decimals: number;
    address: string;
}

// Demo tokens with config
const TOKENS: Token[] = SUPRA_CONFIG.TOKENS.map(t => ({
    ...t,
    balance: "0.00"
}));

export default function SwapPage() {
    const pathname = usePathname();
    const { isConnected, address, connect } = useWalletStore();

    const [fromToken, setFromToken] = useState(TOKENS[0]);
    const [toToken, setToToken] = useState<Token | null>(null);
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const [showTokenModal, setShowTokenModal] = useState<"from" | "to" | null>(null);
    const [isSwapping, setIsSwapping] = useState(false);
    const [slippage, setSlippage] = useState("0.5");

    // Calculate output amount (placeholder - would use contract)
    useEffect(() => {
        if (fromAmount && toToken && parseFloat(fromAmount) > 0) {
            // Placeholder calculation - in real app this would call the contract
            const mockRate = 1.5; // Mock exchange rate
            setToAmount((parseFloat(fromAmount) * mockRate).toFixed(6));
        } else {
            setToAmount("");
        }
    }, [fromAmount, toToken]);

    const handleSwapDirection = () => {
        if (toToken) {
            const temp = fromToken;
            setFromToken(toToken);
            setToToken(temp);
            setFromAmount(toAmount);
            setToAmount(fromAmount);
        }
    };

    const selectToken = (token: Token) => {
        if (showTokenModal === "from") {
            if (toToken?.symbol === token.symbol) {
                setToToken(fromToken);
            }
            setFromToken(token);
        } else {
            if (fromToken.symbol === token.symbol) {
                setFromToken(toToken!);
            }
            setToToken(token);
        }
        setShowTokenModal(null);
    };

    const handleSwap = async () => {
        if (!isConnected) {
            await connect();
            return;
        }

        if (!fromAmount || !toToken) return;

        setIsSwapping(true);
        try {
            // TODO: Call executeSwap from contract-service
            console.log("Swapping", fromAmount, fromToken.symbol, "for", toToken.symbol);

            // Simulate transaction delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Reset form on success
            setFromAmount("");
            setToAmount("");
        } catch (error) {
            console.error("Swap failed:", error);
        } finally {
            setIsSwapping(false);
        }
    };

    const getButtonText = () => {
        if (!isConnected) return "Connect Wallet";
        if (!toToken) return "Select a token";
        if (!fromAmount) return "Enter an amount";
        if (isSwapping) return "Swapping...";
        return "Swap";
    };

    return (
        <div className="dex-container">
            {/* Tabs */}
            <div className="dex-tabs">
                <Link
                    href="/app"
                    className={`dex-tab ${pathname === "/app" ? "active" : ""}`}
                >
                    Swap
                </Link>
                <Link
                    href="/app/pool"
                    className={`dex-tab ${pathname === "/app/pool" ? "active" : ""}`}
                >
                    Pool
                </Link>
            </div>

            {/* Swap Card */}
            <div className="swap-card">
                <div className="swap-header">
                    <h2 className="swap-title">Swap</h2>
                    <button className="swap-settings" aria-label="Settings">
                        <Settings size={18} />
                    </button>
                </div>

                {/* From Token */}
                <div className="token-input-container">
                    <div className="token-input-header">
                        <span className="token-input-label">You pay</span>
                        <span className="token-balance">
                            Balance: {fromToken.balance}
                            <span className="token-balance-max" onClick={() => setFromAmount(fromToken.balance)}>MAX</span>
                        </span>
                    </div>
                    <div className="token-input-row">
                        <input
                            type="number"
                            className="token-amount-input"
                            placeholder="0"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                            min="0"
                            step="any"
                        />
                        <button
                            className="token-selector"
                            onClick={() => setShowTokenModal("from")}
                        >
                            <div className="token-icon">{fromToken.icon}</div>
                            <span className="token-symbol">{fromToken.symbol}</span>
                            <ChevronDown size={16} />
                        </button>
                    </div>
                    <div className="token-input-usd">≈ $0.00</div>
                </div>

                {/* Swap Arrow */}
                <div className="swap-arrow-container">
                    <button className="swap-arrow" onClick={handleSwapDirection}>
                        <ArrowDown size={20} />
                    </button>
                </div>

                {/* To Token */}
                <div className="token-input-container">
                    <div className="token-input-header">
                        <span className="token-input-label">You receive</span>
                        {toToken && (
                            <span className="token-balance">Balance: {toToken.balance}</span>
                        )}
                    </div>
                    <div className="token-input-row">
                        <input
                            type="text"
                            className="token-amount-input"
                            placeholder="0"
                            value={toAmount}
                            readOnly
                        />
                        <button
                            className="token-selector"
                            onClick={() => setShowTokenModal("to")}
                        >
                            {toToken ? (
                                <>
                                    <div className="token-icon">{toToken.icon}</div>
                                    <span className="token-symbol">{toToken.symbol}</span>
                                </>
                            ) : (
                                <span className="token-symbol">Select token</span>
                            )}
                            <ChevronDown size={16} />
                        </button>
                    </div>
                    <div className="token-input-usd">≈ $0.00</div>
                </div>

                {/* Swap Info */}
                {fromAmount && toToken && parseFloat(fromAmount) > 0 && (
                    <div className="swap-info">
                        <div className="swap-info-row">
                            <span className="swap-info-label">Rate</span>
                            <span className="swap-info-value">
                                1 {fromToken.symbol} ≈ 1.5 {toToken.symbol}
                            </span>
                        </div>
                        <div className="swap-info-row">
                            <span className="swap-info-label">Price Impact</span>
                            <span className="swap-info-value" style={{ color: "#22c55e" }}>{"<0.01%"}</span>
                        </div>
                        <div className="swap-info-row">
                            <span className="swap-info-label">Slippage</span>
                            <span className="swap-info-value">{slippage}%</span>
                        </div>
                        <div className="swap-info-row">
                            <span className="swap-info-label">Fee (0.3%)</span>
                            <span className="swap-info-value">
                                {(parseFloat(fromAmount) * 0.003).toFixed(6)} {fromToken.symbol}
                            </span>
                        </div>
                    </div>
                )}

                {/* Swap Button */}
                <button
                    className="btn btn-primary swap-button"
                    disabled={isConnected && (!fromAmount || !toToken || isSwapping)}
                    onClick={handleSwap}
                >
                    {isSwapping && <Loader2 size={20} className="animate-spin" />}
                    {getButtonText()}
                </button>
            </div>

            {/* Token Selection Modal */}
            {showTokenModal && (
                <div className="modal-overlay" onClick={() => setShowTokenModal(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Select a token</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowTokenModal(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-search">
                            <input
                                type="text"
                                placeholder="Search by name or address"
                            />
                        </div>
                        <div className="token-list">
                            {TOKENS.map((token) => (
                                <div
                                    key={token.symbol}
                                    className="token-list-item"
                                    onClick={() => selectToken(token)}
                                >
                                    <div className="token-icon">{token.icon}</div>
                                    <div className="token-list-info">
                                        <div className="token-list-symbol">{token.symbol}</div>
                                        <div className="token-list-name">{token.name}</div>
                                    </div>
                                    <div className="token-list-balance">{token.balance}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
