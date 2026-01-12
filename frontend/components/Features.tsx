import { ArrowLeftRight, Droplets, Shield, Zap } from "lucide-react";

const features = [
    {
        icon: <ArrowLeftRight size={28} />,
        title: "Instant Swaps",
        description: "Trade any token pair with lightning-fast execution. Our AMM ensures deep liquidity for all your trades."
    },
    {
        icon: <Droplets size={28} />,
        title: "Liquidity Pools",
        description: "Provide liquidity and earn trading fees. Become a market maker with just a few clicks."
    },
    {
        icon: <Shield size={28} />,
        title: "Secure & Audited",
        description: "Built on Move VM with formal verification. Your assets are protected by battle-tested smart contracts."
    },
    {
        icon: <Zap size={28} />,
        title: "Ultra-Low Fees",
        description: "Enjoy the lowest fees in DeFi. Supra Network's high throughput means minimal transaction costs."
    }
];

export default function Features() {
    return (
        <section className="features" id="features">
            <div className="container">
                <div className="features-header">
                    <h2>Why <span className="gradient-text">YudiSwap</span>?</h2>
                    <p>Built for traders who demand the best performance and security.</p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="card animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="feature-icon">
                                {feature.icon}
                            </div>
                            <h4 className="feature-title">{feature.title}</h4>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
