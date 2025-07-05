import { inngest } from "./client";
import { createAgent, openai } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event}) => {
    const codeAgent = createAgent({
      name: "Code writer",
      system:
        "You are an expert NextJS Developer. Write clean maintainable nextJS code. ",
      model: openai({model:'gpt-4o-mini'}),
    });

    const {output} = await codeAgent.run(`${event.data.value}`)

    return {output} ;
  }
);
