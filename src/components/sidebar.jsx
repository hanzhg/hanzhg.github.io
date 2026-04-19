import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ open = false, onClose = () => {} }) => {
    return (
        <>
            <aside className={`sidebar ${open ? "open" : ""}`} role="navigation" aria-hidden={!open}>
                <ul>
                    <li><Link to="/" onClick={onClose}>About</Link></li>
                    <li><Link to="/pictures" onClick={onClose}>Pictures</Link></li>
                    <li><Link to="/canvas" onClick={onClose}>Canvas</Link></li>
                    <li><Link to="/calculator" onClick={onClose}>Calculator</Link></li>
                    <li><Link to="/stopwatch" onClick={onClose}>Stopwatch</Link></li>
                    <li><Link to="/shooter" onClick={onClose}>Shooter</Link></li>
                    <li><Link to="/screensaver" onClick={onClose}>Screensaver</Link></li>
                    <li><Link to="/sort" onClick={onClose}>Sort</Link></li>
                </ul>
            </aside>
        </>
    );
};

export default React.memo(Sidebar);
