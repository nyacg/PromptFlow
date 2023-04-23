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

const getReactFlowChartNodes = (flow: PromptNode, seenIds: Set<string>): FrontendNodeType[] => {
    if (seenIds.has(flow.id)) {
        return [];
    }
    seenIds.add(flow.id);
    const length = [...Array.from(seenIds)].length;
    const newNode = {
        flowId: flow.id,
        id: String(length),
        type: "input",
        data: {
            label: flow.title,
        },
        position: { x: 200 + length * 50, y: -50 + length * 50 },
    };
    console.log("Added node", flow.title, newNode);
    return [newNode, ...flow.children.flatMap((child) => getReactFlowChartNodes(child, seenIds))];
};
export const getReactFlowChartVersion = (flow: Flow): { nodes: FrontendNodeType[]; edges: FrontendEdgeType[] } => {
    const uiNodes = getReactFlowChartNodes(flow.rootNode, new Set<string>());
    console.log("UI nodes", uiNodes);

    const edges = flow.getNodes().flatMap((node) => {
        return node.children.map((child) => {
            const source = uiNodes.find((uiNode) => uiNode.flowId === node.id);
            const target = uiNodes.find((uiNode) => uiNode.flowId === child.id);
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
        });
    });
    console.log("UI nodes again", uiNodes);
    console.log("edges", edges);
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
