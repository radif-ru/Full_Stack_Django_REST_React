import './Footer.css'

import React, {PureComponent} from 'react';

import logo from './logo.svg';

export class Footer extends PureComponent {
  render() {
    return (
      <footer>
        <img src={logo} className='App-logo' alt='logo'/>
        <a
          className='App-link'
          href='https://radif.ru'
          target='_blank'
          rel='noopener noreferrer'
        >
          Radif.ru
        </a>
      </footer>
    )
  }
}