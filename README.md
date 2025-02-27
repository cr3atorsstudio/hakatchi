# HAKATCHI 🪦  
**An On-Chain Tamagotchi Where You Take Care of a Digital Grave**  

🔗 **Live App:** [hakatchi.vercel.app](https://hakatchi.vercel.app/)  
🔗 **Smart Contract:** [Arbiscan](https://arbiscan.io/address/0x09F480718ED735f8A1A6a7b3fea186f54e40B2ac)  
🔗 **NFT Collection:** [OpenSea](https://opensea.io/collection/hakatchi)  
🔗 **Celestia Action Logs:** [Celenium Explorer](https://mocha-4.celenium.io/namespace/000000000000000000000000000000000000000048414b6154434845?tab=Blobs)  

---

## **Overview**  

**HAKATCHI** is a **fully on-chain Tamagotchi-like grave-caring game** where each **grave** has stats that change in real-time:  

- 🟢 **Energy** – Depletes if not fed  
- 🫧 **Cleanliness** – Gets dirty over time  
- 💛 **Affection** – Drops if neglected  

Your grave **interacts with other graves in the world**, affecting each other's states in real-time.  

---

## **How It Works**  

| Action      | Effect  |
|------------|---------|
| 🍚 **Feed** | +20 Energy, -5 Cleanliness, +3 Affection |
| 🧹 **Clean** | +20 Cleanliness |
| 🎭 **Play** | -10 Energy, -10 Cleanliness, +10 Affection |
| ⏳ **Time Decay** | -5 Energy, -3 Cleanliness, -1 Affection per cycle |
| 🪦 **Grave-to-Grave Interactions** | Nearby graves **influence each other** in real-time |

---

## **Architecture**  

The diagram below illustrates how **Next.js, Argus World Engine, EVM (Arbitrum), and Celestia** interact:  
 ![hakatchi-2025-02-27-053942](https://github.com/user-attachments/assets/0dcaca1f-418d-4320-91ea-7e9570c3a17b)


### **Key Features**
- **Next.js App**: User interacts with their grave through a web-based interface.  
- **Argus World Engine**:  
  - **Houses all mutable grave states** (Energy, Cleanliness, Affection).  
  - **Graves interact with each other** in real-time (one grave’s state can affect others nearby).  
- **EVM (Arbitrum)**: Handles **NFT ownership and smart contract-based interactions**.  
- **Celestia**: Stores **all grave action logs**, which can be used by **other apps, not just HAKATCHI**.  

---

## **Folder Structure**  

```
hakatchi/
│── contracts/          # Contains Solidity smart contracts
│── hakatchi_engine/    # Contains Argus World Engine game logic
│── frontend/           # Next.js-based web app
│── scripts/            # Deployment and testing scripts
│── README.md           # This file
```

## **Gameplay Demo**  

TODO: demo

---

## **License & Contributions**  

📜 **MIT License** – Open-source, free to use  
💡 **Want to contribute?** Fork, improve, and submit a PR! 🚀  

