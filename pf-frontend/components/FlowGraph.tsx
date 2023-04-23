import React, { useCallback } from "react";
import ReactFlow, { addEdge, Background, Controls, MiniMap, useEdgesState, useNodesState } from "reactflow";

// TODO: get importing this stuff working given the nextjs and multiple package.json setup
// import {getChainWithMultipleInputs} from '../../src/bin/examples/chainToTestInputsFlow'
import { expertOpinion } from "../../src/bin/examples/singleNodeFlow";
import { Flow } from "../../src/nodes/flow";
import { PromptNode } from "../../src/bin/promptNode";

const minimapStyle = {
    height: 120,
};

const onInit = (reactFlowInstance: any) => console.log("flow loaded:", reactFlowInstance);

interface NodeUINodePair {
    node: PromptNode;
    uiNode: FrontendNodeType;
}

interface FrontendNodeType {
    flowId: string;
    id: string;
    type: string;
    data: {
        label: string;
    };
    position: {
        x: number;
        y: number;
    };
}

interface FrontendEdgeType {
    id: string;
    source: string;
    target: string;
    label: string;
    markerEnd: {
        type: any;
    };
    animated?: boolean;
}

function promptNodeToRectFlowNode(node: PromptNode, length: number): FrontendNodeType {
    return {
        flowId: node.id,
        id: String(length),
        type: "input",
        data: {
            label: node.title,
        },
        position: { x: 200 + length * 50, y: -50 + length * 50 },
    };
}

const getReactFlowChartNodes = (node: PromptNode, seenIds: Set<string>): NodeUINodePair[] => {
    if (seenIds.has(node.id)) {
        return [];
    }
    seenIds.add(node.id);
    const length = [...Array.from(seenIds)].length;
    const newNode = promptNodeToRectFlowNode(node, length);
    console.log("Added node", node.title, newNode);
    return [
        { node: node, uiNode: newNode },
        ...node.children.flatMap((child) => getReactFlowChartNodes(child, seenIds)),
    ].flat();
};

function nodesToUiEdges(nodePairs: NodeUINodePair[]): FrontendEdgeType[] {
    return nodePairs.flatMap(({ node, uiNode }) =>
        node.children.map((child) => {
            const source = uiNode;
            const target = nodePairs.find(({ uiNode: targetUiNode }) => targetUiNode.flowId === child.id).uiNode;
            if (source && target) {
                return {
                    id: `e${source.id}-${target.id}`,
                    source: source.id,
                    target: target.id,
                    label: "",
                    animated: true,
                    markerEnd: {
                        type: "arrowclosed",
                    },
                };
            } else {
                throw new Error("couldn't construct edges");
            }
        })
    );
}

export const getReactFlowChartVersion = (flow: Flow): { nodes: FrontendNodeType[]; edges: FrontendEdgeType[] } => {
    const nodePairs = getReactFlowChartNodes(flow.rootNode, new Set<string>());
    const edges = nodesToUiEdges(nodePairs);
    const uiNodes = nodePairs.map(({ uiNode }) => uiNode);
    return { nodes: uiNodes, edges };
};

export const FlowGraph = () => {
    const flow = expertOpinion();
    const { nodes: initNodes, edges: initEdges } = getReactFlowChartVersion(flow);
    console.log("Initial nodes", initNodes);
    console.log("Initial edges", initEdges);

    const [nodes, setNodes, onNodesChange] = useNodesState<{ label: string }>(initNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<{ label: string }>(initEdges);
    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={onInit}
                fitView
                attributionPosition="top-right"
            >
                <MiniMap style={minimapStyle} zoomable pannable />
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </div>
    );
};

export default FlowGraph;
