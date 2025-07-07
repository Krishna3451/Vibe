import { Sandbox } from "@e2b/code-interpreter"
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(sandboxId:string){
    try {
        console.log("Attempting to connect to sandbox:", sandboxId);
        const sandbox = await Sandbox.connect(sandboxId);
        console.log("Successfully connected to sandbox:", sandboxId);
        return sandbox;
    } catch (error) {
        console.error("Failed to connect to sandbox:", sandboxId, "Error:", error);
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