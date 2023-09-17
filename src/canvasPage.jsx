import Canvas from "./components/canvas";
import Navbar from "./components/navbar";
import Construction from "./components/message";
import MediaQuery from "react-responsive";

export default function CanvasPage() {
    return (
        <>
            <Navbar />
            <MediaQuery minDeviceWidth={1224}>
                <Canvas />
            </MediaQuery>
            <MediaQuery maxDeviceWidth={1224}>
                <Construction text={"Please use a desktop to interact"} />
            </MediaQuery>
        </>
    );
}
