import { inngest } from "./client";
import {
  createAgent,
  createNetwork,
  createTool,
  openai,
  type Tool,
} from "@inngest/agent-kit";
import { getSandbox, createSandboxWithTimeout, lastAssistantTextMessageContent } from "./utils";
import { prisma } from "@/lib/db";

import { z } from "zod";
import { PROMPT } from "@/prompt";

interface AgentState {
  summary?: string;
  files?: { [path: string]: string };
}

interface EventData {
  value: string;
  projectId?: string;
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const { value, projectId } = event.data as EventData;
    
    // Get or create project
    const finalProjectId = await step.run("get-or-create-project", async () => {
      if (projectId) {
        // Verify project exists
        const project = await prisma.project.findUnique({
          where: { id: projectId }
        });
        if (project) return projectId;
      }
      
      // Create or find default project
      let defaultProject = await prisma.project.findFirst({
        where: { name: "Default Project" }
      });
      
      if (!defaultProject) {
        defaultProject = await prisma.project.create({
          data: { name: "Default Project" }
        });
      }
      
      return defaultProject.id;
    });

    const sandboxInfo = await step.run("get-or-create-sandbox", async () => {
      // Try to find existing active sandbox for this project
      const existingFragment = await prisma.fragment.findFirst({
        where: {
          message: {
            projectId: finalProjectId
          },
          sandboxId: {
            not: null
          },
          sandboxExpiresAt: {
            gt: new Date() // Only get non-expired sandboxes
          }
        },
        orderBy: {
          sandboxCreatedAt: 'desc'
        }
      });

      if (existingFragment?.sandboxId) {
        try {
          // Try to connect to existing sandbox
          await getSandbox(existingFragment.sandboxId);
          console.log("Reusing existing sandbox:", existingFragment.sandboxId);
          return {
            sandboxId: existingFragment.sandboxId,
            isNew: false
          };
        } catch (error) {
          console.log("Existing sandbox not accessible, creating new one:", error);
        }
      }

      // Create new sandbox with extended timeout
      const sandbox = await createSandboxWithTimeout("vibe-nextjs-project-krishna-3");
      console.log("Created new sandbox:", sandbox.sandboxId);
      
      return {
        sandboxId: sandbox.sandboxId,
        isNew: true
      };
    });

    const codeAgent = createAgent<AgentState>({
      name: "Code writer",
      description: "An expert coding Agent",
      system: PROMPT,
      model: openai({
        model: "gpt-5-mini",
        
      }),

      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }) => {
            console.log("Terminal tool called with command:", command);
            const buffers = { stdout: "", stderr: "" };

            try {
              console.log("Getting sandbox for terminal command...");
              const sandbox = await getSandbox(sandboxInfo.sandboxId);
              console.log("Running terminal command:", command);

              const result = await sandbox.commands.run(command, {
                onStdout: (data: string) => {
                  buffers.stdout += data;
                },
                onStderr: (data: string) => {
                  buffers.stderr += data;
                },
              });

              console.log(
                "Terminal command completed:",
                command,
                "Output length:",
                result.stdout.length
              );
              return result.stdout;
            } catch (e) {
              console.error("Terminal command error:", e);
              const errorMsg = `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderror: ${buffers.stderr}`;
              console.error(errorMsg);
              return errorMsg;
            }
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async (
            { files },
            { network }: Tool.Options<AgentState>
          ) => {
            console.log(
              "CreateOrUpdateFiles tool called with files:",
              files.map((f) => f.path)
            );

            try {
              // Initialize network state if it doesn't exist
              if (!network.state.data) {
                network.state.data = {};
              }
              const updatedFiles = network.state.data.files || {};
              console.log(
                "Current files before update:",
                Object.keys(updatedFiles)
              );

              console.log("Getting sandbox...");
              const sandbox = await getSandbox(sandboxInfo.sandboxId);
              console.log("Sandbox obtained successfully");

              for (const file of files) {
                console.log(
                  "Writing file:",
                  file.path,
                  "Length:",
                  file.content.length
                );
                await sandbox.files.write(file.path, file.content);
                updatedFiles[file.path] = file.content;
                console.log("File written successfully:", file.path);
              }

              console.log(
                "Updating network state with files count:",
                Object.keys(updatedFiles).length
              );
              network.state.data.files = updatedFiles;
              console.log(
                "Network state updated with files:",
                Object.keys(updatedFiles)
              );

              return `Successfully created/updated ${files.length} files`;
            } catch (e) {
              console.error("CreateOrUpdateFiles error:", e);
              console.error(
                "Error stack:",
                e instanceof Error ? e.stack : "No stack trace"
              );
              throw e;
            }
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),

          handler: async ({ files }) => {
            console.log("ReadFiles tool called with files:", files);

            try {
              console.log("Getting sandbox for readFiles...");
              const sandbox = await getSandbox(sandboxInfo.sandboxId);
              const contents = [];
              for (const file of files) {
                console.log("Reading file:", file);
                const content = await sandbox.files.read(file);
                contents.push({ path: file, content });
                console.log(
                  "File read successfully:",
                  file,
                  "Length:",
                  content.length
                );
              }

              console.log("All files read successfully:", files);
              return JSON.stringify(contents);
            } catch (e) {
              console.error("ReadFiles error:", e);
              return "Error: " + e;
            }
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);
          console.log(
            "onResponse called - Last assistant message:",
            lastAssistantMessageText?.substring(0, 200) + "..."
          );

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              console.log("Task summary detected, setting network state");
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
        },
      },
    });

    let routerCallCount = 0;

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        routerCallCount++;
        // Initialize network state if it doesn't exist
        if (!network.state.data) {
          network.state.data = {};
        }
        const summary = network.state.data.summary;
        const files = network.state.data.files;

        console.log(
          `Router called (${routerCallCount}/15) - Summary exists:`,
          !!summary
        );
        console.log(
          `Router called (${routerCallCount}/15) - Files count:`,
          files ? Object.keys(files).length : 0
        );

        // Stop if we have both summary and files (task completed)
        if (summary && files && Object.keys(files).length > 0) {
          console.log(
            "Router stopping - task completed with files and summary"
          );
          return;
        }

        // Stop if we've made significant progress but are near iteration limit
        if (routerCallCount >= 12 && files && Object.keys(files).length > 0) {
          console.log("Router stopping - near iteration limit but files exist");
          return;
        }

        // Stop if we've hit the iteration limit (safety valve)
        if (routerCallCount >= 15) {
          console.log("Router stopping - iteration limit reached");
          return;
        }

        console.log("Router continuing with codeAgent");
        return codeAgent;
      },
    });

    console.log("Starting network with input:", value);
    const result = await network.run(value);
    console.log("Network completed with result:", result);

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxInfo.sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            content: "Something went wrong. Please try again.",
            role: "ASSISTANT",
            type: "ERROR",
            projectId: finalProjectId,
          },
        });
      }
      // Calculate expiration time (1 hour from now - E2B maximum)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      return await prisma.message.create({
        data: {
          content: result.state.data.summary || "Task completed",
          role: "ASSISTANT",
          type: "RESULT",
          projectId: finalProjectId,
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              sandboxId: sandboxInfo.sandboxId,
              title: "Fragment",
              files: result.state.data.files || {},
              sandboxCreatedAt: sandboxInfo.isNew ? new Date() : null,
              sandboxExpiresAt: expiresAt,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
