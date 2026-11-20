"use client";
import { NodeResizer, useReactFlow, type NodeProps } from "@xyflow/react";

type NoteData = {
    title?: string;
    text?: string;
};

export default function NoteNode({ id, data, selected }: NodeProps) {
    const { updateNodeData, deleteElements } = useReactFlow();
    const d = data as NoteData;
    const title = d.title ?? "Note";
    const text = d.text ?? "";

    return (
        <>
            <NodeResizer
                isVisible={selected}
                minWidth={200}
                minHeight={140}
                lineStyle={{ borderColor: "#6366f1" }}
                handleStyle={{ background: "#6366f1", width: 8, height: 8, borderRadius: 2 }}
            />
            <div
                style={{
                    background: "#ffffff",
                    color: "#1f2937",
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.18)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box",
                    padding: 14,
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                    <input
                        className="nodrag"
                        value={title}
                        onChange={(e) => updateNodeData(id, { title: e.target.value })}
                        placeholder="Title"
                        style={{
                            flex: 1,
                            minWidth: 0,
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#1f2937",
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            padding: 0,
                            fontFamily: "inherit",
                        }}
                    />
                    <button
                        onClick={() => {
                            if (window.confirm("Delete this note?")) {
                                deleteElements({ nodes: [{ id }] });
                            }
                        }}
                        aria-label="Delete note"
                        style={{
                            background: "none",
                            border: "none",
                            color: "#9ca3af",
                            cursor: "pointer",
                            fontSize: 11,
                            padding: "0 2px",
                        }}
                    >
                        🗑
                    </button>
                </div>

                {/* Body: fills the remaining space and scrolls when long */}
                <textarea
                    className="nodrag nowheel"
                    value={text}
                    onChange={(e) => updateNodeData(id, { text: e.target.value })}
                    placeholder="Write something..."
                    style={{
                        flex: 1,
                        width: "100%",
                        fontSize: 11,
                        lineHeight: 1.4,
                        color: "#1f2937",
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        padding: 0,
                        resize: "none",
                        fontFamily: "inherit",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#d1d5db transparent",
                    }}
                />
            </div>
        </>
    );
}