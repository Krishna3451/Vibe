"use client";

import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Code } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    role: "USER" | "ASSISTANT";
    type: "RESULT" | "ERROR";
    createdAt: Date;
    fragment?: {
      id: string;
      sandboxUrl: string;
      title: string;
      files: any;
    } | null;
  };
  isUser: boolean;
}

export function MessageBubble({ message, isUser }: MessageBubbleProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md text-sm font-medium",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isUser ? "U" : "AI"}
      </div>

      {/* Message Content */}
      <div className="flex-1 space-y-2">
        {/* Message bubble */}
        <div
          className={cn(
            "rounded-lg px-4 py-2 text-sm",
            isUser
              ? "bg-primary text-primary-foreground ml-12"
              : "bg-muted text-muted-foreground mr-12"
          )}
        >
          {/* Error styling */}
          {message.type === "ERROR" && (
            <div className="flex items-center gap-2 text-destructive mb-2">
              <span className="text-xs">⚠️ Error</span>
            </div>
          )}

          {/* Message content */}
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>

          {/* Fragment info */}
          {message.fragment && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Code className="h-3 w-3" />
                Generated Website
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(message.fragment!.sandboxUrl, "_blank")}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Live
                </Button>
                {message.fragment.files && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(message.fragment!.files, null, 2))}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Code
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={cn("text-xs text-muted-foreground", isUser && "text-right")}>
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
} 