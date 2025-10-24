import { Sandbox } from "@e2b/code-interpreter"
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string) {
    try {
        console.log("Attempting to connect to sandbox:", sandboxId);
        const sandbox = await Sandbox.connect(sandboxId);
        console.log("Successfully connected to sandbox:", sandboxId);
        
        // Keep sandbox alive with a simple command
        try {
            await sandbox.commands.run("echo 'keeping sandbox alive'");
        } catch (keepAliveError) {
            console.warn("Keep-alive command failed, but connection established:", keepAliveError);
        }
        
        return sandbox;
    } catch (error) {
        console.error("Failed to connect to sandbox:", sandboxId, "Error:", error);
        throw error;
    }
}

export async function createSandboxWithTimeout(templateId: string) {
    try {
        const sandbox = await Sandbox.create(templateId, {
            // Extend timeout to maximum (1 hour - E2B limit)
            timeoutMs: 60 * 60 * 1000, // 1 hour
        });
        console.log("Created new sandbox with extended timeout:", sandbox.sandboxId);
        return sandbox;
    } catch (error) {
        console.error("Failed to create sandbox:", error);
        throw error;
    }
}

export function lastAssistantTextMessageContent(result : AgentResult){
    const lastAssistantTextMessageIndex = result.output.findLastIndex(
        (message) => message.role === "assistant",
    );

    const message = result.output[lastAssistantTextMessageIndex] as 
    | TextMessage
    | undefined;

    return message?.content
        ? typeof message.content === "string"
            ? message.content
            : message.content.map((c)=> c.text).join("")
        : undefined; 
}