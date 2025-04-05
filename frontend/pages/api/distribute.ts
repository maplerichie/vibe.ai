import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

const VIBE_REWARD_MANAGER_ADDRESS = process.env.REWARD_MANAGER || "";

const VIBE_REWARD_MANAGER_ABI = [
  "function mintNFT(address to, uint8 awardType, bool withToken, string memory description) external",
  "function mintToken(address to, uint256 tokenAmount) external",
];

// Award types from the VibeRewardManager contract
enum AwardType {
  TOP_CONTRIBUTOR = 0,
  COMMUNITY_STAR = 1,
  INNOVATION_AWARD = 2,
  GOVERNANCE_EXPERT = 3,
}

// Award descriptions
const awardDescriptions = {
  [AwardType.TOP_CONTRIBUTOR]:
    "Recognized for exceptional contributions to the community",
  [AwardType.COMMUNITY_STAR]:
    "Awarded for outstanding community engagement and support",
  [AwardType.INNOVATION_AWARD]: "Honored for innovative ideas and solutions",
  [AwardType.GOVERNANCE_EXPERT]:
    "Acknowledged for expertise in governance and decision-making",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Generate 2-3 random addresses
    const numAddresses = Math.floor(Math.random() * 2) + 2;
    // Connect to the blockchain
    const provider = new ethers.JsonRpcProvider(process.env.FLOW_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

    // Generate random addresses instead of using the same wallet address
    const addresses = new Array(numAddresses).fill(wallet.address);

    const vibeRewardManager = new ethers.Contract(
      VIBE_REWARD_MANAGER_ADDRESS,
      VIBE_REWARD_MANAGER_ABI,
      wallet
    );

    // Distribute rewards to each address
    const results = await Promise.all(
      addresses.map(async (address, index) => {
        // Select a random award type
        const awardType = Math.floor(Math.random() * 3) as AwardType;
        const description = awardDescriptions[awardType];

        // Randomly decide whether to mint NFT with token or just token
        const withToken = Math.random() > 0.5;

        let transactionHash = "";
        let nftId = null;

        if (withToken) {
          // Mint NFT with token
          console.log("MintNFT", address, awardType, description);
          const tx = await vibeRewardManager.mintNFT(
            address,
            awardType,
            true,
            description,
            { gasLimit: 600_000 }
          );

          // Wait for transaction to be mined
          const receipt = await tx.wait();
          console.log("MintNFT", receipt.hash);
          transactionHash = receipt.hash;

          // Get the NFT ID from the event logs
          // const event = receipt.logs.find(
          //   (log: ethers.Log) =>
          //     log.topics[0] ===
          //     ethers.id("NFTDistributed(address,uint8,uint256,uint256)")
          // );

          // if (event) {
          //   try {
          //     const iface = new ethers.Interface(VIBE_REWARD_MANAGER_ABI);
          //     const decodedEvent = iface.parseLog(event);
          //     if (decodedEvent) {
          //       nftId = decodedEvent.args[3]; // nftId is the 4th argument
          //     }
          //   } catch (error) {
          //     console.error("Error parsing event log:", error);
          //   }
          // }
        } else {
          // Just mint token
          console.log("MintToken", address);
          const tokenAmount = ethers.parseEther("100"); // Example amount
          const tx = await vibeRewardManager.mintToken(address, tokenAmount, {
            gasLimit: 300_000,
          });

          // Wait for transaction to be mined
          const receipt = await tx.wait();
          console.log("MintToken", receipt.hash);
          transactionHash = receipt.hash;
        }

        // Return the result object
        return {
          address,
          awardType: AwardType[awardType],
          description,
          withToken,
          transactionHash,
          // nftId: nftId ? nftId.toString() : null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: `Distributed rewards to ${numAddresses} addresses`,
      results,
    });
  } catch (error) {
    console.error("Error distributing rewards:", error);
    return res.status(500).json({
      error: "Failed to distribute rewards",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
