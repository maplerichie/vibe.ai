"use client";

import { useAuthModal, useUser } from "@account-kit/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const user = useUser();
  const { openAuthModal } = useAuthModal();

  const handleGetStarted = () => {
    router.push("/app");
  };

  useEffect(() => {
    if (user) {
      router.push("/app");
    }
  }, [user]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero section with animated background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Vibe AI
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              An intelligent platform that identifies, analyzes, and rewards
              meaningful contributions within Web3 communities, creating
              alignment between value creation and value capture.
            </p>

            <div className="flex justify-center mb-12">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0, duration: 0.5 }}
                className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={openAuthModal}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Key Components
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-purple-100">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-purple-600"
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
            <h3 className="text-xl font-semibold mb-3 text-center">
              Multi-Platform Integration
            </h3>
            <p className="text-gray-600 text-center">
              Seamless deployment across Discord, Telegram, and other community
              platforms with unified analytics dashboard
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-indigo-100">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">
              AI-Powered Analysis
            </h3>
            <p className="text-gray-600 text-center">
              Advanced sentiment analysis and content quality assessment to
              identify genuine contributions
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-pink-100">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-pink-600"
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
            <h3 className="text-xl font-semibold mb-3 text-center">
              Dynamic Reward System
            </h3>
            <p className="text-gray-600 text-center">
              Customizable scoring mechanism with tiered rewards including
              tokens, NFTs, and governance rights
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-purple-100">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">
              Community Intelligence
            </h3>
            <p className="text-gray-600 text-center">
              Automated summarization of high-value discussions and knowledge
              base creation from quality inputs
            </p>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Community?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join the future of Web3 community engagement with intelligent
            contribution analysis and rewards.
          </p>
          <Button
            onClick={handleGetStarted}
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </main>
  );
}
