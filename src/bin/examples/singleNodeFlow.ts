import { PromptNode } from "../promptNode";
import { ListOutput, Output } from "../../nodes/output";

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

