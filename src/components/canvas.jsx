import React, { useCallback, useEffect, useRef, useState } from "react";

const BRUSHES = ["Brush", "Spray", "Pen", "Eraser"];
const COLORS = ["Black", "White", "Red", "Green", "Blue", "Yellow", "Rainbow"];

const CanvasControls = ({ selectedColor, setSelectedColor, customColor, setCustomColor, selectedBrush, setSelectedBrush, brushSize, setBrushSize, clear }) => {

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setSelectedColor("White");
        } else if (savedTheme === "light") {
            setSelectedColor("Black");
        }

        const handleClick = () => {
            setSelectedColor((prevColor) =>
                prevColor === "Black" ? "White" :
                prevColor === "White" ? "Black" :
                prevColor
            );
        };

        const button = document.getElementById("switch");
        if (button) {
            button.addEventListener("click", handleClick);
        }

        return () => {
            if (button) {
                button.removeEventListener("click", handleClick);
            }
        };
    }, [setSelectedColor]);

    return (
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
            <button className="controls" onClick={clear} style={{ margin: "5px 10px" }}>
                Clear
            </button>
        </div>
    );
};

export default function Canvas() {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const containerRef = useRef(null);

    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [customColor, setCustomColor] = useState("#000000");
    const [selectedBrush, setSelectedBrush] = useState(BRUSHES[0]);
    const [mouseDown, setMouseDown] = useState(false);
    const [lastPosition, setPosition] = useState({ x: 0, y: 0 });
    const [brushSize, setBrushSize] = useState(10);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const hue = useRef(0);

    const getNavbarHeight = useCallback(() => {
        const navbar = document.querySelector('nav');
        const box = document.querySelector('.box');
        const buttons = document.querySelector('#buttons');
        return (navbar ? navbar.offsetHeight : 0) + 
               (box ? box.offsetHeight : 0) + 
               (buttons ? buttons.offsetHeight : 0);
    }, []);

    const updateCanvasSize = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const navbarHeight = getNavbarHeight();
        const containerHeight = window.innerHeight - navbarHeight;
        const containerWidth = window.innerWidth;

        setDimensions({
            width: containerWidth,
            height: containerHeight
        });

        canvas.width = containerWidth;
        canvas.height = containerHeight;

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "#000";
        context.lineWidth = 5;
        contextRef.current = context;
    }, [getNavbarHeight]);

    const drawFrame = useCallback((x, y) => {
        const currentContext = contextRef.current;
        if (!currentContext || !mouseDown) return;

        const setColor = (speed = 3) => {
                if (selectedBrush === "Eraser") {
                    currentContext.strokeStyle = "#fff";
                } else if (selectedColor === "Rainbow") {
                    currentContext.strokeStyle = `hsl(${hue.current}, 100%, 50%)`;
                    hue.current = (hue.current + speed) % 360;
                } else if (selectedColor === "Custom") {
                    currentContext.strokeStyle = customColor;
                } else {
                    const colorMap = {
                        Black: "#000",
                        White: "#fff",
                        Red: "#f00",
                        Green: "#0f0",
                        Blue: "#00f",
                        Yellow: "#ff0"
                    };
                    currentContext.strokeStyle = colorMap[selectedColor] || selectedColor;
                }
            };

            if (selectedBrush === "Spray") {
                const density = Math.max(50, Math.min(200, brushSize * 10));
                for (let i = 0; i < density; i++) {
                    const angle = Math.random() * 2 * Math.PI;
                    const radius = Math.random() * brushSize;
                    const offsetX = radius * Math.cos(angle);
                    const offsetY = radius * Math.sin(angle);
                    setColor(0.05);
                    currentContext.fillStyle = currentContext.strokeStyle;
                    currentContext.beginPath();
                    currentContext.arc(x + offsetX, y + offsetY, 0.8, 0, Math.PI * 2, true);
                    currentContext.fill();
                }
            } else if (selectedBrush === "Pen") {
            const lerps = Math.max(10, Math.floor(brushSize * 10));
            const lerp = (a, b, t) => a + (b - a) * t;

            const halfBrush = brushSize / 3;
            currentContext.lineWidth = brushSize / 10;
            currentContext.lineCap = 'round';
            currentContext.lineJoin = 'round';

            setColor(0.2);

            for (let i = 0; i < lerps; i++) {
                const t = i / lerps;
                const xLerp = lerp(lastPosition.x, x, t);
                const yLerp = lerp(lastPosition.y, y, t);

                currentContext.beginPath();
                currentContext.moveTo(xLerp - halfBrush, yLerp - halfBrush);
                currentContext.lineTo(xLerp + halfBrush, yLerp + halfBrush);
                currentContext.stroke();
            }
            } else if (selectedBrush === "Eraser") {
                currentContext.globalCompositeOperation = "destination-out";
                currentContext.lineWidth = brushSize * 1;
                currentContext.beginPath();
                currentContext.moveTo(lastPosition.x, lastPosition.y);
                currentContext.lineTo(x, y);
                currentContext.stroke();
                currentContext.globalCompositeOperation = "source-over";
            } else {
                setColor();
                currentContext.beginPath();
                currentContext.lineWidth = brushSize;
                currentContext.lineJoin = "round";
                currentContext.lineCap = "round";
                currentContext.moveTo(lastPosition.x, lastPosition.y);
                
                const midPoint = {
                    x: (lastPosition.x + x) / 2,
                    y: (lastPosition.y + y) / 2
                };
                currentContext.quadraticCurveTo(lastPosition.x, lastPosition.y, midPoint.x, midPoint.y);
                currentContext.lineTo(x, y);
                currentContext.stroke();
            }

            setPosition({ x, y });
        },
        [lastPosition, mouseDown, selectedColor, customColor, brushSize, selectedBrush]
    );

    const clear = useCallback(() => {
        const context = contextRef.current;
        if (context) {
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            context.restore();
        }
    }, []);

    const getCanvasCoordinates = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const handleMouseDown = useCallback((e) => {
        if (e.button !== 0) return;
        const { x, y } = getCanvasCoordinates(e);
        setPosition({ x, y });
        setMouseDown(true);
    }, []);

    const handleMouseUp = useCallback(() => {
        setMouseDown(false);
    }, []);

    const animationFrameRef = useRef(null);
    
    const draw = useCallback((x, y) => {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(() => {
            drawFrame(x, y);
        });
    }, [drawFrame]);

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

    useEffect(() => {
        updateCanvasSize();

        window.addEventListener('resize', updateCanvasSize);
        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [updateCanvasSize]);

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
            <div 
                ref={containerRef}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: `calc(100vh - ${getNavbarHeight()}px)`,
                    overflow: "hidden",
                    boxSizing: "border-box"
                }}
            >
                <canvas
                    ref={canvasRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchMove}
                    style={{ backgroundColor: "var(--background)" }}
                />
            </div>
        </>
    );
}
