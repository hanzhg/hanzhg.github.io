import React, { useCallback, useEffect, useRef, useState } from "react";

const BRUSHES = ["Brush", "Spray", "Pen"];
const COLORS = ["Black", "White", "Red", "Green", "Blue", "Yellow", "Rainbow"];

const CanvasControls = ({ selectedColor, setSelectedColor, customColor, setCustomColor, selectedBrush, setSelectedBrush, brushSize, setBrushSize, clear }) => (
    <div id="buttons">
        <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
            {COLORS.map((color) => (
                <option key={color} value={color}>
                    {color}
                </option>
            ))}
            <option value="Custom">Custom</option>
        </select>
        {selectedColor === "Custom" && (
            <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} />
        )}
        <select value={selectedBrush} onChange={(e) => setSelectedBrush(e.target.value)}>
            {BRUSHES.map((brush) => (
                <option key={brush} value={brush}>
                    {brush}
                </option>
            ))}
        </select>
        <input type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(e.target.value)} />
        <button className="controls" onClick={clear}>
            Clear
        </button>
    </div>
);

export default function Canvas() {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [customColor, setCustomColor] = useState("#000000");
    const [selectedBrush, setSelectedBrush] = useState(BRUSHES[0]);
    const [mouseDown, setMouseDown] = useState(false);
    const [lastPosition, setPosition] = useState({ x: 0, y: 0 });
    const [brushSize, setBrushSize] = useState(10);

    const hue = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const width = window.innerWidth;
        const offset = document.querySelector('nav').offsetHeight + document.querySelector('.box').offsetHeight + document.querySelector('#buttons').offsetHeight;
        const height = window.innerHeight - offset;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.scale(1, 1);
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;
    }, []);

    const draw = useCallback(
        (x, y) => {
            if (!mouseDown) return;

            const currentContext = contextRef.current;
            const setColor = (speed = 3) => {
                if (selectedColor === "Rainbow") {
                    currentContext.strokeStyle = `hsl(${hue.current},100%,50%)`;
                    hue.current = (hue.current + speed) % 360;
                } else {
                    currentContext.strokeStyle = selectedColor === "Custom" ? customColor : selectedColor;
                }
            };

            if (selectedBrush === "Spray") {
                for (let i = 0; i < 100; i++) {
                    const angle = Math.random() * 3 * Math.PI;
                    const radius = Math.random() * brushSize;
                    const offsetX = radius * Math.cos(angle);
                    const offsetY = radius * Math.sin(angle);
                    setColor(0.04);
                    currentContext.fillStyle = currentContext.strokeStyle;
                    currentContext.beginPath();
                    currentContext.arc(x + offsetX, y + offsetY, 1, 0, Math.PI * 2, true);
                    currentContext.fill();
                }
            } else if (selectedBrush === "Pen") {
                const lerps = 16;
                const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
                currentContext.lineWidth = brushSize / 4; // Make the stroke thinner
                for (let i = 0; i < lerps; i++) {
                    const xLerp = lerp(lastPosition.x, x, i / lerps);
                    const yLerp = lerp(lastPosition.y, y, i / lerps);
                    setColor(0.2);
                    currentContext.beginPath();
                    currentContext.moveTo(xLerp - brushSize / 3, yLerp - brushSize / 3);
                    currentContext.lineTo(xLerp + brushSize / 3, yLerp + brushSize / 3);
                    currentContext.stroke();
                }
            } else {
                setColor();
                currentContext.beginPath();
                currentContext.lineWidth = brushSize;
                currentContext.lineJoin = "round";
                currentContext.moveTo(lastPosition.x, lastPosition.y);
                currentContext.lineTo(x, y);
                currentContext.closePath();
                currentContext.stroke();
            }

            setPosition({ x, y });
        },
        [lastPosition, mouseDown, selectedColor, customColor, brushSize, selectedBrush]
    );

    const clear = useCallback(() => {
        const context = contextRef.current;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }, []);

    const getCanvasCoordinates = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    const handleMouseDown = useCallback((e) => {
        const { x, y } = getCanvasCoordinates(e);
        setPosition({ x, y });
        setMouseDown(true);
    }, []);

    const handleMouseUp = useCallback(() => {
        setMouseDown(false);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (mouseDown) {
            const { x, y } = getCanvasCoordinates(e);
            draw(x, y);
        }
    }, [draw, mouseDown]);

    const handleTouchStart = useCallback((e) => {
        const touch = e.touches[0];
        const { x, y } = getCanvasCoordinates(touch);
        setPosition({ x, y });
        setMouseDown(true);
    }, []);

    const handleTouchEnd = useCallback(() => {
        setMouseDown(false);
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (mouseDown) {
            const touch = e.touches[0];
            const { x, y } = getCanvasCoordinates(touch);
            draw(x, y);
        }
    }, [draw, mouseDown]);

    return (
        <>
            <CanvasControls
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                customColor={customColor}
                setCustomColor={setCustomColor}
                selectedBrush={selectedBrush}
                setSelectedBrush={setSelectedBrush}
                brushSize={brushSize}
                setBrushSize={setBrushSize}
                clear={clear}
            />
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
            />
        </>
    );
}
