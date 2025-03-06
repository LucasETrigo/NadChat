<p align="center">
  <img src="./public/logo.png" alt="NadChat Logo" width="150"/>
</p>

# NadChat

<p align="center"><em>Fast, Private Messaging on Monad Testnet</em></p>

<p align="center">
  <a href="https://monad.xyz"><img src="https://img.shields.io/badge/Built%20on-Monad-purple" alt="Monad"></a>
  <a href="https://privy.io"><img src="https://img.shields.io/badge/Auth-Privy-blue" alt="Privy"></a>
</p>

**NadChat** is a decentralized messaging dApp on the Monad Testnet, leveraging its 10k TPS and 1-second block times for a seamless, privacy-first communication experience. With Privy’s wallet-based authentication, users can log in effortlessly, create profiles, manage friends, and send messages—all secured on-chain. Built for crypto enthusiasts and newcomers, NadChat showcases Monad’s high-performance EVM with a sleek, intuitive interface.

---

## ✨ Features

- **Instant Login**: Privy-powered wallet auth for frictionless onboarding.
- **Personal Profiles**: Set a username and (optional) IPFS-hosted image.
- **Friend System**: Add/remove friends with on-chain tracking.
- **Real-Time Chat**: Send/receive messages in under a second.
- **Decentralized & Private**: No servers, full user control via Monad.

---

## 🛠️ Technical Overview

### Architecture

NadChat is a full-stack decentralized application:

- **Smart Contract**: `NadChat.sol` handles all logic on Monad Testnet.
- **Frontend**: Next.js 15 with React components for a dynamic UI.
- **Auth**: Privy for seamless wallet integration.
- **No Off-Chain**: Fully on-chain, leveraging Monad’s capabilities.

### Tech Stack

| **Category**      | **Tools**                                                                 |
|--------------------|--------------------------------------------------------------------------|
| **Frontend**      | Next.js 15, React 19, Tailwind CSS, Framer Motion, Lucide React         |
| **Blockchain**    | ethers.js, Monad Testnet (Chain ID: 10143)                              |
| **Auth**          | Privy (@privy-io/react-auth)                                            |
| **Utilities**     | react-hot-toast, @pinata/sdk (future IPFS), clsx, tailwind-merge        |
| **Dev Tools**     | Hardhat, TypeScript, PostCSS, @nomicfoundation/hardhat-toolbox          |

*Full list in `package.json`.*

### Smart Contract

- **Address**: `0x797BD798E2C96EBd66DE171BBf452D7ed38e1158`
- **Core Functions**:
  - `createAccount(string name, string profileImage, bool isPublic)`: Registers users with a profile.
  - `addFriend(address friend_key)`: Adds a friend to your list.
  - `sendMessage(address friend_key, string _msg)`: Sends a message, stored on-chain.
  - `readMessage(address friend_key, uint256 start, uint256 count)`: Fetches paginated chat history.
- **Design**: Lightweight, optimized for Monad’s parallel execution and low gas costs.

### Frontend Design

- **Components**:
  - `Auth.tsx`: Manages login, profile creation, and updates.
  - `Chat.tsx`: Renders friend lists and real-time messages.
  - `AllUsers.tsx`: Displays public users for friend requests.
- **State**: `UserContext.tsx` centralizes user data with React Context.
- **UI**: Tailwind CSS for responsive design, Framer Motion for smooth animations.

### Leveraging Monad’s Accelerated EVM

- **Speed**: 1-second block times enable near-instant message delivery.
- **Scalability**: 10k TPS supports high-volume messaging without bottlenecks.
- **Efficiency**: Low gas fees make frequent interactions affordable.
- **EVM Power**: Standard Solidity deployment with enhanced performance.

---

## 🔧 Implementation Details

### Core Functionality

1. **Authentication**:
   - Privy logs users in via wallet (`ClientWrapper.tsx`).
   - Checks `checkUserExists` and prompts `createAccount` if new (`Auth.tsx`).
2. **Messaging**:
   - `sendMessage` writes to the blockchain in ~1s (`Chat.tsx`).
   - `readMessage` retrieves chats with pagination for efficiency.
3. **Social Features**:
   - `addFriend` and `getMyFriendList` manage relationships (`AllUsers.tsx`, `Chat.tsx`).

### Design Choices

- **Monad**: Outperforms slower EVM chains (e.g., Ethereum’s 15s blocks), ideal for real-time apps.
- **Privy**: Simplifies UX, targeting crypto newcomers for mass adoption.
- **Next.js 15**: Balances SSR and client-side rendering for performance and SEO.
- **Decentralized**: No off-chain dependencies, fully reliant on Monad.

### External Dependencies

- **Privy**: `@privy-io/react-auth` for wallet auth.
- **ethers.js**: `ethers` for contract calls.
- **Pinata**: `@pinata/sdk` (planned for IPFS image uploads, not yet active).
- **UI Enhancements**: Tailwind CSS, Framer Motion, Lucide React.

---
