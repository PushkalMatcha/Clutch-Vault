"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X, Discord } from "@/components/footer";

const Rules = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10">
      <a onClick={() => router.back()} className="flex items-center text-sm text-neon-green hover:underline cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-4 h-4 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Go back
      </a>
      <h1 className="text-4xl font-bold mb-4">Rules</h1>
      <p className="text-lg text-gray-700">
        Welcome to the Rules page. Here you will find all the guidelines and rules for participating in ClutchVault tournaments.
      </p>
      <p className="text-lg text-gray-700 mt-4">
        Please ensure you read and understand these rules before joining any tournament. If you have any questions, feel free to contact us.
      </p>
    </div>
  );
};

export default Rules;