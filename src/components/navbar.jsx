import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const keyName = "theme";

const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem(keyName);
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    useEffect(() => {
        const reflectPreference = () => {
            document.firstElementChild.setAttribute("data-theme", theme);
            const switchIcon = document.querySelector("#switch");
            if (switchIcon) {
                switchIcon.className = theme === "light" ? "icon fas fa-moon" : "icon fas fa-sun";
            }
        };

        reflectPreference();
        localStorage.setItem(keyName, theme);

        const handleChange = ({ matches: isDark }) => {
            setTheme(isDark ? "dark" : "light");
        };

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return [theme, toggleTheme];
};

export default function Navbar() {
    const [theme, toggleTheme] = useTheme();

    return (
        <>
            <div className="box">
                <div className="center">
                    <div id="name">Han Zhang</div>
                </div>
                <button id="switch" className="icon fas fa-moon" onClick={toggleTheme}></button>
            </div>
            <nav>
                <li>
                    <Link to={"/"}>Home</Link>
                </li>
                {/* <li><Link to={"/canvas"}>Game of Life</Link></li> */}
                <li>
                    <Link to={"/canvas"}>Canvas</Link>
                </li>
                <li>
                    <Link to={"/calculator"}>Calculator</Link>
                </li>
                <li>
                    <Link to={"/stopwatch"}>Stopwatch</Link>
                </li>
                <li>
                    <Link to={"/shooter"}>Shooter</Link>
                </li>
            </nav>
        </>
    );
}
