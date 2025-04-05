"use client";
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";
import { motion } from "framer-motion";
import SelfQRcodeWrapper, { SelfApp, SelfAppBuilder } from "@selfxyz/qrcode";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();
  const [address, setAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  );

  useEffect(() => {
    if (user?.address) {
      setAddress(user.address);
    }
  }, [user]);

  const selfApp = new SelfAppBuilder({
    appName: "Vibe.ai",
    scope: "Vibe-Humanity",
    endpoint: "https://imfjdprrk93t.share.zrok.io/api/verify",
    endpointType: "staging_https",
    userId: address,
    userIdType: "hex",
    disclosures: {
      date_of_birth: true,
      name: true,
      expiry_date: true,
    },
    devMode: true,
  } as Partial<SelfApp>).build();

  const handleSuccess = async () => {
    console.log("Verification successful");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      {signerStatus.isInitializing ? (
        <div className="animate-pulse">Loading...</div>
      ) : user ? (
        <div className="w-full max-w-2xl">
          <div className="flex justify-end mb-8">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => logout()}
            >
              Log out
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Welcome to Vibe.ai
              </h2>
              <p className="text-gray-600 mt-2">Let's get you connected</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Email</span>
                <span className="text-gray-900 font-medium">
                  {user.email ?? "Not provided"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Address</span>
                <span className="text-gray-900 font-medium">
                  {user.address ?? "Not connected"}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Step 1: Scan QR Code
                </h3>
                {selfApp && (
                  <div className="flex justify-center mb-6">
                    <SelfQRcodeWrapper
                      selfApp={selfApp}
                      type="websocket"
                      onSuccess={handleSuccess}
                    />
                  </div>
                )}
                <p className="flex justify-center text-sm text-gray-500 mt-4 text-center">
                  Verify humanity with&nbsp;&nbsp;
                  <Image
                    src="https://happy-birthday-rho-nine.vercel.app/self.svg"
                    alt="Verify"
                    width={48}
                    height={48}
                  />
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Step 2: Connect Omi
                </h3>
                <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Connect Omi
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Vibe.ai
            </h1>
            <p className="text-2xl text-gray-700">Connect, chat, and earn</p>
            <p className="text-lg text-gray-600">
              Leveraging Omi AI to analyze conversations and earn with positive
              communication. Transform your interactions into meaningful
              connections.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={openAuthModal}
          >
            Get Started
          </motion.button>
        </div>
      )}
    </main>
  );
}
