import { Handle, Position } from "reactflow";
import styled from "styled-components";

import "reactflow/dist/style.css";

const magenta = "#f910a0";
const yellow = "#f8bf30";
const blue = "#32bef5";
const purple = "#9e7aff";
const green = "#f0f4c3";

export function InputUiNode({ data }: any) {
    return (
        <Node style={{ borderColor: magenta }} onClick={data.onClick}>
            <Title>User input</Title>
            <Body>{data.label}</Body>
            <Handle type="source" position={Position.Bottom} />
        </Node>
    );
}

export function StageUiNode({ data }: any) {
    return (
        <Node style={{ borderColor: blue }} onClick={data.onClick}>
            <Title>Stage</Title>
            <Body>{data.label}</Body>
            <Handle type="source" position={Position.Bottom} />
            <Handle type="target" position={Position.Top} />
        </Node>
    );
}

const Node = styled.div`
    height: 90px;
    width: 200px;
    border: 2px solid #ffb6c1;
    padding: 15px;
    border-radius: 5px;
    background: white;
`;

const Title = styled.div`
    font-size: 1.2em;
`;

const Body = styled.div`
    font-size: 1em;
`;
