import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();
import "@nomicfoundation/hardhat-ignition-ethers";
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yul: true,
        },
      },
      metadata: {
        bytecodeHash: "none",
      },
      viaIR: false,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  defaultNetwork: "hardhat",
  networks: {
    celo: {
      chainId: 44787,
      url: process.env.CELO_RPC_URL || "https://forno.celo.org",
      accounts: [process.env.CELO_KEY as string],
    },
    flow: {
      chainId: 545,
      url: process.env.FLOW_RPC_URL || "https://testnet.evm.nodes.onflow.org",
      accounts: [process.env.CELO_KEY as string],
    },
  },
  sourcify: {
    enabled: true,
  },
  etherscan: {
    apiKey: {
      celo: process.env.CELOSCAN_API_KEY as string,
      flow: "empty",
    },
    customChains: [
      {
        network: "celo",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io",
        },
      },
      {
        network: "flow",
        chainId: 545,
        urls: {
          apiURL: "https://evm-testnet.flowscan.io/api",
          browserURL: "https://evm-testnet.flowscan.io",
        },
      },
    ],
  },
};
export default config;
