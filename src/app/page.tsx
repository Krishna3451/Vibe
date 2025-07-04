// import prisma from '@/lib/db'

'use client'
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc} from "@/trpc/server";
import { Client } from "./client";
import { Suspense, use } from "react";

const Page = async ()=>{
  const trpc = useTRPC();
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.createAI.queryOptions({ text : "Antonio "}))
  

   

  return(
    <HydrationBoundary state = {dehydrate(queryClient)}>
      <Suspense fallback={<p>loading...</p>}>

       <Client/>
      </Suspense>

    </HydrationBoundary>
  )

}

export default Page