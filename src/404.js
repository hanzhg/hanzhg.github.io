import Navbar from "./components/navbar";

export default function NotFound() {
    const container = {
        display: "flex",
        height: "100vh",
    };

    const centerLink = {
        textAlign: "center",
        height: "100%",
    };

    const centerText = {
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
    };

    return (
        <div>
            <Navbar />
            <div style={container}>
                <div style={centerText}>
                    <div style={centerLink}>
                        <h1>404 - Not Found!</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
