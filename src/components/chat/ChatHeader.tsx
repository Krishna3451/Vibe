"use client";

import { Button } from "@/components/ui/button";
import { Settings, Plus } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface ChatHeaderProps {
  projectId?: string;
}

export function ChatHeader({ projectId }: ChatHeaderProps) {
  const trpc = useTRPC();
  
  const { data: project } = useQuery({
    ...trpc.projects.getById.queryOptions({ id: projectId || "" }),
    enabled: !!projectId,
  });

  return (
    <div className="border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {project?.name?.charAt(0)?.toUpperCase() || "D"}
          </div>
          <div>
            <h2 className="text-sm font-semibold">
              {project?.name || "Default Project"}
            </h2>
            <p className="text-xs text-muted-foreground">
              AI Website Builder
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 