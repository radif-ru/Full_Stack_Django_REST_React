import './Authorization.css'

import React from "react";


export class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'login': '',
      'password': ''
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    this.props.auth(this.state.login, this.state.password)
    this.setState({
      'login': '',
      'password': ''
    })
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={(event => this.handleSubmit(event))}
            className='row g-2'>
        <div className='col-auto'>
          <input type='text' name='login' placeholder='Логин'
                 aria-describedby='loginHelpInline'
                 value={this.state.login} className='form-control'
                 onChange={(event => this.handleChange(event))}/>
          <span id='loginHelpInline' className="form-text">
            Введите Ваш уникальный логин, указанный при регистрации
          </span>
        </div>
        <div className='col-auto'>
          <input type='password' name='password' placeholder='Пароль'
                 aria-describedby='passwordHelpInline'
                 value={this.state.password} className='form-control'
                 onChange={(event => this.handleChange(event))}/>
          <span id='passwordHelpInline' className="form-text">
            Должно быть 8-20 символов.
          </span>
        </div>
        <input type='submit' value='Отправить'
               className='auth-btn btn btn-primary col-auto'/>
      </form>
    )
  }
}
