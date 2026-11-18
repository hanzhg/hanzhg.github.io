import Navbar from "./components/navbar";
import DiscoScene from "./components/discoScene";

export default function DiscoPage() {
    return (
        <div className="disco-page">
            <Navbar />
            <main className="disco-stage" aria-label="Spinning disco ball">
                <DiscoScene />
            </main>
        </div>
    );
}
