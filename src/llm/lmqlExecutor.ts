import * as Handlebars from "handlebars";
import axios from "axios";
import { PromptNode } from "../bin/promptNode";

// We need to convert a Step (prompt, examples, inputs, output) into LMQL, execute it and parse the outputs
// Output has a name, a stopping condition and a count (e.g. ListOutput is a for loop with -, stopping at \n)

class Output {
    name: string;
    stopsAt: string;

    lmqlBody = () => {
        return `"[${this.name}]"`;
    };

    lmqlStopsAt = () => {
        return `STOPS_AT(${this.name}, "${this.stopsAt}")`;
    };

    constructor(name: string, stopsAt?: string) {
        this.name = name;
        if (stopsAt === undefined) {
            this.stopsAt = "\\n";
        } else {
            this.stopsAt = stopsAt;
        }
    }
}

class ListOutput extends Output {
    name: string;
    stopsAt: string;
    count: number;

    constructor(count: number, name: string) {
        super(name, "\\n");
        this.name = name;
        this.stopsAt = "\\n";
        this.count = count;
    }

    lmqlBody = () => {
        return `
    for i in range(${this.count}):
        "- [${this.name}] \\n"`;
    };
}

interface Input {
    name: string;
    value: string;
}

class Example {}

// class PromptNode {
//     inputs: Input[];
//     output: Output;
//     promptTemplate: string;
//     examples: Example[];
//
//     constructor(inputs: Input[], output: Output, promptTemplate: string, examples: Example[]) {
//         this.inputs = inputs;
//         this.output = output;
//         this.promptTemplate = promptTemplate;
//         this.examples = examples;
//     }
// }

export function generateLmql(node: PromptNode): string {
    // Prompt template has variables with the curly braces notation named with the `input.name` (e.g. {{INPUT_NAME}})
    // Examples are TODO (some kind of input(s), response pair, maybe including the parsed output separately)
    // Outputs need to be paired with a stopping condition and the right square brackets syntax

    const inputValues: { [key: string]: string } = {};
    for (const input of node.inputs) {
        inputValues[input.name] = input.value;
    }

    const hydratedPrompt = Handlebars.compile(node.promptTemplate)(inputValues);
    return `
argmax
    """${hydratedPrompt}"""
    "\\n\\n"
    ${node.output.lmqlBody()}
from
    "chatgpt"
where
    ${node.output.lmqlStopsAt()}
    `;
}

export async function runLmql(script: string) {
    const response = await axios.post("http://localhost:8000/run", { script });
    return response.data;
}

async function main() {
    // const inputs: Input[] = [
    //     {
    //         name: "location",
    //         value: "the seaside",
    //     },
    // ];
    //
    // const promptTemplate = "A list of things not to forget when going to {{location}}:";
    //
    // const output = new ListOutput(3, "item");
    //
    // const packingListNode = new PromptNode(inputs, output, promptTemplate, []);
    //
    // const lmqlScript = generateLmql(packingListNode);
    // console.log("Output lmql:\n\n", lmqlScript);
    // console.log(await runLmql(lmqlScript));
}

main();
