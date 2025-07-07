"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Page = () => {
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success("Background Job started");
      },
    })
  );

  return (
    <div className="p-4 max-w-7xl mx-auto flex flex-col justify-center items-center mt-60">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button className="mt-5" onClick={() => invoke.mutate({ value: value })}>
        Invoke Background Job
      </Button>
    </div>
  );
};

export default Page;
