"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X, Discord } from "@/components/footer";

const Privacy = () => {
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
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-lg text-gray-700">
        At ClutchVault, we value your privacy. This page outlines how we collect, use, and protect your personal information.
      </p>
      <p className="text-lg text-gray-700 mt-4">
        For more details, please contact our support team.
      </p>
    </div>
  );
};

export default Privacy;