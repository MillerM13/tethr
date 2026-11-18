"use client";
import {
    ReactFlow,
    ReactFlowProvider,
    Background,
    Controls,
    useNodesState,
    useReactFlow,
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

function CanvasInner() {
    const [nodes, setNodes, onNodesChange] = useNodesState(startingNodes);
    const { screenToFlowPosition } = useReactFlow();

    function addChecklist() {
        // Center of the visible canvas, converted to canvas coordinates
        const center = screenToFlowPosition({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        });

        const width = 250;
        const height = 250;

        const offset = (nodes.length % 5) * 24;

        const newNode: Node = {
            id: crypto.randomUUID(),
            type: "checklist",
            // Subtract half the size so the node's center lands on the view's center
            position: { x: center.x - width / 2 + offset, y: center.y - height / 2 + offset},
            data: {},
            style: { width, height },
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

export default function Canvas() {
    return (
        <ReactFlowProvider>
            <CanvasInner />
        </ReactFlowProvider>
    );
}