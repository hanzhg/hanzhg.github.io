import React, { useState, useRef, useEffect } from "react";
import Navbar from "./components/navbar";

const range = (n) => Array.from({ length: n }, (_, i) => i + 1);

const shuffleArray = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

export default function SortPage() {
    const defaultCount = 7;
    const initial = shuffleArray(range(defaultCount));
    const [items, setItems] = useState(initial);
    const [isSorted, setIsSorted] = useState(false);

    // dragging state
    const [dragging, setDragging] = useState(false);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [placeholderIndex, setPlaceholderIndex] = useState(null);
    const draggedValueRef = useRef(null);
    const containerRef = useRef(null);
    const barRefs = useRef([]);

    useEffect(() => {
        barRefs.current = barRefs.current.slice(0, items.length);
    }, [items]);

    const shuffle = () => setItems(shuffleArray(items));

    const onPointerDown = (e, idx) => {
        const container = containerRef.current;
        if (!container) return;
        e.preventDefault();
        const val = items[idx];
        draggedValueRef.current = val;
        setDraggingIndex(idx);
        setPlaceholderIndex(idx);
        setDragging(true);
    };

    const computePlaceholder = (clientX) => {
        const bars = barRefs.current;
        for (let i = 0; i < bars.length; i++) {
            const el = bars[i];
            if (!el) continue;
            const r = el.getBoundingClientRect();
            const mid = r.left + r.width / 2;
            if (clientX < mid) return i;
        }
        return bars.length;
    };

    // Touch fallbacks for DevTools/mobile where touch events are emitted
    const onTouchStart = (e, idx) => {
        if (!e || !e.touches) return;
        e.preventDefault();
        onPointerDown(e, idx);
    };

    const onTouchMove = (e) => {
        if (!dragging) return;
        if (!e || !e.touches || e.touches.length === 0) return;
        e.preventDefault();
        const clientX = e.touches[0].clientX;
        const hover = computePlaceholder(clientX);
        setPlaceholderIndex(hover);
    };

    const onTouchEnd = (e) => {
        if (!dragging) return;
        e.preventDefault();
        onPointerUp(e);
    };

    const onPointerMove = (e) => {
        if (!dragging) return;
        const container = containerRef.current;
        if (!container) return;
        const clientX = e.clientX;
        const hover = computePlaceholder(clientX);
        setPlaceholderIndex(hover);
    };

    const onPointerUp = (e) => {
        if (!dragging) return;
        const from = draggingIndex;
        let to = placeholderIndex == null ? items.length : placeholderIndex;
        if (from != null && to > from) to = to - 1;
        setItems((prev) => {
            const next = prev.slice();
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            return next;
        });

        draggedValueRef.current = null;
        setDragging(false);
        setPlaceholderIndex(null);
        setDraggingIndex(null);
    };

    useEffect(() => {
        if (dragging) {
            window.addEventListener("pointermove", onPointerMove);
            window.addEventListener("pointerup", onPointerUp);
            // touch listeners as fallback (non-passive so we can prevent scrolling)
            window.addEventListener("touchmove", onTouchMove, { passive: false });
            window.addEventListener("touchend", onTouchEnd);
            return () => {
                window.removeEventListener("pointermove", onPointerMove);
                window.removeEventListener("pointerup", onPointerUp);
                window.removeEventListener("touchmove", onTouchMove);
                window.removeEventListener("touchend", onTouchEnd);
            };
        }
    }, [dragging, placeholderIndex, items, draggingIndex]);

    // detect when the list is sorted in ascending order (1..n)
    useEffect(() => {
        const sorted = items.every((v, i) => v === i + 1);
        setIsSorted(sorted);
    }, [items]);

    return (
        <>
            <Navbar />
            <div className="human-sort-centered">
                <div id="content" style={{ width: "100%", maxWidth: "695px" }}>
                    <div>
                        <h2 style={{margin: "0", fontSize: "20px", transition: "var(--transition-speed)"}}>Human Sort</h2>
                        <p style={{margin: "10px 0", fontSize: "18px"}}>
                            Drag and drop the bars to sort them manually.
                            <br />
                            Time: O(up to you), Space: O(1)
                        </p>

                        <div id="human-sort-controls">
                            <button className="controls" onClick={shuffle}>Shuffle</button>
                            <div aria-live="polite">{isSorted ? <div className="sort-status">Sorted!</div> : ""}</div>
                        </div>

                        <div className="human-sort-area" ref={containerRef}>
                            <div className="bars" role="list">
                                {(() => {
                                    // prepare refs array
                                    barRefs.current = barRefs.current || [];
                                    const nodes = [];
                                    for (let i = 0; i < items.length; i++) {
                                        if (dragging && placeholderIndex === i) {
                                            const phHeight = draggingIndex != null ? `${(items[draggingIndex] / defaultCount) * 100}%` : '40%';
                                            nodes.push(
                                                <div key={`ph-${i}`} className="bar placeholder" style={{ height: phHeight }} onContextMenu={(e) => e.preventDefault()} onTouchStart={(e) => onTouchStart(e, i)} />
                                            );
                                        }

                                        const val = items[i];
                                        nodes.push(
                                            <div
                                                key={`b-${i}-${val}`}
                                                className={"bar" + (dragging && i === draggingIndex ? " dragging-item" : "")}
                                                onPointerDown={(e) => onPointerDown(e, i)}
                                                onTouchStart={(e) => onTouchStart(e, i)}
                                                onContextMenu={(e) => e.preventDefault()}
                                                ref={(el) => (barRefs.current[i] = el)}
                                                style={{
                                                    height: `${(val / defaultCount) * 100}%`,
                                                    background: `hsl(${(val / defaultCount) * 360},80%,50%)`
                                                }}
                                            />
                                        );
                                    }

                                    // placeholder at end
                                    if (dragging && placeholderIndex === items.length) {
                                        const phHeight = draggingIndex != null ? `${(items[draggingIndex] / defaultCount) * 100}%` : '40%';
                                        nodes.push(<div key={`ph-end`} className="bar placeholder" style={{ height: phHeight }} onContextMenu={(e) => e.preventDefault()} onTouchStart={(e) => onTouchStart(e, items.length)} />);
                                    }

                                    return nodes;
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
