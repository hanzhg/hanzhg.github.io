import TimeAndDate from "./timeAndDate";
import Weather from "./weather";
import Socials from "./socials";

export default function Homepage() {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });

    return (
        <div className="centered" style={{ overflowY: "auto" }}>
            <div id="content">
                <img src="/pfp.JPG"/>
                <div className="intro-text">
                    👋, I'm Han, a graduate from <a className="links" href="https://www.umontreal.ca" target="_blank" rel="noopener noreferrer">Université de Montréal</a> with a major in Computer Science.
                    <br />
                    I'm currently working as a Software Developer II @ <a className="links" href="https://www.morganstanley.com/" target="_blank" rel="noopener noreferrer">Morgan Stanley</a> in the App Services Infra team.
                    <br />
                    I was previously a DevOps Intern @ <a className="links" href="https://www.nuance.com/index.html" target="_blank" rel="noopener noreferrer">Nuance Communications</a> working in the CoreTech Infra team
                    <br />
                    and a Software Developer Intern @ <a className="links" href="https://www.bce.ca/about-bce/bce-overview" target="_blank" rel="noopener noreferrer">Bell Canada</a> working in the Hybrid Cloud team.
                    <br />
                    I'm a fast learner who likes solving interesting problems with code.
                    <br />
                    Outside of work, I'm interested in fashion, visual media and really like taking <a className="links" href="https://www.instagram.com/hanzhg" target="_blank" rel="noopener noreferrer">photos</a>.
                    <TimeAndDate />
                    <Weather />
                </div>
                <Socials />
            </div>
        </div>
    );
}
