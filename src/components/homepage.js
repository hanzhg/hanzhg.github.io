import Clock from "./clock"
import Weather from "./weather";
export default function Homepage() {
    window.scroll({top: 0, left: 0, behavior: 'smooth' })
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '85vh',
        }}
      >
        <div id="content">
            <img src="./pfp.webp" alt="Profile" />
            <div>
                <div id="text">
                👋 Hi, I'm Han, a final-year Computer Science student @ <a className="links" href="https://www.umontreal.ca" target="_blank" rel="noopener noreferrer">Université de Montréal.</a>
                <br />
                I'm currently working as a Technology Analyst @ <a className="links" href="https://www.morganstanley.com/" target="_blank" rel="noopener noreferrer">Morgan Stanley</a> in the App Services Infra team.
                <br />
                I was previously a DevOps Intern @ <a className="links" href="https://www.nuance.com/index.html" target="_blank" rel="noopener noreferrer">Nuance Communications</a> working in the CoreTech Infra team
                and a Software Developer Intern @ <a className="links" href="https://www.bce.ca/about-bce/bce-overview" target="_blank" rel="noopener noreferrer">Bell Canada</a> working in the Hybrid Cloud team.
                <br />
                I'm a fast learner who likes solving interesting problems with code.
                <br />
                Outside of tech, I'm also interested in fashion and taking <a className="links" href="https://www.instagram.com/hanzhg" target="_blank" rel="noopener noreferrer">photos</a>.
                </div>
            </div>
            <Clock />
            <br />
            <Weather />
        </div>
      </div>
    );
}