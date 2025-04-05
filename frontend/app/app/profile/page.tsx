"use client";
import { useUser } from "@account-kit/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import SelfQRcodeWrapper, { SelfAppBuilder, SelfApp } from "@selfxyz/qrcode";
import { logo } from "@/app/content/logo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UserProfile {
  name: string;
  username: string;
  email: string;
  discordConnected: boolean;
  discordUsername?: string;
  telegramConnected: boolean;
  telegramUsername?: string;
  verified: boolean;
  contributionTypes: {
    technical: number;
    community: number;
    governance: number;
  };
}

export default function ProfilePage() {
  const user = useUser();
  const [address, setAddress] = useState(
    "0xdeF1000000000000000000000000000000001234"
  );
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    discordConnected: false,
    telegramConnected: false,
    verified: false,
    contributionTypes: {
      technical: 45,
      community: 30,
      governance: 25,
    },
  });

  const handleDiscordConnect = () => {
    // TODO: Implement Discord OAuth flow
    setProfile((prev) => ({
      ...prev,
      discordConnected: true,
      discordUsername: "johndoe#1234",
    }));
  };

  const handleTelegramConnect = () => {
    // TODO: Implement Telegram OAuth flow
    setProfile((prev) => ({
      ...prev,
      telegramConnected: true,
      telegramUsername: "@johndoe",
    }));
  };

  useEffect(() => {
    if (user?.address) {
      setAddress(user.address);
    }
  }, [user]);

  const selfApp = new SelfAppBuilder({
    appName: "Vibe AI",
    scope: "vibe-humanity",
    endpoint: "https://vibe.share.zrok.io/api/verify",
    logoBase64: logo,
    userId: address,
    userIdType: "hex",
    disclosures: {
      minimumAge: 18,
    },
    devMode: true,
  } as Partial<SelfApp>).build();

  const handleSuccess = async () => {
    console.log("Verification successful");
    setProfile((prev) => ({ ...prev, verified: true }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your Web3 community presence and connections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <div className="md:col-span-1">
          <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-purple-100 shadow-md">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-md mb-4">
                <span className="text-4xl">👤</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.name}
              </h2>
              <p className="text-gray-600 mb-1">@{profile.username}</p>

              {profile.verified && (
                <div className="flex items-center mt-1 mb-4">
                  <span className="text-sm text-green-600 mr-1">
                    Verified with
                  </span>
                  <div className="relative">
                    <Image
                      src="https://happy-birthday-rho-nine.vercel.app/self.svg"
                      alt="Self Protocol"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              {!profile.verified && (
                <div className="flex flex-col items-center mt-1 mb-4">
                  <Button
                    onClick={() => setShowVerificationModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white mb-2"
                  >
                    Prove your&nbsp;
                    <span className="text-emerald-300">Self</span>
                  </Button>
                </div>
              )}

              <div className="w-full h-1 bg-gray-200 rounded-full mb-2">
                <div
                  className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">Profile completion: 75%</p>
            </div>
          </Card>

          <Card className="p-6 mt-6 bg-gradient-to-br from-white to-indigo-50 border-indigo-100 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Contribution Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Technical</span>
                <span className="font-medium text-gray-900">
                  {profile.contributionTypes.technical}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Community</span>
                <span className="font-medium text-gray-900">
                  {profile.contributionTypes.community}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Governance</span>
                <span className="font-medium text-gray-900">
                  {profile.contributionTypes.governance}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total VIBE Tokens</span>
                <span className="font-medium text-gray-900">1,250</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile main content */}
        <div className="md:col-span-2">
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Personal Information
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 mt-6 shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Platform Connections
            </h2>

            <div className="space-y-4">
              {/* Discord Connection */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
                {profile.discordConnected ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Connected to Discord
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.discordUsername}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setProfile((prev) => ({
                          ...prev,
                          discordConnected: false,
                        }))
                      }
                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Connect Discord
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Link your Discord account to track contributions and earn
                      rewards
                    </p>
                    <Button
                      onClick={handleDiscordConnect}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Connect Discord
                    </Button>
                  </div>
                )}
              </div>

              {/* Telegram Connection */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-100">
                {profile.telegramConnected ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Connected to Telegram
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.telegramUsername}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setProfile((prev) => ({
                          ...prev,
                          telegramConnected: false,
                        }))
                      }
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Connect Telegram
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Link your Telegram account to track contributions and earn
                      rewards
                    </p>
                    <Button
                      onClick={handleTelegramConnect}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Connect Telegram
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog
        open={showVerificationModal}
        onOpenChange={setShowVerificationModal}
      >
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex text-black">
              Verify with&nbsp;&nbsp;
              <Image
                src="https://happy-birthday-rho-nine.vercel.app/self.svg"
                alt="Self Protocol"
                width={48}
                height={48}
                className="object-contain"
              />
            </DialogTitle>
            <DialogDescription className="text-black">
              Scan the QR code with your Self app to verify your identity
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <SelfQRcodeWrapper selfApp={selfApp} onSuccess={handleSuccess} />
            <div className="w-full border-t border-gray-200 my-4" />
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Don't have Self?</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <a
                  href="https://apps.apple.com/us/app/self-zk/id6478563710"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.proofofpassportapp&amp;pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
