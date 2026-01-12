import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { Zap } from "lucide-react";
import "./dex.css";

export const metadata = {
    title: "Swap | YudiSwap DEX",
    description: "Swap tokens instantly on Supra Network with ultra-low fees.",
};

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
                        <WalletButton />
                    </div>
                </div>
            </nav>
            {children}
        </div>
    );
}

function WalletButton() {
    return (
        <button className="btn btn-primary" id="wallet-connect-btn">
            Connect Wallet
        </button>
    );
}
