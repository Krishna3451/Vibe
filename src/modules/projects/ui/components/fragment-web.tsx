import React, { useState } from "react";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";

import { Fragment } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";

interface Props {
  data: Fragment;
}

export function FragmentWeb({ data }: Props) {
  const [FragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const checkIfExpired = () => {
    if (data.sandboxExpiresAt) {
      const now = new Date();
      const expiresAt = new Date(data.sandboxExpiresAt);
      setIsExpired(now > expiresAt);
    }
  };

  // Check expiration status on mount
  React.useEffect(() => {
    checkIfExpired();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.sandboxExpiresAt]);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
    setIsExpired(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex flex-col w-full h-full">
      {isExpired && (
        <div className="p-2 bg-yellow-100 border border-yellow-200 text-yellow-800 text-sm">
          ⚠️ This sandbox has expired (1 hour limit). Try refreshing or creating a new project.
        </div>
      )}
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">

        <Hint text="Refresh" side="bottom" align="center">

        <Button size="sm" variant="outline" onClick={onRefresh}>
          <RefreshCcwIcon />
        </Button>
        </Hint>

        <Hint text="Click to copy" side="bottom">

        <Button
          size="sm"
          variant="outline"
          disabled={!data.sandboxUrl || copied}
          onClick={handleCopy}
          className="flex-1 justify-start text-start font-normal"
          >
          <span className="truncate">{data.sandboxUrl}</span>
        </Button>

            </Hint>
        <Hint text="Open in a new tab" side="bottom" align="start">
        <Button
          size="sm"
          disabled={!data.sandboxUrl}
          variant="outline"
          onClick={() => {
            if (!data.sandboxUrl) return;
            window.open(data.sandboxUrl, "_blank");
          }}
        >
          <ExternalLinkIcon />
        </Button>
        </Hint>
      </div>

      <iframe
      key={FragmentKey}
        className="h-full w-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl}
      />
    </div>
  );
}
