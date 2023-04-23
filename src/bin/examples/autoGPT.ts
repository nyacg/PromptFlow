import { PromptNode } from "../promptNode";
import { ListOutput, Output } from "../../nodes/output";
import { times } from "lodash";
import { Flow } from "../../nodes/flow";

const N = 10


const aggregatingNode = new PromptNode({
  title: "Summarise results",
  expectedNumberOfParentOutputs: 10,
  inputs: [],
  output: new Output("summary"),
  promptTemplate: `Q: summarise the results of completing all the tasks. You can find the individual task results below.:
Task 1: {{task1}}
Task 2: {{task2}}
Task 3: {{task3}}
Task 4: {{task4}}
Task 5: {{task5}}
Task 6: {{task6}}
Task 7: {{task7}}
Task 8: {{task8}}
Task 9: {{task9}}
Task 10: {{task10}}`,
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
    output: new ListOutput(N, "initialtasks"),
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
        output: new ListOutput(N, "rankedtasks"),
        promptTemplate: `Q: order these tasks in the order in which I should complete them to maximise my chances of achieving this goal: {{goal}}
{{initialtasks}}`,
        children: 
          times(N).map((i) => new PromptNode({
            title: "Complete task",
            expectedNumberOfParentOutputs: 1,
            inputs: [],
            output: new Output(`task${i + 1}`),
            promptTemplate: `Q: complete this task: {{rankedtasks${i}}}`, // TODO - make sure this works with the fanning implementation from promptNode.ts
            children: [
              aggregatingNode
            ]
          }))
        
      })
    ]
  });
}


export const autoGPTFlow = new Flow(autoGPT(), "autoGPTFlow", "Take over the world, one PromptFlow at a time!");