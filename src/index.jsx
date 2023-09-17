import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import CanvasPage from "./canvasPage";
import Message from "./components/message";
import Navbar from "./components/navbar";
import CalculatorPage from "./calculatorPage";
import StopwatchPage from "./stopwatchPage";
import ShooterPage from "./shooterPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path="" element={<App />} />
                <Route path="/canvas" element={<CanvasPage />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/stopwatch" element={<StopwatchPage />} />
                <Route path="/shooter" element={<ShooterPage />} />
                <Route
                    path="*"
                    element={
                        <>
                            <Navbar />
                            <Message text={"404 - Page Not Found"} />
                        </>
                    }
                />
            </Routes>
        </HashRouter>
    </React.StrictMode>
);
