import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import App from "./App";
import CanvasPage from "./canvasPage";
import CalculatorPage from "./calculatorPage";
import StopwatchPage from "./stopwatchPage";
import ShooterPage from "./shooterPage";
import Navbar from "./components/navbar";
import Message from "./components/message";
import PicturesPage from "./picturesPage";

const NotFoundPage = () => (
    <>
        <Navbar />
        <Message text={"404 - Page Not Found"} />
    </>
);

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="/canvas" element={<CanvasPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/stopwatch" element={<StopwatchPage />} />
        <Route path="/shooter" element={<ShooterPage />} />
        <Route path="/pictures" element={<PicturesPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <HashRouter>
            <AppRoutes />
        </HashRouter>
    </React.StrictMode>
);