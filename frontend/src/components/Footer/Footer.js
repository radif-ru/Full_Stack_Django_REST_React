import './Footer.css'

import React, {PureComponent} from 'react';

import logo from './logo.svg';

export class Footer extends PureComponent {
  render() {
    return (
      <footer className='footer'>
        <a
          className='App-link'
          href='https://radif.ru'
          target='_blank'
          rel='noopener noreferrer'
        >
          &copy; 2021 &reg;Radif.ru
        </a>
        <br/>
        <img src={logo} className='App-logo' alt='logo'/>
      </footer>
    )
  }
}