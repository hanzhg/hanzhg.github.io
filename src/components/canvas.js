import React, { useCallback, useEffect, useRef, useState } from "react";

const colors = ["Black", "White", "Red", "Green", "Blue", "Yellow", "Rainbow"];

export default function Canvas() {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [mouseDown, setMouseDown] = useState(false);
    const [lastPosition, setPosition] = useState({ x: 0, y: 0 });

    const hue = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

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

                currentContext.strokeStyle = selectedColor;

                if (selectedColor === "Rainbow") {
                    currentContext.strokeStyle = `hsl(${hue.current},100%,50%)`;
                    hue.current++;
                    if (hue.current >= 360) {
                        hue.current = 0;
                    }
                }

                currentContext.lineWidth = 10;
                currentContext.lineJoin = "round";
                currentContext.moveTo(lastPosition.x, lastPosition.y - 155);
                currentContext.lineTo(x, y - 155);
                currentContext.closePath();
                currentContext.stroke();

                setPosition({ x, y });
            }
        },
        [lastPosition, mouseDown, selectedColor, setPosition]
    );

    const clear = () => {
        contextRef.current.clearRect(
            0,
            0,
            contextRef.current.canvas.width,
            contextRef.current.canvas.height
        );
    };

    const onMouseDown = (e) => {
        setPosition({
            x: e.pageX,
            y: e.pageY,
        });
        setMouseDown(true);
    };

    const onMouseUp = () => {
        setMouseDown(false);
    };

    const onMouseMove = (e) => {
        draw(e.pageX, e.pageY);
    };

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
                </select>
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
            />
        </>
    );
}
