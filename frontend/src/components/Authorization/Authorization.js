import "./Authorization.css"

import React from "react";


/**
 * Создание и обработка формы авторизации
 */
export class LoginForm extends React.Component {
  /**
   * Прокидывание свойств (props) от родителя, начальные состояния логина/пароля
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      "login": "",
      "password": ""
    };
  }

  /**
   * Присваивание состояний на основе события изменения поля ввода формы
   * @param event - Событие, оттуда извлекаются имена и значения login и password
   */
  handleChange(event) {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  }

  /**
   * Присваивание состояний на основе события обработки отправки данных в форме
   * login, password получен из состояния - куда они попали из this.handleChange
   * auth получается из свойств, которые передал родитель
   * @param event используется только для остановки события
   */
  handleSubmit(event) {
    const {login, password} = this.state;
    const {auth} = this.props;
    auth(login, password);
    this.setState({
      "login": "",
      "password": ""
    });
    event.preventDefault();
  }

  /**
   * Отображение формы. Получение login, password из состояния
   * Вызов методов this.handleChange и this.handleSubmit при событиях изменения
   * поля ввода и отправки данных соответственно
   * @returns {JSX.Element}
   */
  render() {

    const {login, password} = this.state;

    return (
      <form onSubmit={(event => this.handleSubmit(event))} className="row g-2">
        <div className="col-auto">
          <input
            required
            type="text"
            name="login"
            placeholder="Логин"
            aria-describedby="loginHelpInline"
            value={login}
            className="form-control"
            onChange={(event => this.handleChange(event))}
          />
          <span id="loginHelpInline" className="form-text">
            Введите Ваш уникальный логин, указанный при регистрации
          </span>
        </div>
        <div className="col-auto">
          <input
            required
            type="password"
            name="password"
            placeholder="Пароль"
            aria-describedby="passwordHelpInline"
            value={password}
            className="form-control"
            onChange={(event => this.handleChange(event))}
          />
          <span id="passwordHelpInline" className="form-text">
            Должно быть 8-20 символов.
          </span>
        </div>
        <input
          type="submit"
          value="Отправить"
          className="auth-btn btn btn-primary col-auto"
        />
      </form>
    )
  }
}
