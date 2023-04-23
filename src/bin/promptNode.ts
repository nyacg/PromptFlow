import { sleep } from "./utils";
import { v4 as uuidv4 } from "uuid";
import { Output } from "../nodes/output";
import { generateLmql, runLmql } from "../llm/lmqlExecutor";
import { uniqBy } from "lodash";

// Represents an input to a node that will be a text field for the end-user page
export interface Input {
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
    async run(seenIds: Set<string>) {
        if (seenIds.has(this.id)) {
            return;
        }
        seenIds.add(this.id);
        while (this.parentOutputs.length < this.expectedNumberOfParentOutputs) {
            console.log('waiting for parent outputs')
            console.log({ parentOutputs: this.parentOutputs, expectedNumberOfParentOutputs: this.expectedNumberOfParentOutputs })
            await sleep(1000);
        }

        console.error('running prompt')
        const response = await this.runPrompt();
        console.error("finished running prompt")

        console.log(response);
        const outputName = Object.keys(response)[0];

        // run children
        await Promise.all(
            this.children.map((child, i) => {
                child.parentOutputs.push(response[outputName][i])
                child.inputs = [...child.inputs, {
                    name: `${outputName}${i}`,
                    value: response[outputName][i]
                }];
                child.run(seenIds);
            })
        );
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

export const getFlowNodes = (flow: PromptNode, seenIds: Set<string>): PromptNode[] => {
    if (seenIds.has(flow.id)) {
        return [];
    }
    seenIds.add(flow.id);
    return [flow, ...flow.children.flatMap((child) => getFlowNodes(child, seenIds))];
};
