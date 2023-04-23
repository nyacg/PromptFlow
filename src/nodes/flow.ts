import { getFlowNodes, Input, listUserInputsForFlow, PromptNode } from "../bin/promptNode";

export class Flow {
    rootNode: PromptNode;
    title: string;
    description: string;

    constructor(rootNode: PromptNode, title: string, description: string) {
        this.rootNode = rootNode;
        this.title = title;
        this.description = description;
    }

    getUserInputs(): Input[] {
        return listUserInputsForFlow(this.rootNode, new Set());
    }

    getNodes(): PromptNode[] {
        return getFlowNodes(this.rootNode, new Set());
    }

    async run() {
        return await this.rootNode.run(new Set());
    }
}
