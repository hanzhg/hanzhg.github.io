import React, { useRef, useEffect, useState } from "react";
import Navbar from "./components/navbar";
import Gallery from "./components/gallery";

export default function PicturesPage() {
    const navbarRef = useRef(null);
    const [navbarHeight, setNavbarHeight] = useState(0);

    useEffect(() => {
        if (navbarRef.current) {
            setNavbarHeight(navbarRef.current.offsetHeight);
            console.log(navbarRef.current.offsetHeight);
        }
    }, []);

    return (
        <div>
            <div ref={navbarRef}>
                <Navbar />
            </div>
            <div className="gallery-container" style={{ marginTop: -navbarHeight }}>
                <Gallery />
            </div>
        </div>
    );
}
