"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDown, Settings, ChevronDown, X } from "lucide-react";

// Demo tokens
const TOKENS = [
    { symbol: "SUPRA", name: "Supra Token", icon: "S", balance: "0.00" },
    { symbol: "USDC", name: "USD Coin", icon: "U", balance: "0.00" },
    { symbol: "USDT", name: "Tether USD", icon: "T", balance: "0.00" },
    { symbol: "ETH", name: "Ethereum", icon: "E", balance: "0.00" },
];

export default function SwapPage() {
    const pathname = usePathname();
    const [fromToken, setFromToken] = useState(TOKENS[0]);
    const [toToken, setToToken] = useState<typeof TOKENS[0] | null>(null);
    const [fromAmount, setFromAmount] = useState("");
    const [showTokenModal, setShowTokenModal] = useState<"from" | "to" | null>(null);

    const handleSwapDirection = () => {
        if (toToken) {
            const temp = fromToken;
            setFromToken(toToken);
            setToToken(temp);
        }
    };

    const selectToken = (token: typeof TOKENS[0]) => {
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

    return (
        <div className="dex-container">
            {/* Tabs */}
            <div className="dex-tabs">
                <Link
                    href="/dex"
                    className={`dex-tab ${pathname === "/dex" ? "active" : ""}`}
                >
                    Swap
                </Link>
                <Link
                    href="/dex/pool"
                    className={`dex-tab ${pathname === "/dex/pool" ? "active" : ""}`}
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
                            <span className="token-balance-max">MAX</span>
                        </span>
                    </div>
                    <div className="token-input-row">
                        <input
                            type="text"
                            className="token-amount-input"
                            placeholder="0"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
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
                    <div className="token-input-usd">$0.00</div>
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
                    <div className="token-input-usd">$0.00</div>
                </div>

                {/* Swap Info */}
                {fromAmount && toToken && (
                    <div className="swap-info">
                        <div className="swap-info-row">
                            <span className="swap-info-label">Rate</span>
                            <span className="swap-info-value">
                                1 {fromToken.symbol} = -- {toToken.symbol}
                            </span>
                        </div>
                        <div className="swap-info-row">
                            <span className="swap-info-label">Price Impact</span>
                            <span className="swap-info-value">0.00%</span>
                        </div>
                        <div className="swap-info-row">
                            <span className="swap-info-label">Min. Received</span>
                            <span className="swap-info-value">-- {toToken.symbol}</span>
                        </div>
                        <div className="swap-info-row">
                            <span className="swap-info-label">Fee (0.3%)</span>
                            <span className="swap-info-value">-- {fromToken.symbol}</span>
                        </div>
                    </div>
                )}

                {/* Swap Button */}
                <button
                    className="btn btn-primary swap-button"
                    disabled={!fromAmount || !toToken}
                >
                    {!toToken ? "Select a token" : !fromAmount ? "Enter an amount" : "Connect Wallet"}
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
