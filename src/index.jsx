import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import App from "./app";
import Navbar from "./components/navbar";
import Message from "./components/message";

const CanvasPage = lazy(() => import("./canvasPage"));
const CalculatorPage = lazy(() => import("./calculatorPage"));
const StopwatchPage = lazy(() => import("./stopwatchPage"));
const ShooterPage = lazy(() => import("./shooterPage"));
const PicturesPage = lazy(() => import("./picturesPage"));
const ScreensavePage = lazy(() => import("./screensaverPage"));

const NotFoundPage = () => (
    <>
        <Navbar />
        <Message text={"404 - Page Not Found"} />
    </>
);

const AppRoutes = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/canvas" element={<CanvasPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/stopwatch" element={<StopwatchPage />} />
            <Route path="/shooter" element={<ShooterPage />} />
            <Route path="/pictures" element={<PicturesPage />} />
            <Route path="/screensaver" element={<ScreensavePage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Suspense>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <HashRouter>
            <AppRoutes />
        </HashRouter>
    </React.StrictMode>
);
