"use client";
import { useState } from "react";
import { NodeResizer, type NodeProps } from "@xyflow/react";

type Item = { id: string; text: string; done: boolean };

function autoGrow(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
}

export default function ChecklistNode({ selected }: NodeProps) {
    const [items, setItems] = useState<Item[]>([]);
    const [text, setText] = useState("");
    const [title, setTitle] = useState("Checklist");
    const [description, setDescription] = useState("");

    function addItem() {
        if (!text.trim()) return;
        setItems([...items, { id: crypto.randomUUID(), text: text.trim(), done: false }]);
        setText("");
    }

    function toggle(id: string) {
        setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
    }

    function remove(id: string) {
        setItems(items.filter((i) => i.id !== id));
    }

    const doneCount = items.filter((i) => i.done).length;

    return (
        <>
            <NodeResizer
                isVisible={selected}
                minWidth={200}
                minHeight={160}
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
                <div style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <textarea
            className="nodrag"
            rows={1}
            value={title}
            ref={(el) => { if (el) autoGrow(el); }}
            onChange={(e) => {
                setTitle(e.target.value);
                autoGrow(e.target);
            }}
            placeholder="Title"
            style={{
                flex: 1,
                minWidth: 0,
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1.2,
                color: "#1f2937",
                background: "transparent",
                border: "none",
                outline: "none",
                padding: 0,
                margin: 0,
                resize: "none",
                overflow: "hidden",
                fontFamily: "inherit",
                wordBreak: "break-word",
            }}
        />
                        {items.length > 0 && (
                            <span style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap", lineHeight: "20px" }}>
                {doneCount}/{items.length}
            </span>
                        )}
                    </div>
                    <textarea
                        className="nodrag"
                        rows={1}
                        value={description}
                        ref={(el) => { if (el) autoGrow(el); }}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            autoGrow(e.target);
                        }}
                        placeholder="Add a description..."
                        style={{
                            display: "block",
                            width: "100%",
                            fontSize: 8,
                            lineHeight: 1.3,
                            color: "#6b7280",
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            padding: 0,
                            margin: 0,
                            resize: "none",
                            overflow: "hidden",
                            fontFamily: "inherit",
                            wordBreak: "break-word",
                        }}
                    />
                </div>

                {/* Items */}
                <div
                    className="nowheel"
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#d1d5db transparent",
                        marginBottom: 10,
                    }}
                >
                    {items.length === 0 && (
                        <div style={{ fontSize: 11, color: "#9ca3af", padding: "6px 0" }}>
                            Nothing here yet. Add your first item below.
                        </div>
                    )}
                    {items.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "5px 0",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={item.done}
                                onChange={() => toggle(item.id)}
                                style={{ accentColor: "#6366f1", width: 16, height: 16, cursor: "pointer" }}
                            />
                            <span style={{ flex: 1, fontSize: 11, lineHeight: 1.3, wordBreak: "break-word" }}>
                                <span
                                    style={{
                                        color: item.done ? "#9ca3af" : "#1f2937",
                                        backgroundImage: item.done
                                            ? "linear-gradient(#9ca3af, #9ca3af)"
                                            : "none",
                                        backgroundSize: "100% 1px",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "0 58%",
                                        boxDecorationBreak: "clone",
                                        WebkitBoxDecorationBreak: "clone",
                                    }}
                                >
                                    {item.text}
                                </span>
                            </span>
                            <button
                                onClick={() => remove(item.id)}
                                aria-label="Remove item"
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#9ca3af",
                                    cursor: "pointer",
                                    fontSize: 11,
                                    padding: "2px 6px",
                                    borderRadius: 6,
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add row */}
                <div style={{ display: "flex", gap: 6 }}>
                    <input
                        className="nodrag"
                        placeholder="Add an item..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addItem()}
                        style={{
                            flex: 1,
                            minWidth: 0,
                            padding: "4px 6px",
                            fontSize: 11,
                            color: "#1f2937",
                            background: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            outline: "none",
                        }}
                    />
                    <button
                        onClick={addItem}
                        style={{
                            padding: "2px 12px",
                            fontSize: 11,
                            fontWeight: 500,
                            color: "white",
                            background: "#6366f1",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </>
    );
}