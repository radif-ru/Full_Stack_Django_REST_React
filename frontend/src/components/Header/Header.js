import './Header.css'

import React, {PureComponent} from 'react';

import {Link} from "react-router-dom";


const Menu = () => {
  return (
    <nav className='menu'>
      <ul>
        {/*Якоря (были раньше):*/}
        <li>
          <Link to='/users'>Пользователи</Link>
        </li>
        <li>
          <Link to='/projects'>Проекты</Link>
        </li>
        <li>
          <Link to='/todos'>Заметки</Link>
        </li>
      </ul>
    </nav>
  )
}

export class Header extends PureComponent {
  render() {
    return (
      <header>
        <Menu/>
      </header>
    )
  }
}
