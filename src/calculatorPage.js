import Navbar from "./components/navbar";
import Calculator from "./components/calculator/calculator";

export default function CalculatorPage() {
    return (
        <>
            <Navbar />
            <div className="centered">
                <Calculator/>
            </div>
        </>
    );
}
