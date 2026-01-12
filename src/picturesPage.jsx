import React, { useRef, useEffect, useState } from "react";
import Navbar from "./components/navbar";
import Pictures from "./components/pictures";
export default function PicturesPage() {
    const navbarRef = useRef(null);
    const [navbarHeight, setNavbarHeight] = useState(0);
    useEffect(() => {
        if (navbarRef.current) {
            setNavbarHeight(navbarRef.current.offsetHeight);
        }
    }, []);
    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <div ref={navbarRef}>
                <Navbar />
            </div>
            <div style={{ flex: 1 }}>
                <Pictures />
            </div>
        </div>
    );
}