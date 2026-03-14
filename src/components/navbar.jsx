import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const keyName = "theme";

const useTheme = () => {
	const [theme, setTheme] = useState(() => {
		const savedTheme = localStorage.getItem(keyName);
		if (savedTheme) return savedTheme;
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	});

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem(keyName, theme);

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e) => setTheme(e.matches ? "dark" : "light");

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme]);

	const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

	return [theme, toggleTheme];
};

const Navbar = () => {
	const [theme, toggleTheme] = useTheme();

	return (
		<>
			<div className="box">
				<div className="center">
					<div id="name">Han Zhang</div>
				</div>
				<button
					type="button"
					id="switch"
					className={theme === "light" ? "icon fas fa-moon" : "icon fas fa-sun"}
					onClick={toggleTheme}
					aria-label="Toggle theme"
				/>
			</div>
			<nav>
				<ul>
					<li><Link to="/">Home</Link></li>
					<li><Link to="/canvas">Canvas</Link></li>
					<li><Link to="/calculator">Calculator</Link></li>
					<li><Link to="/stopwatch">Stopwatch</Link></li>
					<li><Link to="/shooter">Shooter</Link></li>
					<li><Link to="/pictures">Pictures</Link></li>
					<li><Link to="/screensaver">Screensaver</Link></li>
				</ul>
			</nav>
		</>
	);
};

export default React.memo(Navbar);
