import React, { useState, useEffect, useCallback, useRef } from "react";
import "../../styles.css";

const MIN_DIRECTION_COMPONENT = 0.35;

const randomDiagonalAngle = () => {
    const minimumAngle = Math.asin(MIN_DIRECTION_COMPONENT);
    const angleWithinQuadrant = minimumAngle + Math.random() * (Math.PI / 2 - 2 * minimumAngle);
    return angleWithinQuadrant + Math.floor(Math.random() * 4) * (Math.PI / 2);
};

export default function Shooter() {
    const [targetPosition, setTargetPosition] = useState(null);
    const [started, setStarted] = useState(false);
    const [difficulty, setDifficulty] = useState("easy");
    const [buttonCount, setButtonCount] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const arenaRef = useRef(null);
    const targetRef = useRef(null);
    const controlsRef = useRef(null);
    const playableBoundsRef = useRef({ maxX: 0, minY: 0, maxY: 0 });
    const positionRef = useRef({ x: 0, y: 0 });
    const velocityRef = useRef({ dx: 0, dy: 0 });
    const lastHeadingSnapRef = useRef(0);
    const buttonCountRef = useRef(0);

    const getPlayableBounds = useCallback(() => {
        const arena = arenaRef.current;
        if (!arena) return { maxX: 0, minY: 0, maxY: 0 };

        const targetSize = difficulty === "very-hard" ? 32 : 40;
        const arenaTop = arena.getBoundingClientRect().top;
        const maxY = Math.max(0, arena.clientHeight - targetSize);
        const controlsBottom = controlsRef.current?.getBoundingClientRect().bottom ?? 0;
        const navbarBottom = document.querySelector(".box")?.getBoundingClientRect().bottom ?? 0;

        return {
            maxX: Math.max(0, arena.clientWidth - targetSize),
            minY: Math.min(Math.max(0, Math.max(controlsBottom, navbarBottom) - arenaTop + 12), maxY),
            maxY,
        };
    }, [difficulty]);

    const moveTarget = useCallback(() => {
        const { maxX, minY, maxY } = getPlayableBounds();
        const previousPosition = started ? positionRef.current : null;
        const minimumSeparation = Math.hypot(maxX, maxY - minY) * 0.3;
        let position;
        let farthestPosition;
        let farthestDistance = -1;

        for (let attempt = 0; attempt < 12; attempt++) {
            const candidate = {
                x: Math.random() * maxX,
                y: minY + Math.random() * (maxY - minY),
            };
            const distance = previousPosition
                ? Math.hypot(candidate.x - previousPosition.x, candidate.y - previousPosition.y)
                : Infinity;

            if (distance > farthestDistance) {
                farthestPosition = candidate;
                farthestDistance = distance;
            }
            if (distance >= minimumSeparation) {
                position = candidate;
                break;
            }
        }
        position ??= farthestPosition;

        const angle = randomDiagonalAngle();
        const speed = difficulty === "very-hard" ? 12.5 : difficulty === "hard" ? 8 : difficulty === "medium" ? 4 : 2;

        positionRef.current = position;
        velocityRef.current = { dx: speed * Math.cos(angle), dy: speed * Math.sin(angle) };
        setTargetPosition(position);
    }, [difficulty, getPlayableBounds, started]);

    const startGeneration = () => {
        lastHeadingSnapRef.current = window.performance.now();
        moveTarget();
        setStarted(true);
    };

    const resetGame = () => {
        setTargetPosition(null);
        positionRef.current = { x: 0, y: 0 };
        velocityRef.current = { dx: 0, dy: 0 };
        setStarted(false);
        setButtonCount(0);
        buttonCountRef.current = 0;
        setStartTime(null);
        setEndTime(null);
    };

    const registerTargetHit = () => {
        buttonCountRef.current++;
        setButtonCount(buttonCountRef.current);
        if (buttonCountRef.current === 1) {
            setStartTime(Date.now());
        }
        if (buttonCountRef.current === 10) {
            setEndTime(Date.now());
        }
        moveTarget();
    };

    useEffect(() => {
        if (!started || difficulty === "easy") {
            return undefined;
        }

        let animationId;
        let lastTimestamp;
        const updatePlayableBounds = () => {
            playableBoundsRef.current = getPlayableBounds();
        };
        updatePlayableBounds();
        window.addEventListener("resize", updatePlayableBounds);

        const animate = (timestamp) => {
            const arena = arenaRef.current;
            if (!arena) return;

            const frameScale = lastTimestamp ? Math.min(timestamp - lastTimestamp, 32) / 16.67 : 1;
            lastTimestamp = timestamp;
            const { maxX, minY, maxY } = playableBoundsRef.current;
            let { x, y } = positionRef.current;
            let { dx, dy } = velocityRef.current;
            let movementScale = frameScale;

            if (difficulty === "very-hard") {
                const turnAngle = Math.sin(timestamp / 1000) * 0.01 * frameScale;
                const cosine = Math.cos(turnAngle);
                const sine = Math.sin(turnAngle);
                [dx, dy] = [dx * cosine - dy * sine, dx * sine + dy * cosine];
                movementScale *= 0.65 + 0.35 * (0.5 + 0.5 * Math.sin(timestamp / 240));

                const velocityMagnitude = Math.hypot(dx, dy);
                const isNearAxis = Math.abs(dx) < velocityMagnitude * 0.25 || Math.abs(dy) < velocityMagnitude * 0.25;
                if (isNearAxis && timestamp - lastHeadingSnapRef.current >= 2000) {
                    const angle = randomDiagonalAngle();
                    dx = velocityMagnitude * Math.cos(angle);
                    dy = velocityMagnitude * Math.sin(angle);
                    lastHeadingSnapRef.current = timestamp;
                }
            }

            x += dx * movementScale;
            y += dy * movementScale;

            if (x < 0 || x > maxX) {
                x = Math.min(maxX, Math.max(0, x));
                dx = difficulty === "very-hard" ? -dx : -dx * (0.9 + Math.random() * 0.2);
                if (difficulty !== "very-hard") dy *= 0.9 + Math.random() * 0.2;
            }
            if (y < minY || y > maxY) {
                y = Math.min(maxY, Math.max(minY, y));
                dy = difficulty === "very-hard" ? -dy : -dy * (0.9 + Math.random() * 0.2);
                if (difficulty !== "very-hard") dx *= 0.9 + Math.random() * 0.2;
            }

            positionRef.current = { x: Math.min(maxX, Math.max(0, x)), y: Math.min(maxY, Math.max(0, y)) };
            velocityRef.current = { dx, dy };
            if (targetRef.current) {
                targetRef.current.style.translate = `${positionRef.current.x}px ${positionRef.current.y}px`;
            }
            animationId = window.requestAnimationFrame(animate);
        };

        animationId = window.requestAnimationFrame(animate);

        return () => {
            window.cancelAnimationFrame(animationId);
            window.removeEventListener("resize", updatePlayableBounds);
        };
    }, [started, difficulty, getPlayableBounds]);

    useEffect(() => {
        if (buttonCount === 10 && startTime && endTime) {
            const timeTaken = (endTime - startTime) / 1000;
            alert(`Time taken to reach 10 buttons: ${timeTaken} seconds`);
        }
    }, [buttonCount, startTime, endTime]);

    return (
        <main className="shooter-game">
            <div className="shooter-arena" ref={arenaRef} role="region" aria-label="Shooter game area">
                {started && targetPosition && (
                    <button
                        key={buttonCount}
                        ref={targetRef}
                        className={[
                            "random-button",
                            difficulty !== "easy" && `spinning-${difficulty}`,
                            difficulty === "very-hard" && "very-hard-target",
                        ].filter(Boolean).join(" ")}
                        style={{ translate: `${targetPosition.x}px ${targetPosition.y}px` }}
                        aria-label="Hit the target"
                        onPointerDown={(event) => {
                            if (event.button === 0) registerTargetHit();
                        }}
                        onClick={(event) => {
                            if (event.detail === 0) registerTargetHit();
                        }}
                    />
                )}
            </div>
            <div id="buttons" className="shooter-controls" ref={controlsRef}>
                <div className="shooter-control-row">
                    <label htmlFor="shooter-difficulty">Difficulty</label>
                    <select
                        id="shooter-difficulty"
                        value={difficulty}
                        onChange={(event) => setDifficulty(event.target.value)}
                        disabled={started}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="very-hard">Very Hard</option>
                    </select>
                    <button className="controls" onClick={startGeneration} disabled={started}>
                        Start
                    </button>
                    <button className="controls" onClick={resetGame}>
                        Reset
                    </button>
                </div>
                <p style={{ fontSize: "18px", userSelect: "none" }}>Target Hit Count: {buttonCount}</p>
            </div>
        </main>
    );
}
