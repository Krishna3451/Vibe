"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Maximize2, Code2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodePreviewProps {
  url?: string;
  title?: string;
  files?: { [path: string]: string };
  isLoading?: boolean;
}

export function CodePreview({ url, title, files, isLoading }: CodePreviewProps) {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Generating your website...</p>
        </div>
      </div>
    );
  }

  if (!url && !files) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-xl font-semibold mb-2">Your website will appear here</h2>
          <p className="text-sm">Start a conversation to generate your first website</p>
        </div>
      </div>
    );
  }

  const fileList = files ? Object.keys(files) : [];
  const currentFile = selectedFile || fileList[0];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">
                {title || "Generated Website"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Live Preview
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex rounded-md bg-muted p-1">
              <Button
                variant={view === 'preview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('preview')}
                className="h-6 px-2"
              >
                <Globe className="h-3 w-3 mr-1" />
                Preview
              </Button>
              <Button
                variant={view === 'code' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('code')}
                className="h-6 px-2"
              >
                <Code2 className="h-3 w-3 mr-1" />
                Code
              </Button>
            </div>

            {/* Actions */}
            {url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(url, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === 'preview' ? (
          url ? (
            <iframe
              src={url}
              className="w-full h-full border-0"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <div className="text-4xl mb-4">🔧</div>
                <p className="text-sm">Preview not available</p>
              </div>
            </div>
          )
        ) : (
          <div className="flex h-full">
            {/* File Tree */}
            {fileList.length > 0 && (
              <div className="w-64 border-r border-border bg-muted/50 p-4">
                <h3 className="text-sm font-semibold mb-2">Files</h3>
                <div className="space-y-1">
                  {fileList.map((file) => (
                    <button
                      key={file}
                      onClick={() => setSelectedFile(file)}
                      className={cn(
                        "w-full text-left px-2 py-1 rounded text-sm transition-colors",
                        currentFile === file
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      {file}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Code View */}
            <div className="flex-1 p-4">
              {currentFile && files?.[currentFile] ? (
                <pre className="text-sm bg-muted/50 p-4 rounded-lg overflow-auto h-full">
                  <code>{files[currentFile]}</code>
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-sm">No code to display</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 