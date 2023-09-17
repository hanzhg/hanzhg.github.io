export default function Socials() {
    const socialLinks = [
        { url: 'https://www.linkedin.com/in/hanzhg', iconClass: 'fab fa-linkedin-in' },
        { url: 'https://github.com/hanzhg', iconClass: 'fab fa-github' },
        { url: 'https://www.instagram.com/hanzhg', iconClass: 'fab fa-instagram' },
    ];

    return (
        <ul id="icons">
            {socialLinks.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                    <i className={`icon ${link.iconClass}`}></i>
                </a>
            ))}
        </ul>
    );
}