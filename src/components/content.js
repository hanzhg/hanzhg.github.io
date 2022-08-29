import Socials from "./socials";

export default function Content() {
    window.scroll({top: 0, left: 0, behavior: 'smooth' })
    return (
        <div id="content">
            <img src="./pfp.webp" alt="Profile"></img>
            <div>
                <div id="text">
                👋 Hi, I'm Han, a final-year Computer Science student @ <a className="links" href="https://www.umontreal.ca" target="_blank" rel="noopener noreferrer">Université de Montréal</a>
                <br></br>
                I was previously a DevOps Intern @ <a className="links" href="https://www.nuance.com/index.html" target="_blank" rel="noopener noreferrer">Nuance Communications</a> working in the CoreTech Infra team
                and a Software Engineer Intern @ <a className="links" href="https://www.bce.ca/about-bce/bce-overview" target="_blank" rel="noopener noreferrer">Bell Canada</a> working on hybrid cloud infrastructure.
                <br></br>
                I'm a fast learner who likes solving interesting problems with code.
                <br></br>
                I also like taking <a className="links" href="https://www.instagram.com/hanzhg" target="_blank" rel="noopener noreferrer">photos</a> in my free time.
                </div>
            </div>
            <Socials />
        </div>
    );
}