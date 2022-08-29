export default function Message(props) {
    const container = {
        display: "flex",
        height: "80vh",
        alignItems: "center",
    };

    return (
        <>
            <div style={container}>
                <div id="content">
                    <h2>{props.text}</h2>
                </div>
            </div>
        </>
    );
}
