

// Represents an input to a node that will be a text field for the end-user page
class Input {
  name: string;
  value: string;
}


class PromptNode {
  id: string;
  title: string;
  children: PromptNode[];
  inputs: Input[];
  model: 'cha'
  parent: PromptNode;
  promptTemplate: string;
  stopCondition?: string; // If we use LMQL


  constructor(title: string, inputs: Input[], children: PromptNode[], parent: PromptNode, promptTemplate: string, stopCondition?: string) {
    this.id = crypto.randomUUID();
  }

  // Frontend only to gather inputs
  listAllInputs () {

  }
  
  // For backend to run the node
  async run(input: string) {
    // run prompt to get outputs
    const output = "INSERT PROMPT RESULT HERE"

    // run stop condition to see if we should stop(?)
    if (this.stopCondition)

    // run children
    this.children.forEach(child => child.run(output))
  }
}


// Hopefully returns all inputs that exist in the flow
// Takes the rootnode as its first argument and a new empty set as its second argument
const listInputsForFlow = (flow: PromptNode, seenIds: Set<string>): Input[] => {
  if (seenIds.has(flow.id)) {
    return []
  }
  seenIds.add(flow.id)
  return [...flow.inputs, ...flow.children.flatMap(child => listInputsForFlow(child, seenIds))]
}
