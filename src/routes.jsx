import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import App from "./app";
import LoadingScreen from "./components/loading";
import Navbar from "./components/navbar";
import Message from "./components/message";

const CanvasPage = lazy(() => import("./canvasPage"));
const CalculatorPage = lazy(() => import("./calculatorPage"));
const StopwatchPage = lazy(() => import("./stopwatchPage"));
const ShooterPage = lazy(() => import("./shooterPage"));
const PicturesPage = lazy(() => import("./picturesPage"));
const ScreensavePage = lazy(() => import("./screensaverPage"));
const SortPage = lazy(() => import("./sortPage"));

const NotFoundPage = () => (
    <>
        <Navbar />
        <Message text={"404 - Page Not Found"} />
    </>
);

export default function AppRoutes() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/canvas" element={<CanvasPage />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/stopwatch" element={<StopwatchPage />} />
                <Route path="/shooter" element={<ShooterPage />} />
                <Route path="/pictures" element={<PicturesPage />} />
                <Route path="/screensaver" element={<ScreensavePage />} />
                <Route path="/sort" element={<SortPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}
