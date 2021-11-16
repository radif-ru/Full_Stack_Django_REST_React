import './Header.css'

import React, {PureComponent} from 'react';

import {Link} from "react-router-dom";


const Menu = (props) => {
  return (
    <nav className='menu'>
      <ul>
        {/*Якоря (были раньше):*/}
        <li>
          <Link className='menu-link' to='/users'>Пользователи</Link>
        </li>
        <li>
          <Link className='menu-link' to='/projects'>Проекты</Link>
        </li>
        <li>
          <Link className='menu-link' to='/todos'>Заметки</Link>
        </li>
        <li> {!props.is_authenticated() ?
          <Link className='menu-link menu-login' to='/login'>Войти</Link> :
          <span className='menu-link menu-logout' onClick={() => props.logout()}>Выйти</span>
        }
        </li>
      </ul>
    </nav>
  )
}

export class Header extends PureComponent {
  render() {
    return (
      <header className='header'>
        <Menu is_authenticated={this.props.is_authenticated}
              logout={this.props.logout}/>
      </header>
    )
  }
}
