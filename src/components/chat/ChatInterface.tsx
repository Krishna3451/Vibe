"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageBubble } from "./MessageBubble";
import { ChatHeader } from "./ChatHeader";
import { TypingIndicator } from "./TypingIndicator";

interface ChatInterfaceProps {
  projectId?: string;
}

export function ChatInterface({ projectId }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();

  const { data: messages, isLoading } = useQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        setMessage("");
        toast.success("Message sent");
      },
      onError: (error) => {
        toast.error("Failed to send message: " + error.message);
      },
    })
  );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    createMessage.mutate({
      value: message,
      projectId,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ChatHeader projectId={projectId} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Loading messages...</div>
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
              <p className="text-sm">
                Type a message below to start building your website with AI
              </p>
            </div>
          </div>
        ) : (
          messages?.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isUser={msg.role === "USER"}
            />
          ))
        )}

        {/* Typing indicator */}
        {createMessage.isPending && <TypingIndicator />}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe the website you want to build..."
            disabled={createMessage.isPending}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={createMessage.isPending || !message.trim()}
          >
            {createMessage.isPending ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
} 