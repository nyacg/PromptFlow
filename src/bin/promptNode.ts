import { sleep } from "./utils";
import { v4 as uuidv4 } from "uuid";
import { Configuration, OpenAIApi } from "openai";
import { uniqBy } from "lodash";
import { Output } from "../nodes/output";
import { generateLmql, runLmql } from "../llm/lmqlExecutor";

const CONFIG = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const OPENAI = new OpenAIApi(CONFIG);

// Represents an input to a node that will be a text field for the end-user page
interface Input {
    name: string;
    value: string;
}

export class PromptNode {
    id: string;
    title: string;
    children: PromptNode[];
    inputs: Input[];
    parentOutputs: string[];
    expectedNumberOfParentOutputs: number;
    model: "gpt-3.5-turbo";
    promptTemplate: string;
    output: Output;

    constructor({
        title,
        inputs,
        children,
        promptTemplate,
        output,
        expectedNumberOfParentOutputs,
    }: {
        title: string;
        inputs: Input[];
        children: PromptNode[];
        promptTemplate: string;
        output: Output;
        expectedNumberOfParentOutputs: number;
    }) {
        this.title = title;
        this.inputs = inputs;
        this.children = children;
        this.promptTemplate = promptTemplate;
        this.output = output;
        this.expectedNumberOfParentOutputs = expectedNumberOfParentOutputs;

        ////////////////////////
        this.id = uuidv4();
        this.parentOutputs = [];
        this.model = "gpt-3.5-turbo"; // Make this a param if we want it configurable
    }

    async runPrompt() {
        return await runLmql(generateLmql(this));
    }

    // For backend to run the node
    async run() {
        while (this.parentOutputs.length < this.expectedNumberOfParentOutputs) {
            await sleep(1000);
        }

        const response = await this.runPrompt();

        console.log(response);

        const outputName = Object.keys(response)[0];
        if (response[outputName].length > 1) {
            throw Error("Not implemented fanning yet");
        }

        const additionalInput: Input = {
            name: outputName,
            value: response[outputName][0],
        };

        // run children
        this.children.forEach((child) => {
            child.inputs = [...child.inputs, additionalInput];
            child.run();
        });
    }
}

// Hopefully returns all inputs that exist in the flow
// Takes the rootnode as its first argument and a new empty set as its second argument
export const listUserInputsForFlow = (flow: PromptNode, seenIds: Set<string>): Input[] => {
    if (seenIds.has(flow.id)) {
        return [];
    }
    seenIds.add(flow.id);
    return uniqBy(
        [...flow.inputs, ...flow.children.flatMap((child) => listUserInputsForFlow(child, seenIds))],
        (input) => input.name
    );
};
