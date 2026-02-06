"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending a password reset email
    setMessage(`If an account exists for ${email}, a password reset link has been sent.`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 bg-steel-dark rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-white mb-4">Forgot Password</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Enter your email address below, and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-steel-gray rounded bg-black text-white"
              placeholder="name@example.com"
            />
          </div>
          <Button type="submit" className="w-full bg-neon-green text-black hover:bg-neon-green/80">
            Send Reset Link
          </Button>
        </form>
        {message && <p className="mt-4 text-sm text-neon-green text-center">{message}</p>}
        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-muted-foreground hover:text-neon-green">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}