import React from "react";
import logo from "../../logo.svg";

const Footer = () => {
    return (
        <footer id={3}>
            <img src={logo} className="App-logo" alt="logo"/>
            <a
                className="App-link"
                href="https://radif.ru"
                target="_blank"
                rel="noopener noreferrer"
            >
                Radif.ru
            </a>
        </footer>
    )
}

export default Footer;
