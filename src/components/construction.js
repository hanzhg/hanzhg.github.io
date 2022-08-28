export default function InConstruction() {
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
        <>
            <div style={container}>
                <div style={centerText}>
                    <div style={centerLink}>
                        <div id="content">
                            <h2>🚧 Under construction! 🚧</h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
