import React from "react";
import Navbar from "./components/navbar";
import Pictures from "./components/pictures";
export default function PicturesPage() {
    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <div>
                <Navbar />
            </div>
            <div style={{ flex: 1 }}>
                <Pictures />
            </div>
        </div>
    );
}