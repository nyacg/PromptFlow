

// Represents an input to a node that will be a text field for the end-user page
class UserInput {
  name: string;
  value: string;
}


class PromptNode {
  id: string;
  title: string;
  children: PromptNode[];
  inputs: UserInput[];
  parentOutputs: string[];
  expectedNumberOfParentOutputs: number;
  model: "gpt-3.5-turbo";
  promptTemplate: string;
  stopCondition?: string; // If we use LMQL


  constructor(
    {title, inputs, children, promptTemplate, stopCondition, expectedNumberOfParentOutputs}: 
    {title: string, inputs: UserInput[], children: PromptNode[], promptTemplate: string, stopCondition?: string, expectedNumberOfParentOutputs: number}
  ) {
    this.id = crypto.randomUUID();
    this.parentOutputs = []
    this.model = "gpt-3.5-turbo"; // Make this a param if we want it configurable
  }
  
  // For backend to run the node
  async run() {
    // run prompt to get outputs
    const output = "INSERT PROMPT RESULT HERE";

    // run stop condition to see if we should stop(?)
    if (this.stopCondition)

    // run children
    this.children.forEach(child => {
      child.parentOutputs = [...child.parentOutputs, output]
      child.run()
    })
  }
}


// Hopefully returns all inputs that exist in the flow
// Takes the rootnode as its first argument and a new empty set as its second argument
const listUserInputsForFlow = (flow: PromptNode, seenIds: Set<string>): UserInput[] => {
  if (seenIds.has(flow.id)) {
    return []
  }
  seenIds.add(flow.id)
  return [...flow.inputs, ...flow.children.flatMap(child => listUserInputsForFlow(child, seenIds))]
}
