import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import App from "./app";
import Navbar from "./components/navbar";
import Message from "./components/message";


(function cleanTrackingParams() {
    const paramsToRemove = ['utm_source', 'utm_medium', 'utm_content','utm_term', 'utm_campaign', 'fbclid'];
    try {
        const url = new URL(window.location.href);
        let changed = false;
        paramsToRemove.forEach(k => { if (url.searchParams.has(k)) { url.searchParams.delete(k); changed = true; } });
        if (changed) {
            const newSearch = url.searchParams.toString();
            const newUrl = url.pathname + (newSearch ? '?' + newSearch : '') + url.hash;
            history.replaceState(null, '', newUrl);
        }
    } catch (e) {
        console.debug('UTM strip failed:', e);
    }
})();

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
