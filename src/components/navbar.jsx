import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";

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
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const toggleSidebar = () => setSidebarOpen((s) => !s);
	const closeSidebar = () => setSidebarOpen(false);

	return (
		<>
			<div className="box">
				<button
					type="button"
					id="menu"
					className={`header-icon plus-icon ${sidebarOpen ? "open" : ""}`}
					onClick={toggleSidebar}
					aria-label={sidebarOpen ? "Close menu" : "Open menu"}
					aria-expanded={sidebarOpen}
				/>
				<div className="center">
					<div id="name">Han Zhang</div>
				</div>
				<button
					type="button"
					id="switch"
					className={`header-icon icon fas ${theme === "light" ? "fa-moon" : "fa-sun"}`}
					onClick={toggleTheme}
					aria-label="Toggle theme"
				/>
			</div>
			<Sidebar open={sidebarOpen} onClose={closeSidebar} />
		</>
	);
};

export default React.memo(Navbar);
