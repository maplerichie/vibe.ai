import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy VibeToken
  console.log("Deploying VibeToken...");
  const VibeToken = await ethers.getContractFactory("VibeToken");
  const vibeToken = await VibeToken.deploy();
  await vibeToken.waitForDeployment();
  console.log("VibeToken deployed to:", await vibeToken.getAddress());

  // Deploy VibeNFT
  console.log("Deploying VibeNFT...");
  const VibeNFT = await ethers.getContractFactory("VibeNFT");
  const vibeNFT = await VibeNFT.deploy();
  await vibeNFT.waitForDeployment();
  console.log("VibeNFT deployed to:", await vibeNFT.getAddress());

  // Deploy VibeRewardManager
  console.log("Deploying VibeRewardManager...");
  const VibeRewardManager = await ethers.getContractFactory(
    "VibeRewardManager"
  );
  const vibeRewardManager = await VibeRewardManager.deploy(
    await vibeToken.getAddress(),
    await vibeNFT.getAddress()
  );
  await vibeRewardManager.waitForDeployment();
  console.log(
    "VibeRewardManager deployed to:",
    await vibeRewardManager.getAddress()
  );

  // Set reward manager
  try {
    console.log("Setting reward manager...");
    await vibeToken.setRewardManager(await vibeRewardManager.getAddress());
    await vibeNFT.setRewardManager(await vibeRewardManager.getAddress());
    console.log("Reward manager set");
  } catch (e) {
    console.log("Reward manager set failed");
  }
  // Set initial award token amounts
  console.log("Setting initial award token amounts...");
  const awardAmounts = {
    0: ethers.parseEther("1000"), //TOP_CONTRIBUTOR
    1: ethers.parseEther("500"), //COMMUNITY_STAR
    2: ethers.parseEther("2000"), //INNOVATION_AWARD
    3: ethers.parseEther("750"), //GOVERNANCE_EXPERT
  };

  for (const [awardType, amount] of Object.entries(awardAmounts)) {
    await vibeRewardManager.setAwardTokenAmount(awardType, amount);
    console.log(
      `Set ${awardType} award amount to ${ethers.formatEther(amount)} VIBE`
    );
  }

  console.log("Deployment complete!");
  console.log({
    vibeToken: await vibeToken.getAddress(),
    VibeNFT: await vibeNFT.getAddress(),
    vibeRewardManager: await vibeRewardManager.getAddress(),
  });

  console.log("To verify on Celoscan:");
  console.log(
    `npx hardhat verify --network flow ${await vibeRewardManager.getAddress()} ${await vibeToken.getAddress()} ${await vibeNFT.getAddress()}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
