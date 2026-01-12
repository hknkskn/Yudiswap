import Link from "next/link";
import { Twitter, Github, MessageCircle, Zap } from "lucide-react";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="navbar-logo">
                    <div className="navbar-logo-icon">
                        <Zap size={20} color="white" />
                    </div>
                    <span className="gradient-text">YudiSwap</span>
                </div>

                <div className="footer-socials">
                    <Link href="#" className="social-link" aria-label="Twitter">
                        <Twitter size={20} />
                    </Link>
                    <Link href="#" className="social-link" aria-label="Discord">
                        <MessageCircle size={20} />
                    </Link>
                    <Link href="#" className="social-link" aria-label="GitHub">
                        <Github size={20} />
                    </Link>
                </div>

                <div className="footer-bottom">
                    © 2026 YudiSwap. Built on Supra Network.
                </div>
            </div>
        </footer>
    );
}
