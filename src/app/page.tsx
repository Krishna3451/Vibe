"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const trpc = useTRPC();

  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onError: (error) =>{
      toast.error(error.message)
    },

    onSuccess: (data)=>{
      router.push(`/projects/${data.id}`)
    }
  }))


  return (
    <div className="p-4 max-w-7xl mx-auto flex flex-col justify-center items-center mt-60">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        className="mt-5"
        disabled={createProject.isPending}
        onClick={() => createProject.mutate({ value: value })}
      >
        Create 
      </Button>
    </div>
  );  
};

export default Page;
