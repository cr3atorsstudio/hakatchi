import GraveNFTAbi from "@/abi/GraveNFT.json"; // Adjust path as needed
import { ethers } from "ethers";

export class NFTService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    // Check for required environment variables
    if (!process.env.ARBITRUM_RPC_URL) {
      throw new Error("ARBITRUM_RPC_URL environment variable is not set");
    }
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY environment variable is not set");
    }
    if (!process.env.GRAVE_NFT_CONTRACT_ADDRESS) {
      throw new Error(
        "GRAVE_NFT_CONTRACT_ADDRESS environment variable is not set"
      );
    }

    // Connect to Arbitrum network
    this.provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_RPC_URL);

    // Create wallet from private key
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);

    // Create contract instance
    this.contract = new ethers.Contract(
      process.env.GRAVE_NFT_CONTRACT_ADDRESS,
      GraveNFTAbi.abi,
      this.wallet
    );
  }

  /**
   * Mint and assign a new grave NFT to a user
   * @param userAddress User's wallet address
   * @returns Token ID of the minted NFT
   */
  async mintGraveForUser(userAddress: string): Promise<number> {
    try {
      // Validate address
      if (!ethers.isAddress(userAddress)) {
        throw new Error("Invalid Ethereum address");
      }

      // Estimate gas
      const gasEstimate = await this.contract.mintGraveFor.estimateGas(
        userAddress
      );
      // Add some buffer
      const adjustedGas = Math.floor(Number(gasEstimate) * 1.2);

      // Send transaction
      const tx = await this.contract.mintGraveFor(userAddress, {
        gasLimit: adjustedGas,
      });

      // Wait for transaction to complete
      const receipt = await tx.wait();

      // Extract token ID from event
      const event = receipt.logs
        .map((log: any) => {
          try {
            return this.contract.interface.parseLog(log);
          } catch (e) {
            return null;
          }
        })
        .find((event: any) => event && event.name === "GraveMinted");

      if (!event) {
        throw new Error("Failed to find GraveMinted event in transaction logs");
      }

      const tokenId = event.args.tokenId.toString();

      console.log(`Successfully minted NFT #${tokenId} for ${userAddress}`);
      return parseInt(tokenId);
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    }
  }
}
