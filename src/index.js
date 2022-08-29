import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles.css";
import "./queries.css"
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import CanvasPage from "./canvasPage";
import Message from "./components/message";
import Navbar from "./components/navbar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path="" element={<App />} />
                <Route path="/canvas" element={<CanvasPage />} />
                <Route path="*" element={
                    <>
                        <Navbar />
                        <Message text = {"404 - Not Found!"} />
                    </>
                } />
            </Routes>
        </HashRouter>
    </React.StrictMode>
);
