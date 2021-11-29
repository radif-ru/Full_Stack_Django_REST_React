import "./Header.css"

import React, {PureComponent} from "react";
import {Link} from "react-router-dom";


/**
 * Отображение меню, кнопки для пользователей в зависимости от авторизации
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Menu = (props) => {

  const {isAuthenticated, logout, login} = props;

  return (
    <nav className="menu">
      <ul>
        {/*Якоря (были раньше):*/}
        <li>
          <Link className="menu-link" to="/users">Пользователи</Link>
        </li>
        <li>
          <Link className="menu-link" to="/projects">Проекты</Link>
        </li>
        <li>
          <Link className="menu-link" to="/todos">Заметки</Link>
        </li>
        <li> {!isAuthenticated()
          ? <Link className="menu-link menu-login" to="/login">Войти</Link>
          : <span className="menu-link menu-logout" onClick={() => logout()}>
              {login} | Выйти
            </span>
        }
        </li>
      </ul>
    </nav>
  )
}

/**
 * Работа с заголовком страницы
 */
export class Header extends PureComponent {

  render() {

    const {isAuthenticated, logout, login} = this.props;

    return (
      <header className="header">
        <Menu isAuthenticated={isAuthenticated} logout={logout} login={login}/>
      </header>
    )
  }
}
