const stats = [
    { value: "$0", label: "Total Value Locked" },
    { value: "0", label: "Total Trades" },
    { value: "0", label: "Token Pairs" },
    { value: "0", label: "Total Users" }
];

export default function Stats() {
    return (
        <section className="stats">
            <div className="container">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
