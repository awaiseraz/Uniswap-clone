# 🦄 Mini AMM DEX (Uniswap V2 Style)

This project is a minimalistic Automated Market Maker (AMM) implementation inspired by **Uniswap V2**.  
It includes contracts for creating trading pairs, adding/removing liquidity, and swapping tokens with a constant product market maker model.

---

## 📂 Project Structure

- **contracts/**
  - `PairFactory.sol` → Deploys and tracks token pairs using `CREATE2`.
  - `TokenPair.sol` → Core pair contract handling:
    - Liquidity provision (mint/burn LP tokens)
    - Swaps with constant product rule
    - Protocol fee reward
  - `AMMRouter.sol` → High-level router:
    - Add/remove liquidity
    - Swap exact tokens or for exact tokens
  - `libraries/Helper.sol` → Utility functions:
    - Pair address calculation
    - Swap math formulas
    - Quote formula
    - Safe ERC20 transfers
- **interfaces/** → Minimal interfaces for router, factory, pair.

---

## ⚙️ Core Concepts

### 1. Constant Product Formula
The AMM is based on the **invariant**:
\[
x . y = k
\]
Where:
- `x` = reserve of token A  
- `y` = reserve of token B  
- `k` = constant product  

Swaps must preserve this invariant (after applying fees).

---

### 2. Protocol / LP Rewards

- Each **swap** on this DEX charges a **0.2% fee** (different from Uniswap’s 0.3%).  
- Out of this fee:  
  - **Liquidity Providers (LPs)** receive the majority of the reward.  
  - The **protocol reward mechanism** can be optionally enabled.  

- If the **protocol reward is enabled**:  
  - **10% of the collected swap fee (0.2%)** is sent to the protocol (`rewardTo` address).  
  - The remaining **90%** of the fee is distributed to LPs.  

- If the **protocol reward is disabled**:  
  - The **entire 0.2% fee** is distributed to LPs.  

- On multi-hop swaps (e.g., `TokenA → TokenB → TokenC`), the **0.2% fee is applied on each hop**, and protocol rewards are calculated accordingly.  

#### Example

- User swaps **1000 USDT → ETH** (single hop).  
- Trading fee = `1000 × 0.2% = 2 USDT`.  
  - If **protocol reward ON** → `0.2 USDT` (10% of 2) goes to the protocol, `1.8 USDT` to LPs.  
  - If **protocol reward OFF** → `2 USDT` goes entirely to LPs.  


---

## 🛠️ How to Run

1. Install dependencies:
   ```bash
   npm install
