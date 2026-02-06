"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InboxPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "John Doe", preview: "Hey, are you available for a quick call?", timestamp: new Date() },
    { id: 2, sender: "Jane Smith", preview: "Don't forget about the meeting tomorrow.", timestamp: new Date(Date.now() - 3600 * 1000) },
    { id: 3, sender: "Team Clutch Vault", preview: "Welcome to Clutch Vault! Let's get started.", timestamp: new Date(Date.now() - 86400 * 1000) },
  ]);
  const [isFull, setIsFull] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (messages.length >= 100) {
      setIsFull(true);
    } else {
      setIsFull(false);
    }
  }, [messages]);

  const deleteMessage = (id: number) => {
    setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
  };

  const deleteAllMessages = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-3xl font-bold">Inbox</h1>
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
      </div>
      <div className="p-6">
        <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all">
          <div className="divide-y divide-gray-600">
            {messages.map((message) => (
              <div
                key={message.id}
                className="p-4 hover:bg-gray-900 rounded-lg transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium text-lg">{message.sender}</h2>
                  </div>
                  <p className="text-gray-300 mt-2">{message.preview}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-400 mb-2">
                    {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                  </span>
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-center text-gray-500 py-6">No messages to display.</p>
            )}
          </div>
        </div>
      </div>
      <div className={`fixed bottom-16 right-6 flex items-center space-x-4 bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-700 transition-all ${isInboxOpen ? 'block' : 'hidden'}`}>
        <MessageSquare className="text-gray-400 hover:text-white w-6 h-6" />
        <div className="text-gray-400">
          {messages.length} / 100
        </div>
      </div>
      <button
        onClick={deleteAllMessages}
        className="fixed bottom-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-600 transition"
      >
        Delete All Messages
      </button>

      <Dialog open={isFull} onOpenChange={setIsFull}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Inbox is Full</DialogTitle>
          </DialogHeader>
          <p className="text-gray-500">Please delete some messages to make space.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}