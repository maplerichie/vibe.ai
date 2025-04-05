import { ethers } from "hardhat";
import { hashEndpointWithScope } from "@selfxyz/core";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // const nonce = await ethers.provider.getTransactionCount(deployer.address);
  // console.log("Account nonce:", nonce);

  // const futureAddress = ethers.getCreateAddress({
  //   from: deployer.address,
  //   nonce: nonce,
  // });
  // console.log("Calculated future contract address:", futureAddress);

  const VibeToken = await ethers.getContractFactory("Vibe");
  const vibeToken = await VibeToken.deploy();

  const vibe = await vibeToken.getAddress();

  const identityVerificationHub = "0x3e2487a250e2A7b56c7ef5307Fb591Cc8C83623D";

  const scope = hashEndpointWithScope(
    "https://1vl9nne766ha.share.zrok.io/api/verify",
    "vibe-humanity"
  );
  const attestationId = 1n;

  const olderThanEnabled = true;
  const olderThan = 18n;
  const forbiddenCountriesEnabled = false;
  const forbiddenCountriesListPacked = [0n, 0n, 0n, 0n] as [
    bigint,
    bigint,
    bigint,
    bigint
  ];
  const ofacEnabled = [false, false, false] as [boolean, boolean, boolean];

  const VibeVerifier = await ethers.getContractFactory("VibeVerifier");

  console.log("Deploying VibeVerifier...");
  const vibeVerifier = await VibeVerifier.deploy(
    identityVerificationHub,
    scope,
    attestationId,
    vibe,
    olderThanEnabled,
    olderThan,
    forbiddenCountriesEnabled,
    forbiddenCountriesListPacked,
    ofacEnabled
  );

  await vibeVerifier.waitForDeployment();

  const deployedAddress = await vibeVerifier.getAddress();
  console.log("Vibe deployed to:", vibe);
  console.log("VibeVerifier deployed to:", deployedAddress);
  await vibeToken.mint(deployedAddress, 1_000_000_000_000_000_000_000_000n);

  console.log("To verify on Celoscan:");
  console.log(
    `npx hardhat verify --network celo ${deployedAddress} ${identityVerificationHub} ${scope} ${attestationId} ${vibe} ${olderThanEnabled} ${olderThan} ${forbiddenCountriesEnabled} "[${forbiddenCountriesListPacked.join(
      ","
    )}]" "[${ofacEnabled.join(",")}]"`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
