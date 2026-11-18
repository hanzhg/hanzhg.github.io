import { useEffect, useRef } from "react";

const rows = 36;
const columns = 72;
const ballRadius = 2;

function facetPoint(theta, phi, radius) {
    return {
        x: Math.sin(theta) * Math.cos(phi) * radius,
        y: Math.cos(theta) * radius,
        z: Math.sin(theta) * Math.sin(phi) * radius,
    };
}

function createMirrorTiles(THREE) {
    const tileCount = (rows - 2) * columns;
    const positions = new Float32Array(tileCount * 90);
    const normals = new Float32Array(positions.length);
    const colors = new Float32Array(positions.length);
    let vertexOffset = 0;

    const addTriangle = (a, b, c, color, colorScale = 1) => {
        const abX = b.x - a.x;
        const abY = b.y - a.y;
        const abZ = b.z - a.z;
        const acX = c.x - a.x;
        const acY = c.y - a.y;
        const acZ = c.z - a.z;
        let normalX = abY * acZ - abZ * acY;
        let normalY = abZ * acX - abX * acZ;
        let normalZ = abX * acY - abY * acX;
        const inverseLength = 1 / Math.hypot(normalX, normalY, normalZ);
        normalX *= inverseLength;
        normalY *= inverseLength;
        normalZ *= inverseLength;
        const centerX = (a.x + b.x + c.x) / 3;
        const centerY = (a.y + b.y + c.y) / 3;
        const centerZ = (a.z + b.z + c.z) / 3;
        if (normalX * centerX + normalY * centerY + normalZ * centerZ < 0) {
            normalX = -normalX;
            normalY = -normalY;
            normalZ = -normalZ;
        }

        for (let vertexIndex = 0; vertexIndex < 3; vertexIndex += 1) {
            const point = vertexIndex === 0 ? a : vertexIndex === 1 ? b : c;
            positions[vertexOffset] = point.x;
            positions[vertexOffset + 1] = point.y;
            positions[vertexOffset + 2] = point.z;
            normals[vertexOffset] = normalX;
            normals[vertexOffset + 1] = normalY;
            normals[vertexOffset + 2] = normalZ;
            colors[vertexOffset] = color.r * colorScale;
            colors[vertexOffset + 1] = color.g * colorScale;
            colors[vertexOffset + 2] = color.b * colorScale;
            vertexOffset += 3;
        }
    };

    const thetaStep = Math.PI / rows;
    const phiStep = (Math.PI * 2) / columns;
    for (let row = 1; row < rows - 1; row += 1) {
        const theta0 = row * thetaStep + thetaStep * 0.015;
        const theta1 = (row + 1) * thetaStep - thetaStep * 0.015;

        for (let column = 0; column < columns; column += 1) {
            const rowOffset = row % 2 === 0 ? 0 : phiStep * 0.5;
            const phi0 = column * phiStep + rowOffset + phiStep * 0.015;
            const phi1 = (column + 1) * phiStep + rowOffset - phiStep * 0.015;
            const theta = (theta0 + theta1) / 2;
            const phi = (phi0 + phi1) / 2;
            const centerPoint = facetPoint(theta, phi, 1);
            const outward = new THREE.Vector3(centerPoint.x, centerPoint.y, centerPoint.z);
            const thetaTangent = new THREE.Vector3(
                Math.cos(theta) * Math.cos(phi),
                -Math.sin(theta),
                Math.cos(theta) * Math.sin(phi)
            );
            const phiTangent = new THREE.Vector3(-Math.sin(phi), 0, Math.cos(phi));
            const halfHeight = ((theta1 - theta0) * ballRadius) / 2;
            const halfWidth = ((phi1 - phi0) * Math.sin(theta) * ballRadius) / 2;
            const baseCorners = [
                facetPoint(theta0, phi0, ballRadius),
                facetPoint(theta0, phi1, ballRadius),
                facetPoint(theta1, phi1, ballRadius),
                facetPoint(theta1, phi0, ballRadius),
            ].map((point) => new THREE.Vector3(point.x, point.y, point.z));
            const topCorners = [
                [-1, -1],
                [-1, 1],
                [1, 1],
                [1, -1],
            ].map(([vertical, horizontal]) =>
                outward.clone().multiplyScalar(ballRadius + 0.02)
                    .addScaledVector(thetaTangent, vertical * halfHeight * 0.985)
                    .addScaledVector(phiTangent, horizontal * halfWidth * 0.985)
            );
            const inDarkBand = row >= 14 && row <= 16;
            const bandHighlight = (row * 7 + column * 11) % 17 < 2;
            const variation = inDarkBand
                ? (bandHighlight ? 0.78 : 0.045)
                : 0.82 + ((row * 17 + column * 29) % 9) * 0.012;
            const faceColor = new THREE.Color(variation, variation, variation);

            addTriangle(topCorners[0], topCorners[1], topCorners[2], faceColor);
            addTriangle(topCorners[0], topCorners[2], topCorners[3], faceColor);
            for (let corner = 0; corner < 4; corner += 1) {
                const next = (corner + 1) % 4;
                addTriangle(baseCorners[corner], baseCorners[next], topCorners[next], faceColor, 0.72);
                addTriangle(baseCorners[corner], topCorners[next], topCorners[corner], faceColor, 0.72);
            }
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
}

function createStudioEnvironment(THREE) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to create the disco ball reflection environment.");

    const background = context.createLinearGradient(0, 0, 0, canvas.height);
    background.addColorStop(0, "#777777");
    background.addColorStop(0.28, "#444444");
    background.addColorStop(0.41, "#101010");
    background.addColorStop(0.52, "#080808");
    background.addColorStop(0.62, "#707070");
    background.addColorStop(0.82, "#a0a0a0");
    background.addColorStop(1, "#454545");

    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    [
        { x: 42, y: 72, width: 150, height: 24 },
        { x: 292, y: 44, width: 210, height: 30 },
        { x: 650, y: 82, width: 165, height: 22 },
        { x: 112, y: 332, width: 195, height: 25 },
        { x: 525, y: 352, width: 230, height: 28 },
        { x: 910, y: 170, width: 42, height: 190 },
    ].forEach(({ x, y, width, height }) => {
        context.fillStyle = "rgba(255, 255, 255, 0.96)";
        context.fillRect(x, y, width, height);
    });

    for (let row = 0; row < 4; row += 1) {
        for (let column = 0; column < 16; column += 1) {
            if ((row * 7 + column * 3) % 5 === 0) continue;
            const x = 20 + column * 64;
            const y = 128 + row * 64;
            const width = 18 + ((row * 11 + column * 7) % 20);
            const height = 12 + ((row * 5 + column * 13) % 14);
            context.fillStyle = "rgba(235, 235, 235, 0.28)";
            context.fillRect(x - 9, y - 7, width + 18, height + 14);
            context.fillStyle = "#ffffff";
            context.fillRect(x, y, width, height);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

export default function DiscoScene() {
    const sceneRef = useRef(null);

    useEffect(() => {
        let disposed = false;
        let renderer;
        let frameId;
        let resizeObserver;
        let environment;
        let scene;
        let motionPreference;
        let startAnimation;

        import("three").then((THREE) => {
            if (disposed || !sceneRef.current) return;

            scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
            camera.position.set(0, 0.45, 10.5);
            camera.lookAt(0, 0.9, 0);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setClearAlpha(0);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.25;
            sceneRef.current.appendChild(renderer.domElement);

            environment = createStudioEnvironment(THREE);
            scene.environment = environment;
            scene.environmentIntensity = 1.5;
            scene.add(new THREE.HemisphereLight(0xffffff, 0x303030, 0.12));

            const ball = new THREE.Group();
            ball.position.y = 0.9;
            ball.rotation.x = 0.04;
            scene.add(ball);

            const darkSphere = new THREE.Mesh(
                new THREE.SphereGeometry(ballRadius * 0.985, 48, 32),
                new THREE.MeshBasicMaterial({ color: "#3d3d3d" })
            );
            ball.add(darkSphere);

            const tileGeometry = createMirrorTiles(THREE);
            const ballMaterial = new THREE.MeshStandardMaterial({
                color: "#ffffff",
                vertexColors: true,
                metalness: 1,
                roughness: 0.035,
                envMapIntensity: 1.6,
                side: THREE.DoubleSide,
            });
            const tiles = new THREE.Mesh(tileGeometry, ballMaterial);
            tiles.renderOrder = 1;
            ball.add(tiles);
            const resize = () => {
                if (!sceneRef.current || !renderer) return;
                const { width, height } = sceneRef.current.getBoundingClientRect();
                if (!width || !height) return;
                camera.aspect = width / height;
                const halfVerticalFov = THREE.MathUtils.degToRad(camera.fov / 2);
                const halfHorizontalFov = Math.atan(
                    Math.tan(halfVerticalFov) * camera.aspect
                );
                const limitingHalfFov = Math.min(halfVerticalFov, halfHorizontalFov);
                camera.position.z = Math.max(
                    10.5,
                    ballRadius / Math.sin(limitingHalfFov * 0.88)
                );
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);
            };
            resizeObserver = new ResizeObserver(resize);
            resizeObserver.observe(sceneRef.current);
            resize();

            motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
            const render = (now) => {
                if (!motionPreference.matches) ball.rotation.y = now * 0.00035;
                scene.environmentRotation.y = -ball.rotation.y;
                renderer.render(scene, camera);
                if (!motionPreference.matches) frameId = requestAnimationFrame(render);
            };
            startAnimation = () => {
                cancelAnimationFrame(frameId);
                frameId = requestAnimationFrame(render);
            };
            motionPreference.addEventListener("change", startAnimation);
            startAnimation();
        });

        return () => {
            disposed = true;
            cancelAnimationFrame(frameId);
            resizeObserver?.disconnect();
            if (motionPreference && startAnimation) {
                motionPreference.removeEventListener("change", startAnimation);
            }
            if (renderer) {
                scene?.traverse((object) => {
                    if (!object.isMesh) return;
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                });
                renderer.dispose();
                renderer.domElement.remove();
            }
            environment?.dispose();
        };
    }, []);

    return (
        <div
            ref={sceneRef}
            className="disco-three-scene"
            role="img"
            aria-label="A three-dimensional mirrored disco ball"
        />
    );
}
