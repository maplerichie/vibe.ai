"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Sparkles, Gift } from "lucide-react";
import { toast } from "sonner";

interface LogEntry {
  id: number;
  message: string;
  type: "info" | "success" | "processing" | "reward";
  timestamp: Date;
}

const simulatorSteps = [
  {
    message: "🔍 Scanning Discord channels for recent conversations...",
    type: "info" as const,
    delay: 1000,
  },
  {
    message: "📥 Collecting conversation data from the last 24 hours...",
    type: "info" as const,
    delay: 2000,
  },
  {
    message: "🤖 Analyzing conversation content and context...",
    type: "processing" as const,
    delay: 3000,
  },
  {
    message:
      "✨ Conversation Summary:\n- Topic: Web3 Governance Discussion\n- Participants: 5\n- Key Points: DAO structure, voting mechanisms, treasury management\n- Sentiment: Positive and constructive",
    type: "info" as const,
    delay: 4000,
  },
  {
    message:
      "📊 Rating Metrics:\n- Contribution Quality: 9/10\n- Community Impact: 8/10\n- Technical Depth: 9/10\n- Overall Score: 8.7/10",
    type: "info" as const,
    delay: 5000,
  },
  {
    message: "🎁 Distributing rewards...",
    type: "processing" as const,
    delay: 6000,
  },
  {
    message:
      "✅ Rewards Distributed:\n- VIBE Tokens: 1,000\n- NFT: Legendary Governance Expert Badge\n- Traits: Rare background, Epic border, Legendary icon effect",
    type: "reward" as const,
    delay: 7000,
  },
  {
    message: "✨ Process completed successfully!",
    type: "success" as const,
    delay: 8000,
  },
];

export default function SimulatorPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDistributing, setIsDistributing] = useState(false);
  const [distributionResults, setDistributionResults] = useState<any>(null);

  const startSimulation = () => {
    setLogs([]);
    setCurrentStep(0);
    setIsRunning(true);
  };

  const distributeRewards = async () => {
    setIsDistributing(true);
    try {
      const response = await fetch("/api/distribute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      /*
      const data = await response.json();

      if (data.success) {
        setDistributionResults(data.results);
        toast.success(
          `Successfully distributed rewards to ${data.results.length} addresses`
        );

        // Add distribution results to logs
        const newLogs = data.results.map((result: any, index: number) => ({
          id: logs.length + index,
          message: `🎁 Distributed ${result.awardType} award to ${result.address}\n- NFT ID: ${result.nftId}\n- Transaction: ${result.transactionHash}`,
          type: "reward" as const,
          timestamp: new Date(),
        }));

        setLogs((prev) => [...prev, ...newLogs]);
      } else {
        toast.error("Failed to distribute rewards");
      }
        */
    } catch (error) {
      console.error("Error distributing rewards:", error);
      toast.error("Error distributing rewards");
    } finally {
      setIsDistributing(false);
    }
  };

  useEffect(() => {
    if (!isRunning || currentStep >= simulatorSteps.length) {
      setIsRunning(false);
      return;
    }
    if (currentStep == simulatorSteps.length - 2) {
      distributeRewards();
    }

    const step = simulatorSteps[currentStep];
    const timer = setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        {
          id: currentStep,
          message: step.message,
          type: step.type,
          timestamp: new Date(),
        },
      ]);
      setCurrentStep((prev) => prev + 1);
    }, step.delay);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep]);

  const getBadgeColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-500";
      case "success":
        return "bg-green-500";
      case "processing":
        return "bg-yellow-500";
      case "reward":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-600">AI Log</h1>
        <div className="flex gap-2">
          <Button
            onClick={startSimulation}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Start Simulation
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="bg-black/90 border-gray-800">
        <CardContent className="p-4">
          <ScrollArea className="h-[600px] w-full">
            <div className="space-y-4 font-mono text-sm">
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-start gap-3"
                  >
                    <Badge
                      className={`${getBadgeColor(
                        log.type
                      )} text-white px-2 py-1 rounded-full text-xs`}
                    >
                      {log.type.toUpperCase()}
                    </Badge>
                    <div className="flex-1 whitespace-pre-wrap text-gray-300">
                      {log.message}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {log.timestamp.toLocaleTimeString()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {(isRunning || isDistributing) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
