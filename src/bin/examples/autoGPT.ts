import { PromptNode } from "../promptNode";
import { ListOutput, Output } from "../../nodes/output";

export const autoGPT = (): PromptNode => {
  return new PromptNode({
    title: "Set tasks",
    expectedNumberOfParentOutputs: 0,
    inputs: [
      {
        name: "goal",
        value: "I want to win a London-based hackathon that's centred around used foundation models (LLMs)",
      },
    ],
    output: new Output("initial-tasks"),
    promptTemplate: `Q: How do achieve this goal: {{goal}}
For instance, {{expert}} would answer:`,
    children: [
      new PromptNode({
        title: "Rank tasks",
        expectedNumberOfParentOutputs: 1,
        inputs: [
          {
            name: "goal",
            value: "I want to win a London-based hackathon that's centred around used foundation models (LLMs)",
          }
        ],
        output: new Output("ranked-tasks"),
        promptTemplate: `Q: re-order these tasks in the order in which I should complete them to maximise my chances of achieving this goal: {{goal}}
{{initial-tasks}}`,
        children: []
      })
    ]
  });
}
