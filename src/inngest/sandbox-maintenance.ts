import { inngest } from "./client";
import { prisma } from "@/lib/db";
import { getSandbox } from "./utils";

export const sandboxMaintenanceFunction = inngest.createFunction(
  { id: "sandbox-maintenance" },
  { cron: "*/10 * * * *" }, // Run every 10 minutes
  async ({ step }) => {
    await step.run("maintain-active-sandboxes", async () => {
      console.log("Starting sandbox maintenance...");
      
      // Find all active fragments with sandboxes that haven't expired yet
      const activeFragments = await prisma.fragment.findMany({
        where: {
          sandboxId: { not: null },
          sandboxExpiresAt: { 
            gt: new Date() // Only get non-expired sandboxes
          }
        },
        orderBy: {
          sandboxCreatedAt: 'desc'
        },
        take: 20 // Limit to prevent overload
      });

      console.log(`Found ${activeFragments.length} active sandboxes to maintain`);

      let maintained = 0;
      let expired = 0;

      for (const fragment of activeFragments) {
        try {
          if (fragment.sandboxId) {
            const sandbox = await getSandbox(fragment.sandboxId);
            
            // Send a simple keep-alive command
            await sandbox.commands.run("echo 'Maintenance keep-alive at $(date)'");
            
            console.log(`✓ Maintained sandbox ${fragment.sandboxId}`);
            maintained++;
          }
        } catch (error) {
          console.log(`✗ Sandbox ${fragment.sandboxId} no longer accessible:`, error);
          
          // Mark sandbox as expired in database
          await prisma.fragment.update({
            where: { id: fragment.id },
            data: { 
              sandboxExpiresAt: new Date() // Mark as expired now
            }
          });
          
          expired++;
        }
      }

      console.log(`Sandbox maintenance completed: ${maintained} maintained, ${expired} marked as expired`);
      
      return {
        maintained,
        expired,
        total: activeFragments.length
      };
    });
  }
);





