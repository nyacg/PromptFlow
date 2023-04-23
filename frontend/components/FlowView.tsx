import { expertOpinion } from "../../src/bin/examples/singleNodeFlow";
import ReactFlow, { addEdge, Background, Controls, MiniMap, useEdgesState, useNodesState } from "reactflow";
import { useCallback, useEffect, useState } from "react";
import ColorSelectorNode from "./ColorSelectorNode";

const initBgColor = "#dad8f6";
const connectionLineStyle = { stroke: "#fff" };
const snapGrid = [20, 20];
const nodeTypes = {
    selectorNode: ColorSelectorNode,
};

export function FlowView() {
    const [bgColor, setBgColor] = useState(initBgColor);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

    const rootNode = expertOpinion();

    useEffect(() => {
        const onChange = (event) => {
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id !== "2") {
                        return node;
                    }

                    const color = event.target.value;

                    setBgColor(color);

                    return {
                        ...node,
                        data: {
                            ...node.data,
                            color,
                        },
                    };
                })
            );
        };

        setNodes([
            {
                id: "1",
                type: "input",
                data: { label: "An input node" },
                position: { x: 0, y: 50 },
                sourcePosition: "right",
            },
            {
                id: "2",
                type: "selectorNode",
                data: { onChange: onChange, color: initBgColor },
                style: { border: "1px solid #777", padding: 10 },
                position: { x: 300, y: 50 },
            },
            {
                id: "3",
                type: "output",
                data: { label: "Output A" },
                position: { x: 650, y: 25 },
                targetPosition: "left",
            },
            {
                id: "4",
                type: "output",
                data: { label: "Output B" },
                position: { x: 650, y: 100 },
                targetPosition: "left",
            },
        ]);

        setEdges([
            {
                id: "e1-2",
                source: "1",
                target: "2",
                animated: true,
                style: { stroke: "#fff" },
            },
            {
                id: "e2a-3",
                source: "2",
                target: "3",
                sourceHandle: "a",
                animated: true,
                style: { stroke: "#fff" },
            },
            {
                id: "e2b-4",
                source: "2",
                target: "4",
                sourceHandle: "b",
                animated: true,
                style: { stroke: "#fff" },
            },
        ]);
    }, []);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#fff" } }, eds)),
        []
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            style={{ background: bgColor, width: "1000px", height: 1000 }}
            nodeTypes={nodeTypes}
            connectionLineStyle={connectionLineStyle}
            snapToGrid={true}
            snapGrid={snapGrid}
            defaultViewport={defaultViewport}
            fitView
            attributionPosition="bottom-left"
        >
            <MiniMap
                nodeStrokeColor={(n) => {
                    if (n.type === "input") return "#0041d0";
                    if (n.type === "selectorNode") return bgColor;
                    if (n.type === "output") return "#ff0072";
                }}
                nodeColor={(n) => {
                    if (n.type === "selectorNode") return bgColor;
                    return "#fff";
                }}
            />
            <Controls />
            <Background color="#aaa" gap={16} />
        </ReactFlow>
    );
}
