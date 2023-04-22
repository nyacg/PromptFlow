import { PromptNode } from "../promptNode"


export const getChainWithMultipleInputs = (): PromptNode => {
  return new PromptNode({
    title: "One node with one input flow",
    inputs: [{
      name: "input1",
      value: "value1"
    }],
    children: [new PromptNode({
        title: "One node with one input flow",
        inputs: [{
          name: "input2",
          value: "value1"
        }],
        children: [new PromptNode({
            title: "One node with one input flow",
            inputs: [{
              name: "input1",
              value: "value1"
            }],
            children: [new PromptNode({
                title: "One node with one input flow",
                inputs: [{
                  name: "input3",
                  value: "value1"
                }],
                children: [],
                promptTemplate: "This is a prompt template {{input3}}",
                expectedNumberOfParentOutputs: 0
              })],
            promptTemplate: "This is a prompt template {{input1}}",
            expectedNumberOfParentOutputs: 0
          })],
        promptTemplate: "This is a prompt template {{input2}}",
        expectedNumberOfParentOutputs: 0
      })],
    promptTemplate: "This is a prompt template {{input1}}",
    expectedNumberOfParentOutputs: 0
  })
}
