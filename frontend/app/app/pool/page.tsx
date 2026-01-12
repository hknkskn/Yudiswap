"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplets, Plus } from "lucide-react";

export default function PoolPage() {
    const pathname = usePathname();

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

            {/* Pool Header */}
            <div className="swap-card">
                <div className="swap-header">
                    <h2 className="swap-title">Your Positions</h2>
                    <button className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>
                        <Plus size={18} />
                        New Position
                    </button>
                </div>

                {/* Empty State */}
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <Droplets size={32} />
                    </div>
                    <h3>No Liquidity Found</h3>
                    <p>You don&apos;t have any liquidity positions yet.</p>
                    <button className="btn btn-secondary">
                        Connect Wallet
                    </button>
                </div>
            </div>

            {/* Available Pools */}
            <div style={{ marginTop: "var(--space-xl)" }}>
                <h3 style={{ marginBottom: "var(--space-lg)" }}>Available Pools</h3>

                <div className="pool-card" style={{ marginBottom: "var(--space-md)" }}>
                    <div className="pool-header">
                        <div className="pool-pair">
                            <div className="pool-icons">
                                <div className="token-icon">S</div>
                                <div className="token-icon">U</div>
                            </div>
                            <div className="pool-info">
                                <div className="pool-name">SUPRA / USDC</div>
                                <div className="pool-fee">0.3% Fee</div>
                            </div>
                        </div>
                    </div>
                    <div className="pool-stats">
                        <div className="pool-stat">
                            <div className="pool-stat-value">$0</div>
                            <div className="pool-stat-label">TVL</div>
                        </div>
                        <div className="pool-stat">
                            <div className="pool-stat-value">$0</div>
                            <div className="pool-stat-label">24h Volume</div>
                        </div>
                        <div className="pool-stat">
                            <div className="pool-stat-value">0%</div>
                            <div className="pool-stat-label">APR</div>
                        </div>
                    </div>
                    <div className="pool-actions">
                        <button className="btn btn-secondary">Add Liquidity</button>
                        <button className="btn btn-ghost">View Details</button>
                    </div>
                </div>

                <div className="pool-card">
                    <div className="pool-header">
                        <div className="pool-pair">
                            <div className="pool-icons">
                                <div className="token-icon">S</div>
                                <div className="token-icon">E</div>
                            </div>
                            <div className="pool-info">
                                <div className="pool-name">SUPRA / ETH</div>
                                <div className="pool-fee">0.3% Fee</div>
                            </div>
                        </div>
                    </div>
                    <div className="pool-stats">
                        <div className="pool-stat">
                            <div className="pool-stat-value">$0</div>
                            <div className="pool-stat-label">TVL</div>
                        </div>
                        <div className="pool-stat">
                            <div className="pool-stat-value">$0</div>
                            <div className="pool-stat-label">24h Volume</div>
                        </div>
                        <div className="pool-stat">
                            <div className="pool-stat-value">0%</div>
                            <div className="pool-stat-label">APR</div>
                        </div>
                    </div>
                    <div className="pool-actions">
                        <button className="btn btn-secondary">Add Liquidity</button>
                        <button className="btn btn-ghost">View Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
