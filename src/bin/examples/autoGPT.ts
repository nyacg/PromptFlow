import { PromptNode } from "../promptNode";
import { ListOutput, Output } from "../../nodes/output";
import { times } from "lodash";

const N = 10


const aggregatingNode = new PromptNode({
  title: "Summarise results",
  expectedNumberOfParentOutputs: 10,
  inputs: [],
  output: new Output("summary"),
  promptTemplate: `Q: summarise the results of completing all the tasks. You can find the individual task results below.:
Task 1: {{task-1}}
Task 2: {{task-2}}
Task 3: {{task-3}}
Task 4: {{task-4}}
Task 5: {{task-5}}
Task 6: {{task-6}}
Task 7: {{task-7}}
Task 8: {{task-8}}
Task 9: {{task-9}}
Task 10: {{task-10}}`,
  children: []
})


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
    promptTemplate: `I want to achieve this goal: {{goal}}
List the ${N} steps I need to take to achieve this goal.
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
        output: new ListOutput(N, "ranked-tasks"),
        promptTemplate: `Q: order these tasks in the order in which I should complete them to maximise my chances of achieving this goal: {{goal}}
{{initial-tasks}}`,
        children: 
          times(N).map((i) => new PromptNode({
            title: "Complete task",
            expectedNumberOfParentOutputs: 1,
            inputs: [],
            output: new Output(`task-${i + 1}`),
            promptTemplate: `Q: complete this task: {{ranked-tasks[${i}]}}`, // TODO - make sure this works with the fanning implementation from promptNode.ts
            children: [
              aggregatingNode
            ]
          }))
        
      })
    ]
  });
}
