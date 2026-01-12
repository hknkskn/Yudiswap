# YudiSwap - Decentralized Exchange on Supra Network

A modern DEX built on Supra Network using Move VM.

## Features

- 💱 Token Swap with AMM (x*y=k)
- 🏊 Liquidity Pools
- 🌙 Dark/Light Theme
- ⚡ Ultra-fast transactions on Supra

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Vanilla CSS
- **Blockchain**: Supra Network (Move VM)
- **SDK**: supra-l1-sdk

## Quick Start

```bash
# Install dependencies
cd frontend
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
Yudiswap/
├── frontend/          # Next.js frontend
│   ├── app/           # Pages and routes
│   └── components/    # React components
└── contracts/         # Move smart contracts
    └── sources/       # AMM and Router modules
```

## License

MIT
