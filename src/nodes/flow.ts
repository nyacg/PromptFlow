import { getFlowNodes, Input, listUserInputsForFlow, PromptNode } from "../bin/promptNode";

export class Flow {
    rootNode: PromptNode;

    constructor(rootNode: PromptNode) {
        this.rootNode = rootNode;
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
