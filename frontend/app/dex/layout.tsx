"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import WalletConnect from "@/components/WalletConnect";
import { Zap } from "lucide-react";
import "./dex.css";

export default function DexLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dex-layout">
            <nav className="navbar">
                <div className="container navbar-content">
                    <Link href="/" className="navbar-logo">
                        <div className="navbar-logo-icon">
                            <Zap size={24} color="white" />
                        </div>
                        <span className="gradient-text">YudiSwap</span>
                    </Link>

                    <div className="navbar-actions">
                        <ThemeToggle />
                        <WalletConnect />
                    </div>
                </div>
            </nav>
            {children}
        </div>
    );
}
