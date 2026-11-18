"use client";
import {
    ReactFlow,
    Background,
    Controls,
    useNodesState,
    type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ChecklistNode from "./nodes/checklistNode";

const nodeTypes = { checklist: ChecklistNode };

const startingNodes: Node[] = [
    {
        id: "1",
        type: "checklist",
        position: { x: 50, y: 50 },
        data: {},
        style: { width: 250, height: 250 },
    },
];

export default function Canvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState(startingNodes);

    function addChecklist() {
        const newNode: Node = {
            id: crypto.randomUUID(),
            type: "checklist",
            position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
            data: {},
            style: { width: 250, height: 250 },
        };
        setNodes((current) => [...current, newNode]);
    }

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <button
                onClick={addChecklist}
                style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    zIndex: 10,
                    padding: "8px 14px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "white",
                    background: "#6366f1",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                }}
            >
                + Checklist
            </button>
            <ReactFlow
                nodes={nodes}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}