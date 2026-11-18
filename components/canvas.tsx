"use client";
import { useEffect, useState } from "react";
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

// NEW: storage layout
//   nodepad-canvases       -> [{ id, name }, ...]
//   nodepad-active         -> id of the canvas currently open
//   nodepad-nodes-<id>     -> the nodes for that canvas
const LIST_KEY = "nodepad-canvases";
const ACTIVE_KEY = "nodepad-active";
const NODES_PREFIX = "nodepad-nodes-";
const OLD_KEY = "nodepad-nodes"; // from before multiple canvases existed

type CanvasInfo = { id: string; name: string }; // NEW

const startingNodes: Node[] = [
    {
        id: "1",
        type: "checklist",
        position: { x: 50, y: 50 },
        data: {},
        style: { width: 250, height: 250 },
    },
];

// CHANGED: loads the nodes for one specific canvas
function loadNodes(canvasId: string): Node[] {
    try {
        const saved = localStorage.getItem(NODES_PREFIX + canvasId);
        if (saved) return JSON.parse(saved);
    } catch {}
    // First canvas gets the starter checklist, new canvases start empty
    return canvasId === "default" ? startingNodes : [];
}

// NEW: load the canvas list, creating a default one (and migrating old data) if needed
function loadCanvasList(): CanvasInfo[] {
    try {
        const saved = localStorage.getItem(LIST_KEY);
        if (saved) {
            const list = JSON.parse(saved);
            if (Array.isArray(list) && list.length > 0) return list;
        }
        // Carry over anything saved before multi-canvas support
        const old = localStorage.getItem(OLD_KEY);
        if (old) localStorage.setItem(NODES_PREFIX + "default", old);
    } catch {}
    return [{ id: "default", name: "My Canvas" }];
}

function saveList(list: CanvasInfo[]) {
    try {
        localStorage.setItem(LIST_KEY, JSON.stringify(list));
    } catch {}
}

// CHANGED: takes the canvas id as a prop
function CanvasInner({ canvasId }: { canvasId: string }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [loaded, setLoaded] = useState(false);
    const { screenToFlowPosition } = useReactFlow();

    // Load once after first render (localStorage doesn't exist on the server)
    useEffect(() => {
        setNodes(loadNodes(canvasId));
        setLoaded(true);
    }, [setNodes, canvasId]);

    // Save whenever nodes change, but only after the initial load
    useEffect(() => {
        if (!loaded) return;
        try {
            localStorage.setItem(NODES_PREFIX + canvasId, JSON.stringify(nodes));
        } catch {}
    }, [nodes, loaded, canvasId]);

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

// small shared style for the toolbar buttons
const toolbarButton: React.CSSProperties = {
    padding: "6px 10px",
    fontSize: 13,
    fontWeight: 500,
    color: "white",
    background: "#6366f1",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
};

// CHANGED: Canvas now manages the list of canvases and which one is open
export default function Canvas() {
    const [canvases, setCanvases] = useState<CanvasInfo[]>([]);
    const [activeId, setActiveId] = useState("");
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const list = loadCanvasList();
        let active = list[0].id;
        try {
            const savedActive = localStorage.getItem(ACTIVE_KEY);
            if (savedActive && list.some((c) => c.id === savedActive)) {
                active = savedActive;
            }
        } catch {}
        setCanvases(list);
        setActiveId(active);
        setReady(true);
        saveList(list);
    }, []);

    function switchTo(id: string) {
        setActiveId(id);
        try {
            localStorage.setItem(ACTIVE_KEY, id);
        } catch {}
    }

    function newCanvas() {
        const name = window.prompt("Name for the new canvas:", "Untitled");
        if (!name || !name.trim()) return;
        const created = { id: crypto.randomUUID(), name: name.trim() };
        const list = [...canvases, created];
        setCanvases(list);
        saveList(list);
        switchTo(created.id);
    }

    function renameCanvas() {
        const current = canvases.find((c) => c.id === activeId);
        const name = window.prompt("Rename canvas:", current?.name ?? "");
        if (!name || !name.trim()) return;
        const list = canvases.map((c) =>
            c.id === activeId ? { ...c, name: name.trim() } : c
        );
        setCanvases(list);
        saveList(list);
    }

    function deleteCanvas() {
        if (canvases.length <= 1) {
            window.alert("You need at least one canvas.");
            return;
        }
        const current = canvases.find((c) => c.id === activeId);
        if (!window.confirm(`Delete "${current?.name}"? This can't be undone.`)) return;
        const list = canvases.filter((c) => c.id !== activeId);
        try {
            localStorage.removeItem(NODES_PREFIX + activeId);
        } catch {}
        setCanvases(list);
        saveList(list);
        switchTo(list[0].id);
    }

    if (!ready) return null;

    return (
        <>
            {/* NEW: canvas switcher, top right */}
            <div
                style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 10,
                    display: "flex",
                    gap: 6,
                }}
            >
                <select
                    value={activeId}
                    onChange={(e) => switchTo(e.target.value)}
                    style={{
                        padding: "6px 10px",
                        fontSize: 13,
                        color: "#1f2937",
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        cursor: "pointer",
                    }}
                >
                    {canvases.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <button onClick={newCanvas} style={toolbarButton}>+ New</button>
                <button onClick={renameCanvas} style={toolbarButton}>Rename</button>
                <button onClick={deleteCanvas} style={toolbarButton}>Delete</button>
            </div>

            {/* key makes React rebuild the canvas fresh when you switch */}
            <ReactFlowProvider key={activeId}>
                <CanvasInner canvasId={activeId} />
            </ReactFlowProvider>
        </>
    );
}