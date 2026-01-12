import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-content animate-fade-in-up">
                <div className="hero-badge">
                    <span className="hero-badge-dot" />
                    <span>Live on Supra Network</span>
                    <Sparkles size={14} />
                </div>

                <h1>
                    Trade Crypto with <span className="gradient-text">Lightning Speed</span>
                </h1>

                <p>
                    The most powerful decentralized exchange on Supra Network.
                    Swap tokens instantly with ultra-low fees and maximum security.
                </p>

                <div className="hero-buttons">
                    <Link href="/app" className="btn btn-primary">
                        Launch App
                        <ArrowRight size={20} />
                    </Link>
                    <Link href="#features" className="btn btn-secondary">
                        Learn More
                    </Link>
                </div>
            </div>
        </section>
    );
}
