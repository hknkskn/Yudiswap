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
                        <div key={index} className="stat-item animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
