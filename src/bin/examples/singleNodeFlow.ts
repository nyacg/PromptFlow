import { PromptNode } from "../promptNode";
import { ListOutput, Output } from "../../nodes/output";
import { Flow } from "../../nodes/flow";

// export const getSingleNode = (): PromptNode => {
//     return new PromptNode({
//         title: "One node with one input flow",
//         inputs: [
//             {
//                 name: "input1",
//                 value: "value1",
//             },
//         ],
//         children: [],
//         promptTemplate: "This is a prompt template {{input1}}",
//         expectedNumberOfParentOutputs: 0,
//     });
// };

export const getSeasideSingleNode = (): PromptNode => {
    return new PromptNode({
        title: "Packing list",
        inputs: [
            {
                name: "location",
                value: "the seaside",
            },
        ],
        output: new ListOutput(3, "item"),
        children: [],
        promptTemplate: "A list of things not to forget when going to {{location}}:",
        expectedNumberOfParentOutputs: 0,
    });
};

export const expertOpinion = (): Flow => {
    const expertsAnswer = new PromptNode({
        title: "Expert's answer",
        children: [],
        expectedNumberOfParentOutputs: 0,
        inputs: [
            {
                name: "question",
                value: "What are Large Language Models?",
            },
        ],
        output: new Output("answer"),
        promptTemplate: `Q: {{question}}
For instance, {{expert}} would answer:`,
    });

    const getExpert = new PromptNode({
        title: "Get expert",
        inputs: [
            {
                name: "question",
                value: "What are Large Language Models?",
            },
        ],
        output: new Output("expert"),
        children: [expertsAnswer],
        promptTemplate: `Q: {{question}}
A good person to answer this question would be:`,
        expectedNumberOfParentOutputs: 0,
    });

    return new Flow(getExpert);
};
