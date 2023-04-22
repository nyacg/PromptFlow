import { PromptNode } from "../promptNode"


export const getSingleNode = (): PromptNode => {
  return new PromptNode({
    title: "One node with one input flow",
    inputs: [{
      name: "input1",
      value: "value1"
    }],
    children: [],
    promptTemplate: "This is a prompt template {{input1}}",
    expectedNumberOfParentOutputs: 0
  })
}
