import { Link } from "react-router-dom";

const keyName = "theme";

function onClick(e) {
    e.stopPropagation();
    if (theme.value === "light") {
        theme.value = "dark";
        document.querySelector("#switch").className = "icon fas fa-sun";
    } else {
        theme.value = "light";
        document.querySelector("#switch").className = "icon fas fa-moon";
    }
    setPreference();
}

const getColorPreference = () => {
    if (localStorage.getItem(keyName)) {
        return localStorage.getItem(keyName);
    } else {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }
};

const setPreference = () => {
    localStorage.setItem(keyName, theme.value);
    reflectPreference();
};

const reflectPreference = () => {
    document.firstElementChild.setAttribute("data-theme", theme.value);
};

const theme = {
    value: getColorPreference(),
};

reflectPreference();

window.onchange = () => {
    reflectPreference();
    if (theme.value === "light") {
        document.querySelector("#switch").className = "icon fas fa-moon";
    } else {
        document.querySelector("#switch").className = "icon fas fa-sun";
    }
    document.querySelector("#switch").addEventListener("click", onClick);
};

window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({ matches: isDark }) => {
        if (isDark) {
            theme.value = "dark";
            document.querySelector("#switch").className = "icon fas fa-sun";
        } else {
            theme.value = "light";
            document.querySelector("#switch").className = "icon fas fa-moon";
        }
        setPreference();
    });

export default function Navbar() {
    return (
        <div>
            <div className="box">
                <div className="center">
                    <div id="name">Han Zhang</div>
                </div>
                <button
                    id="switch"
                    className="icon fas fa-moon"
                    onClick={onClick}
                ></button>
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
            </nav>
        </div>
    );
}
