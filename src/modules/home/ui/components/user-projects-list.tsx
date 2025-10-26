"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderIcon, ClockIcon, MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { formatDistance } from "date-fns";

export function UserProjectsList() {
  const trpc = useTRPC();
  const { data: projects } = useSuspenseQuery(
    trpc.projects.getMany.queryOptions()
  );

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No projects yet
        </h3>
        <p className="text-gray-500">
          Create your first project above to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
        <span className="text-sm text-gray-500">
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href={`/projects/${project.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <FolderIcon className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-lg font-medium truncate">
                      {project.name}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>
                      {formatDistance(new Date(project.updatedAt), new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircleIcon className="h-4 w-4" />
                    <span>
                      {project.messages?.length || 0} messages
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    {project.messages && project.messages.length > 0 ? (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {project.messages[project.messages.length - 1].content}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No messages yet
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
