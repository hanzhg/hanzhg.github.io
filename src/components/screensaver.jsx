import React, { useRef, useEffect, useState, useCallback } from "react";

const SPEED = 2;
const TEXT = "Han Zhang";

const randomColor = () => `hsl(${Math.random() * 360}, 70%, 50%)`;

const randomAngle = () => {
    let angle;
    do {
        angle = Math.random() * 2 * Math.PI;
    } while (Math.abs(Math.cos(angle)) < 0.2 || Math.abs(Math.sin(angle)) < 0.2);
    return angle;
};

export default function Screensaver() {
    const canvasRef = useRef(null);
    const positionRef = useRef({ x: 0, y: 0 });
    const velocityRef = useRef({ dx: 0, dy: 0 });
    const fontRef = useRef("");

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const [textSize, setTextSize] = useState({ width: 0, height: 0 });
    const [color, setColor] = useState(randomColor());

    const getNavbarHeight = useCallback(() => {
        const navbar = document.querySelector("nav");
        const box = document.querySelector(".box");
        return navbar ? navbar.offsetHeight + (box ? box.offsetHeight : 0) : 0;
    }, []);

    const updateCanvasSize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const navbarHeight = getNavbarHeight();
        const w = window.innerWidth;
        const h = window.innerHeight - navbarHeight;

        // support high-DPI / Retina displays
        const dpr = window.devicePixelRatio || 1;
        const cssW = w;
        const cssH = h;

        canvas.width = Math.floor(cssW * dpr);
        canvas.height = Math.floor(cssH * dpr);
        canvas.style.width = `${cssW}px`;
        canvas.style.height = `${cssH}px`;
        setDimensions({ width: cssW, height: cssH });

        const ctx = canvas.getContext("2d");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const nameElement = document.getElementById("name");
        if (!nameElement) return;

        const style = window.getComputedStyle(nameElement);
        fontRef.current = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        ctx.font = fontRef.current;

        const textWidth = ctx.measureText(TEXT).width;
        const textHeight = parseInt(style.fontSize);
        setTextSize({ width: textWidth, height: textHeight });

        positionRef.current = {
            x: Math.random() * Math.max(0, (cssW - textWidth)),
            y: Math.random() * Math.max(0, (cssH - textHeight))
        };

        const angle = randomAngle();
        velocityRef.current = {
            dx: SPEED * Math.cos(angle),
            dy: SPEED * Math.sin(angle)
        };
    }, [getNavbarHeight]);

    useEffect(() => {
        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);
        return () => window.removeEventListener("resize", updateCanvasSize);
    }, [updateCanvasSize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.textBaseline = "top";

        let animationId;

        const draw = () => {
            // clear the backing buffer properly (handle transform)
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.restore();

            ctx.font = fontRef.current;
            ctx.fillStyle = color;
            const { x, y } = positionRef.current;
            ctx.fillText(TEXT, x, y);
        };

        const update = () => {
            let { x, y } = positionRef.current;
            let { dx, dy } = velocityRef.current;
            const { width: textW, height: textH } = textSize;

            x += dx;
            y += dy;

            let hit = false;

            if (x <= 0 || x + textW >= dimensions.width) {
                dx = -dx * (0.9 + Math.random() * 0.2);
                dy = dy * (0.9 + Math.random() * 0.2);
                hit = true;
            }

            if (y <= 0 || y + textH >= dimensions.height) {
                dy = -dy * (0.9 + Math.random() * 0.2);
                dx = dx * (0.9 + Math.random() * 0.2);
                hit = true;
            }

            if (hit) {
                if (Math.abs(dx) < 0.5) dx += Math.sign(dx || 1) * 0.5;
                if (Math.abs(dy) < 0.5) dy += Math.sign(dy || 1) * 0.5;
                setColor(randomColor());
            }

            positionRef.current = { x, y };
            velocityRef.current = { dx, dy };

            draw();
            animationId = requestAnimationFrame(update);
        };

        animationId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationId);
    }, [color, textSize, dimensions]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: `calc(100vh - ${getNavbarHeight()}px)`,
                width: "100%",
                overflow: "hidden",
                boxSizing: "border-box"
            }}
        >
            <canvas
                ref={canvasRef}
                style={{ display: "block", backgroundColor: "var(--background)" }}
            />
        </div>
    );
}
