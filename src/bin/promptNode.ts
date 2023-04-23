import { sleep } from "./utils";
import {v4 as uuidv4} from 'uuid';
import { Configuration, OpenAIApi } from 'openai';
import { uniqBy } from "lodash";

const CONFIG = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const OPENAI = new OpenAIApi(CONFIG);


// Represents an input to a node that will be a text field for the end-user page
interface UserInput {
  name: string;
  value: string;
}

export class PromptNode {
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
    this.title = title;
    this.inputs = inputs;
    this.children = children;
    this.promptTemplate = promptTemplate;
    this.stopCondition = stopCondition;
    this.expectedNumberOfParentOutputs = expectedNumberOfParentOutputs;

    ////////////////////////
    this.id = uuidv4();
    this.parentOutputs = []
    this.model = "gpt-3.5-turbo"; // Make this a param if we want it configurable
  }


  // TODO: replace this with the proper LMQL stuff
  compilePrompt() {
    let prompt = this.promptTemplate;
    this.inputs.forEach(input => {
      prompt = prompt.replace(`{{${input.name}}}`, input.value)
    })
    this.parentOutputs.forEach(output => {
      prompt = prompt.replace(`{{output}}`, output)
    })
    return prompt
  }

  runPrompt(prompt: string) {
    // Example prompt runner
    return OPENAI.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0,
      max_tokens: 70,
    });
  } 

  
  // For backend to run the node
  async run() {
    while (this.parentOutputs.length < this.expectedNumberOfParentOutputs) {
      await sleep(1000)
    }
    const prompt = this.compilePrompt()
    console.log({prompt})

    const response = await this.runPrompt(prompt)
    const output = response.data.choices[0].text

    if (!output) {
      throw new Error(`No output from OpenAI for ${prompt}`)
    }
    console.log({output})

    // run stop condition to see if we should stop(?)
    if (this.stopCondition) {}

    // run children
    this.children.forEach(child => {
      child.parentOutputs = [...child.parentOutputs, output]
      child.run()
    })
  }
}


// Hopefully returns all inputs that exist in the flow
// Takes the rootnode as its first argument and a new empty set as its second argument
export const listUserInputsForFlow = (flow: PromptNode, seenIds: Set<string>): UserInput[] => {
  if (seenIds.has(flow.id)) {
    return []
  }
  seenIds.add(flow.id)
  return uniqBy([...flow.inputs, ...flow.children.flatMap(child => listUserInputsForFlow(child, seenIds))], (input => input.name))
}
