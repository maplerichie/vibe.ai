"use client";
import { useLogout, useSignerStatus, useUser } from "@account-kit/react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScoreHistory {
  date: string;
  score: number;
  tokens: number;
  status: "completed" | "processing" | "pending";
}

export default function HomePage() {
  const user = useUser();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();

  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([
    {
      date: "Apr 5, 2024",
      score: 85,
      tokens: 25,
      status: "completed",
    },
    {
      date: "Apr 4, 2024",
      score: 78,
      tokens: 20,
      status: "completed",
    },
    {
      date: "Apr 3, 2024",
      score: 92,
      tokens: 30,
      status: "completed",
    },
  ]);

  const [processingStatus, setProcessingStatus] = useState({
    isProcessing: true,
    progress: 0,
    message: "Collecting conversation data...",
    timeRemaining: "~2 hours",
  });

  // Simulate processing progress
  useEffect(() => {
    if (!processingStatus.isProcessing) return;

    const interval = setInterval(() => {
      setProcessingStatus((prev) => {
        if (prev.progress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            isProcessing: false,
            progress: 100,
            message: "Processing complete!",
            timeRemaining: "0 minutes",
          };
        }

        // Increment progress
        const newProgress = Math.min(prev.progress + 5, 100);

        // Update message based on progress
        let message = prev.message;
        if (newProgress < 30) {
          message = "Collecting conversation data...";
        } else if (newProgress < 60) {
          message = "Analyzing sentiment and tone...";
        } else if (newProgress < 90) {
          message = "Calculating positivity scores...";
        } else {
          message = "Finalizing rewards...";
        }

        // Update time remaining
        const remainingMinutes = Math.max(
          120 - Math.floor((newProgress / 100) * 120),
          0
        );
        const timeRemaining =
          remainingMinutes > 60
            ? `~${Math.floor(remainingMinutes / 60)} hour${
                Math.floor(remainingMinutes / 60) > 1 ? "s" : ""
              }`
            : `~${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;

        return {
          ...prev,
          progress: newProgress,
          message,
          timeRemaining,
        };
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [processingStatus.isProcessing]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, John! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Your positivity dashboard for today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-purple-100 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Profile Summary
          </h2>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-md mr-4">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">John Doe</p>
              <p className="text-sm text-gray-600">@johndoe</p>
              <p className="text-sm text-gray-600 overflow-hidden text-ellipsis">
                {user?.address ?? "0xDeF1...1234"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-white to-indigo-50 border-indigo-100 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Total Rewards
          </h2>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center text-white shadow-md mr-4">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">75 Tokens</p>
              <p className="text-sm text-gray-600">Earned this month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-white to-green-50 border-green-100 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Today's Score
          </h2>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-md mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Processing</p>
              <p className="text-sm text-gray-600">Updated daily at midnight</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Processing Animation Section */}
      <Card className="p-6 mb-8 bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Today's Conversation Analysis
        </h2>

        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h3 className="text-md font-medium text-gray-900">
                {processingStatus.message}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Estimated completion: {processingStatus.timeRemaining}
              </p>
            </div>

            <div className="mt-3 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {processingStatus.progress}% Complete
              </span>
            </div>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${processingStatus.progress}%` }}
            ></div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
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
                  <p className="text-sm font-medium text-gray-900">Messages</p>
                  <p className="text-xs text-gray-600">Processing 127 today</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Positivity
                  </p>
                  <p className="text-xs text-gray-600">Analyzing tone</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Rewards</p>
                  <p className="text-xs text-gray-600">Calculating tokens</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-8 shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Score History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tokens
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scoreHistory.map((entry, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.tokens}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        entry.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : entry.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {entry.status === "completed"
                        ? "Completed"
                        : entry.status === "processing"
                        ? "Processing"
                        : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tips to Improve Your Score
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <span className="text-gray-700">
                Use positive language and avoid negative words
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <span className="text-gray-700">
                Show empathy and understanding in conversations
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <span className="text-gray-700">
                Help others and share knowledge
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <span className="text-gray-700">
                Be respectful and considerate of others' opinions
              </span>
            </li>
          </ul>
        </Card>

        <Card className="p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Achievements
          </h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 text-lg">🌟</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Positivity Champion</p>
                <p className="text-sm text-gray-600">
                  Maintained a score above 80 for 7 days
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 text-lg">💬</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Conversation Starter
                </p>
                <p className="text-sm text-gray-600">
                  Initiated 50 positive conversations
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 text-lg">🎯</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Consistency Master</p>
                <p className="text-sm text-gray-600">
                  Logged in for 30 consecutive days
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
