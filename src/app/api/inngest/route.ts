import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { codeAgentFunction } from "@/inngest/functions";
import { sandboxMaintenanceFunction } from "@/inngest/sandbox-maintenance";

const handler = serve({
  client: inngest,
  functions: [
    codeAgentFunction,
    sandboxMaintenanceFunction,
  ],
});

export const GET = handler;
export const POST = handler;
export const PUT = handler;