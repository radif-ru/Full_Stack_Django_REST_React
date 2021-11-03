import React from "react";

const Menu = () => {
    return (
        <nav className="menu">
            <ul>
                <li><a href="#1">Начало</a></li>
                <li><a href="#2">Середина</a></li>
                <li><a href="#3">Конец</a></li>
            </ul>
        </nav>
    )
}

const Header = () => {
    return (
        <header id={1}>
            <Menu/>
        </header>
    )
}

export default Header;
