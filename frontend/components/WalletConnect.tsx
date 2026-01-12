"use client";

import { useEffect, useState } from "react";
import { Wallet, LogOut, Copy, Check, ExternalLink } from "lucide-react";
import { useWalletStore } from "@/lib/wallet-store";

export default function WalletConnect() {
    const { isConnected, isConnecting, address, connect, disconnect, checkConnection, error } = useWalletStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        checkConnection();
    }, [checkConnection]);

    const handleConnect = async () => {
        await connect();
    };

    const handleDisconnect = async () => {
        await disconnect();
        setShowDropdown(false);
    };

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    if (!mounted) {
        return (
            <button className="btn btn-primary" disabled>
                Connect Wallet
            </button>
        );
    }

    if (isConnected && address) {
        return (
            <div className="wallet-connected">
                <button
                    className="wallet-button"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <div className="wallet-indicator" />
                    <span>{formatAddress(address)}</span>
                </button>

                {showDropdown && (
                    <>
                        <div className="wallet-dropdown-overlay" onClick={() => setShowDropdown(false)} />
                        <div className="wallet-dropdown">
                            <div className="wallet-dropdown-header">
                                <span className="wallet-dropdown-label">Connected</span>
                                <span className="wallet-dropdown-address">{formatAddress(address)}</span>
                            </div>

                            <div className="wallet-dropdown-actions">
                                <button className="wallet-dropdown-item" onClick={copyAddress}>
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    <span>{copied ? "Copied!" : "Copy Address"}</span>
                                </button>

                                <a
                                    href={`https://suprascan.io/address/${address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="wallet-dropdown-item"
                                >
                                    <ExternalLink size={16} />
                                    <span>View on Explorer</span>
                                </a>

                                <button className="wallet-dropdown-item wallet-disconnect" onClick={handleDisconnect}>
                                    <LogOut size={16} />
                                    <span>Disconnect</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}

                <style jsx>{`
          .wallet-connected {
            position: relative;
          }
          .wallet-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.625rem 1rem;
            background: var(--glass-bg);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            color: var(--text-primary);
            font-weight: 600;
            cursor: pointer;
            transition: all var(--transition-fast);
          }
          .wallet-button:hover {
            border-color: var(--border-color-hover);
            background: var(--bg-card-hover);
          }
          .wallet-indicator {
            width: 8px;
            height: 8px;
            background: #22c55e;
            border-radius: 50%;
          }
          .wallet-dropdown-overlay {
            position: fixed;
            inset: 0;
            z-index: 99;
          }
          .wallet-dropdown {
            position: absolute;
            top: calc(100% + 0.5rem);
            right: 0;
            min-width: 220px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: 0.5rem;
            z-index: 100;
            box-shadow: var(--shadow-lg);
          }
          .wallet-dropdown-header {
            padding: 0.75rem;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 0.5rem;
          }
          .wallet-dropdown-label {
            display: block;
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-bottom: 0.25rem;
          }
          .wallet-dropdown-address {
            font-weight: 600;
            font-family: var(--font-mono);
          }
          .wallet-dropdown-actions {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .wallet-dropdown-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.625rem 0.75rem;
            background: transparent;
            border: none;
            border-radius: var(--radius-md);
            color: var(--text-secondary);
            font-size: 0.875rem;
            cursor: pointer;
            transition: all var(--transition-fast);
            text-decoration: none;
            width: 100%;
          }
          .wallet-dropdown-item:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
          }
          .wallet-disconnect:hover {
            color: #ef4444;
          }
        `}</style>
            </div>
        );
    }

    return (
        <>
            <button
                className="btn btn-primary"
                onClick={handleConnect}
                disabled={isConnecting}
            >
                {isConnecting ? (
                    <>
                        <span className="spinner" />
                        Connecting...
                    </>
                ) : (
                    <>
                        <Wallet size={18} />
                        Connect Wallet
                    </>
                )}
            </button>

            {error && (
                <div className="wallet-error">
                    {error}
                </div>
            )}

            <style jsx>{`
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .wallet-error {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          padding: 0.75rem 1rem;
          background: #ef4444;
          color: white;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          z-index: 1000;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
        </>
    );
}
