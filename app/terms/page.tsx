"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X, Discord } from "@/components/footer";

const Terms = () => {
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
      <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
      <p className="text-lg text-gray-700">
        Welcome to ClutchVault! By using our platform, you agree to abide by our terms and conditions.
      </p>
      <p className="text-lg text-gray-700 mt-4">
        Please read these terms carefully. If you have any questions, feel free to reach out to us.
      </p>
    </div>
  );
};

export default Terms;