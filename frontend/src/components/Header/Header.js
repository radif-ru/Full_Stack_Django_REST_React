import "./Header.css"

import React, {PureComponent} from "react";
import {Link} from "react-router-dom";


/**
 * Отображение меню, кнопок для пользователей - личный кабинет, войти, выйти -
 * в зависимости от авторизации
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Menu = (props) => {

  const {isAuthenticated, logout, login, users} = props;
  // Авторизованный пользователь
  const user = users.find(user => user.username === login)

  return (
    <nav className="menu">
      <ul>
        <li>
          <Link className="menu-link" to="/users">Пользователи</Link>
        </li>
        <li>
          <Link className="menu-link" to="/projects">Проекты</Link>
        </li>
        <li>
          <Link className="menu-link" to="/todos">Заметки</Link>
        </li>
        {isAuthenticated() && user &&
        <li>
          <Link
            className="menu-link"
            to={`/users/${user.id}`}
          >
            ЛК | {login}
          </Link>
        </li>
        }
        {isAuthenticated()
          ? <li>
            <span className="menu-link menu-logout" onClick={() => logout()}>
              Выйти
            </span>
          </li>
          : <li>
            <Link className="menu-link menu-login" to="/login">Войти</Link>
          </li>
        }

        {!isAuthenticated() &&
        <li>
          <Link className="menu-link menu-login" to="/registration">
            Регистрация
          </Link>
        </li>
        }
      </ul>
    </nav>
  )
}

/**
 * Работа с заголовком страницы
 */
export class Header extends PureComponent {

  render() {

    const {isAuthenticated, logout, login, users} = this.props;

    return (
      <header className="header">
        <Menu
          isAuthenticated={isAuthenticated}
          logout={logout}
          login={login}
          users={users}
        />
      </header>
    )
  }
}
