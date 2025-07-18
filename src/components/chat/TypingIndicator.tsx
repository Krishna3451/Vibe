"use client";

import { cn } from "@/lib/utils";

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md text-sm font-medium bg-muted text-muted-foreground">
        AI
      </div>

      {/* Typing indicator */}
      <div className="flex-1 space-y-2">
        <div className="rounded-lg px-4 py-2 text-sm bg-muted text-muted-foreground mr-12">
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
} 