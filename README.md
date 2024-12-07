# BlockEstate

BlockEstate is a decentralized real estate investment platform that enables fractional property ownership through blockchain technology. Users can invest in premium properties with minimal capital, enjoy high liquidity, and benefit from transparent property tokenization.

## Features

- 🏢 Tokenized Property Investment
- 💱 Secondary Market Trading
- 🔐 Secure Blockchain Transactions
- 💰 Fractional Ownership
- 📊 Real-time Portfolio Management
- 🌐 Web3 Integration with RainbowKit

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Radix UI
- **Web3:** RainbowKit + wagmi
- **Package Manager:** Bun
- **Formatting:** Prettier
- **Linting:** ESLint
- **Git Hooks:** Husky + lint-staged

## Prerequisites

- [Bun](https://bun.sh) (Package Manager)
- [Node.js](https://nodejs.org) (v18 or higher)
- A [WalletConnect](https://cloud.walletconnect.com) Project ID

## Getting Started

1. Install Bun (if you haven't already):

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. Clone the repository:

   ```bash
   git clone repo_url
   cd block-estate-app
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

4. Set up your environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and add your WalletConnect Project ID and optional RPC URLs:

   ```bash
   # Required
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here

   # Optional
   NEXT_PUBLIC_SEPOLIA_RPC_URL=your_sepolia_rpc_url
   ```

5. Start the development server:
   ```bash
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun format` - Format code with Prettier

## Git Workflow

The project uses Husky for Git hooks:

- Pre-commit: Runs Prettier and ESLint on staged files
- Commits will be blocked if there are any linting errors

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run `bun format` and `bun lint` to ensure code quality
4. Create a Pull Request

## License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.
