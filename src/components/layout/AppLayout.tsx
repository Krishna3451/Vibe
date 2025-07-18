"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  preview?: React.ReactNode;
}

export function AppLayout({ children, preview }: AppLayoutProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [leftWidth, setLeftWidth] = useState(40); // 40% initially

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const container = document.getElementById('app-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Constrain between 20% and 80%
    const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80);
    setLeftWidth(constrainedWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add global mouse events when resizing
  if (typeof window !== 'undefined') {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }

  return (
    <div 
      id="app-container"
      className="flex h-screen bg-background overflow-hidden"
    >
      {/* Left Panel - Chat Interface */}
      <div 
        className="flex flex-col border-r border-border bg-card"
        style={{ width: `${leftWidth}%` }}
      >
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className={cn(
          "w-1 bg-border hover:bg-ring cursor-col-resize transition-colors",
          isResizing && "bg-ring"
        )}
        onMouseDown={handleMouseDown}
      />

      {/* Right Panel - Preview */}
      <div 
        className="flex flex-col bg-muted"
        style={{ width: `${100 - leftWidth}%` }}
      >
        <div className="flex-1 overflow-hidden">
          {preview || (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-xl font-semibold mb-2">Your website will appear here</h2>
                <p className="text-sm">Start a conversation to generate your first website</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 