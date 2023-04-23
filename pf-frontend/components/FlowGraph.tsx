import React, { useCallback } from "react";
import ReactFlow, { addEdge, Background, Controls, MiniMap, useEdgesState, useNodesState } from "reactflow";

// TODO: get importing this stuff working given the nextjs and multiple package.json setup
// import {getChainWithMultipleInputs} from '../../src/bin/examples/chainToTestInputsFlow'
import { expertOpinion } from "../../src/bin/examples/singleNodeFlow";
import { Flow } from "../../src/nodes/flow";
import { PromptNode, Input } from "../../src/bin/promptNode";
import { DragHandleNode } from "@/components/Nodes";
import { autoGPT, autoGPTFlow } from "../../src/bin/examples/autoGPT";

const minimapStyle = {
    height: 120,
};

const onInit = (reactFlowInstance: any) => console.log("flow loaded:", reactFlowInstance);

interface NodeUINodePair {
    node: PromptNode;
    uiNode: FrontendNodeType;
}

type FrontendNodeType = DragHandleNode;

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

function promptNodeToRectFlowNode(node: PromptNode, index: number): FrontendNodeType {
    return {
        flowId: node.id,
        id: node.id,
        // type: "input",
        data: {
            label: node.title,
        },
        position: { x: 200 + index * 50, y: -50 + index * 100 },
    };
}

function userInputToReactFlowNode(input: Input, index: number): FrontendNodeType {
    return {
        flowId: input.name,
        id: input.name,
        type: "input",
        data: {
            label: input.name,
        },
        position: { x: 200 + index * 50, y: -150 },
    };
}

const getReactFlowChartNodes = (flow: Flow, seenIds: Set<string>): FrontendNodeType[] => {
    const promptNodeNodes = flow.getNodes().map((node, index) => promptNodeToRectFlowNode(node, index));
    const inputNodes = flow.getUserInputs().map((input, index) => userInputToReactFlowNode(input, index));
    return [...promptNodeNodes, ...inputNodes];
};

function promptNodeToEdge(source: PromptNode, destination: PromptNode): FrontendEdgeType {
    return {
        id: `e${source.id}-${destination.id}`,
        source: source.id,
        target: destination.id,
        label: "",
        animated: true,
        markerEnd: {
            type: "arrowclosed",
        },
    };
}

function inputNodeToEdge(source: Input, destination: PromptNode): FrontendEdgeType {
    return {
        id: `e${source.name}-${destination.id}`,
        source: source.name,
        target: destination.id,
        label: "",
        animated: true,
        markerEnd: {
            type: "arrowclosed",
        },
    };
}

function nodesToUiEdges(flow: Flow): FrontendEdgeType[] {
    const promptNodeEdges = flow
        .getNodes()
        .flatMap((source) => source.children.map((destination) => promptNodeToEdge(source, destination)));
    const inputNodeEdges = flow
        .getNodes()
        .flatMap((destination) => destination.inputs.map((source) => inputNodeToEdge(source, destination)));
    return [...promptNodeEdges, ...inputNodeEdges];
}

export const getReactFlowChartVersion = (flow: Flow): { nodes: FrontendNodeType[]; edges: FrontendEdgeType[] } => {
    const uiNodes = getReactFlowChartNodes(flow, new Set<string>());
    const edges = nodesToUiEdges(flow);
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
