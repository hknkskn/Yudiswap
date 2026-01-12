import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Zap } from "lucide-react";

export default function Navbar() {
    return (
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
                    <Link href="/dex" className="btn btn-primary">
                        Launch App
                    </Link>
                </div>
            </div>
        </nav>
    );
}
