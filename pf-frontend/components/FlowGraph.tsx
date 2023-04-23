import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';

import { initialEdges, initialNodes } from './initial-elements';

const minimapStyle = {
  height: 120,
};

const onInit = (reactFlowInstance: any) => console.log('flow loaded:', reactFlowInstance);

export const FlowGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<{label: string}>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<{label: string}>(initialEdges);
  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  const edgesWithUpdatedTypes = edges.map((edge) => {
    if (edge.sourceHandle) {
        //@ts-ignore this was in the library example so I hope it's ok
      const edgeType = nodes.find((node) => node.type === 'custom').data.selects[edge.sourceHandle];
      edge.type = edgeType;
    }

    return edge;
  });

  return (
    <div style={{ width: '80vw', height: '50vh' }}>
      <ReactFlow
      nodes={nodes}
      edges={edgesWithUpdatedTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      fitView
      attributionPosition="top-right"
      >
        <MiniMap style={minimapStyle} zoomable pannable />
        <Controls />
        <Background color="#fff" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default FlowGraph;
