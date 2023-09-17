import Navbar from "./components/navbar";
import Stopwatch from "./components/stopwatch/stopwatch";

export default function StopwatchPage() {
    return (
        <>
            <Navbar />
            <div className="centered">
                <Stopwatch />
            </div>
        </>
    );
}
