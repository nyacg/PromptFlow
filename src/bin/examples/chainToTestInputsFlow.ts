import { Output } from "../../nodes/output"
import { PromptNode } from "../promptNode"


export function getChainWithMultipleInputs() {
  return new PromptNode({
    title: "One node with one input flow",
    inputs: [{
      name: "input1",
      value: "value1"
    }],
    output: new Output("answer1"),
    promptTemplate: "This is a prompt template {{input1}}",
    expectedNumberOfParentOutputs: 0,
    children: [new PromptNode({
        title: "One node with one input flow",
        inputs: [{
          name: "input2",
          value: "value1"
        }],
        output: new Output("answer2"),
        promptTemplate: "This is a prompt template {{input2}} that iterates on its parent's {{answer1}}",
        expectedNumberOfParentOutputs: 1,
        children: [new PromptNode({
            title: "One node with one input flow",
            inputs: [{
              name: "input1",
              value: "value1"
            }],
            output: new Output("answer3"),
            promptTemplate: "This is a prompt template {{input1}} that iterates on its parent's {{answer2}}",
            expectedNumberOfParentOutputs: 1,
            children: [new PromptNode({
                title: "One node with one input flow",
                inputs: [{
                  name: "input3",
                  value: "value1"
                }],
                output: new Output("answer"),
                promptTemplate: "This is a prompt template {{input3}} that iterates on its parent's {{answer3}}",
                expectedNumberOfParentOutputs: 1,
                children: [],
              })]
          })]
      })],
  })
}
