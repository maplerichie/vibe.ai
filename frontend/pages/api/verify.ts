import { NextApiRequest, NextApiResponse } from "next";
import { getUserIdentifier, SelfBackendVerifier } from "@selfxyz/core";
import { ethers } from "ethers";
import { abi } from "@/app/content/abi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { proof, publicSignals } = req.body;

      if (!proof || !publicSignals) {
        return res
          .status(400)
          .json({ message: "Proof and publicSignals are required" });
      }

      //   console.log("Proof:", proof);
      //   console.log("Public signals:", publicSignals);

      // Extract user ID from the proof
      //   const userId = await getUserIdentifier(publicSignals);
      //   console.log("Extracted userId:", userId);

      //   const address = await getUserIdentifier(publicSignals, "hex");
      //   console.log("Extracted address from verification result:", address);

      /*
      // Uncomment this to use the Self backend verifier for offchain verification instead
      const selfdVerifier = new SelfBackendVerifier(
        // "https://forno.celo.org",
        "vibe-humanity",
        "https://vibe.share.zrok.io/api/verify",
        "hex",
        true // If you want to use mock passport
      );
      selfdVerifier.setMinimumAge(18);
      selfdVerifier.excludeCountries("USA");
      const result = await selfdVerifier.verify(proof, publicSignals);
      console.log("Verification result:", result);

      if (result.isValid) {
        // Return successful verification response
        return res.status(200).json({
          status: "success",
          result: true,
          credentialSubject: result.credentialSubject,
        });
      } else {
        // Return failed verification response
        return res.status(500).json({
          status: "error",
          result: false,
          message: "Verification failed",
          details: result.isValidDetails,
        });
      }
        */

      // Contract details
      const contractAddress = "0x81d0B8E33C75E5EBd048a4200262Afd7eaEb013E";

      // Connect to Celo network
      const provider = new ethers.JsonRpcProvider(
        "https://alfajores-forno.celo-testnet.org"
      );
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const tx = await contract.verifySelfProof(
          {
            a: proof.a,
            b: [
              [proof.b[0][1], proof.b[0][0]],
              [proof.b[1][1], proof.b[1][0]],
            ],
            c: proof.c,
            pubSignals: publicSignals,
          },
          { gasLimit: 3000000 }
        );
        await tx.wait();
        console.log("Successfully called verifySelfProof function");
        res.status(200).json({
          status: "success",
          result: true,
          credentialSubject: {},
        });
      } catch (error) {
        console.error("Error calling verifySelfProof function:", error);
        res.status(400).json({
          status: "error",
          result: false,
          message: "Verification failed or date of birth not disclosed",
          details: {},
        });
        throw error;
      }
    } catch (error) {
      console.error("Error verifying proof:", error);
      return res.status(500).json({
        status: "error",
        message: "Error verifying proof",
        result: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
