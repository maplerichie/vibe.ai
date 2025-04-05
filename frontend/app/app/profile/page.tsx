"use client";
import { useUser } from "@account-kit/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import SelfQRcodeWrapper, { SelfAppBuilder, SelfApp } from "@selfxyz/qrcode";

interface UserProfile {
  name: string;
  username: string;
  email: string;
  discordConnected: boolean;
  discordUsername?: string;
  verified: boolean;
}

export default function ProfilePage() {
  const user = useUser();
  const [address, setAddress] = useState(
    "0xDeF1000000000000000000000000000000001234"
  );

  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    discordConnected: false,
    verified: false,
  });

  const handleDiscordConnect = () => {
    // TODO: Implement Discord OAuth flow
    setProfile((prev) => ({
      ...prev,
      discordConnected: true,
      discordUsername: "johndoe#1234",
    }));
  };

  useEffect(() => {
    if (user?.address) {
      setAddress(user.address);
    }
  }, [user]);

  const selfApp = new SelfAppBuilder({
    appName: "Vibe.ai",
    scope: "Vibe-Humanity",
    endpoint: "https://1vl9nne766ha.share.zrok.io/api/verify",
    endpointType: "https",
    userId: address,
    userIdType: "hex",
    disclosures: {
      // minimumAge: 18,
      // name: true,
    },
    // devMode: true,
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
          Manage your account and connections
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

              {!profile.verified && <div className="h-6 mb-4"></div>}

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
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Joined</span>
                <span className="font-medium text-gray-900">April 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Servers</span>
                <span className="font-medium text-gray-900">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Score</span>
                <span className="font-medium text-gray-900">85</span>
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
              Discord Connection
            </h2>

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
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    Connect Your Discord Account
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Connect your Discord account to start earning rewards for
                    your positive conversations
                  </p>
                  <Button
                    onClick={handleDiscordConnect}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                  >
                    Connect Discord
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Connected Servers
              </h3>
              {profile.discordConnected ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium">G</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Gaming Community
                        </p>
                        <p className="text-sm text-gray-600">
                          Active since Apr 1, 2024
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-medium">D</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Developer Hub
                        </p>
                        <p className="text-sm text-gray-600">
                          Active since Apr 3, 2024
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                  Connect your Discord account to see your servers
                </div>
              )}
            </div>
          </Card>

          {/* QR Code Verification Section */}
          {!profile.verified && (
            <Card className="p-6 mt-6 shadow-md">
              <h2 className="flex row text-xl font-semibold mb-6 text-gray-900">
                Verify humanity with&nbsp;&nbsp;{" "}
                <Image
                  src="https://happy-birthday-rho-nine.vercel.app/self.svg"
                  alt="Verify"
                  width={48}
                  height={48}
                />
              </h2>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-100">
                <div className="text-center">
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
                    Start earning rewards for your positive conversations
                  </p>
                  <Button
                    onClick={() =>
                      setProfile((prev) => ({ ...prev, verified: true }))
                    }
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md"
                  >
                    Verify Identity
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-end mt-6">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md px-6">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
