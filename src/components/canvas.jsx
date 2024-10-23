import React, { useCallback, useEffect, useRef, useState } from "react";

const colors = ["Black", "White", "Red", "Green", "Blue", "Yellow", "Rainbow"];

export default function Canvas() {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [customColor, setCustomColor] = useState("#000000");
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
        console.log(height + offset);
        

        const context = canvas.getContext("2d");
        context.scale(1, 1);
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;
    }, []);

    const draw = useCallback(
        (x, y) => {
            if (mouseDown) {
                const currentContext = contextRef.current;
                currentContext.beginPath();

                if (selectedColor === "Rainbow") {
                    currentContext.strokeStyle = `hsl(${hue.current},100%,50%)`;
                    hue.current += 3;
                    if (hue.current >= 360) {
                        hue.current = 0;
                    }
                } else if (selectedColor === "Custom") {
                    currentContext.strokeStyle = customColor;
                } else {
                    currentContext.strokeStyle = selectedColor;
                }

                currentContext.lineWidth = brushSize;
                currentContext.lineJoin = "round";
                currentContext.moveTo(lastPosition.x, lastPosition.y);
                currentContext.lineTo(x, y);
                currentContext.closePath();
                currentContext.stroke();

                setPosition({ x, y });
            }
        },
        [lastPosition, mouseDown, selectedColor, customColor, brushSize]
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

    const onMouseDown = useCallback((e) => {
        const { x, y } = getCanvasCoordinates(e);
        setPosition({ x, y });
        setMouseDown(true);
    }, []);

    const onMouseUp = useCallback(() => {
        setMouseDown(false);
    }, []);

    const onMouseMove = useCallback((e) => {
        if (mouseDown) {
            const { x, y } = getCanvasCoordinates(e);
            draw(x, y);
        }
    }, [draw, mouseDown]);

    const onTouchStart = useCallback((e) => {
        const touch = e.touches[0];
        const { x, y } = getCanvasCoordinates(touch);
        setPosition({ x, y });
        setMouseDown(true);
    }, []);

    const onTouchEnd = useCallback(() => {
        setMouseDown(false);
    }, []);

    const onTouchMove = useCallback((e) => {
        if (mouseDown) {
            const touch = e.touches[0];
            const { x, y } = getCanvasCoordinates(touch);
            draw(x, y);
        }
    }, [draw, mouseDown]);

    return (
        <>
            <div id="buttons">
                <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                >
                    {colors.map((color) => (
                        <option key={color} value={color}>
                            {color}
                        </option>
                    ))}
                    <option value="Custom">Custom</option>
                </select>
                {selectedColor === "Custom" && (
                    <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                    />
                )}
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(e.target.value)}
                />
                <button className="controls" onClick={clear}>
                    Clear
                </button>
            </div>
            <canvas
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onMouseMove={onMouseMove}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onTouchMove={onTouchMove}
            />
        </>
    );
}
