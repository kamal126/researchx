"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [topic, setTopic] = useState("");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">
          AI Research Document Generator
        </h1>

        <CardContent>

          <Textarea
            rows={4}
            placeholder="Enter your research topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mb-4"
          />

          <Button className="w-full">Generate (Disabled for Day 1)</Button>

        </CardContent>
      </Card>
    </div>
  );
}
