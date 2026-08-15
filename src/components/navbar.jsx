import React, { useState } from "react";
import Sidebar from "./sidebar";
import { useTheme } from "../utils/useTheme";

const Navbar = () => {
	const { theme, toggleTheme } = useTheme();
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
