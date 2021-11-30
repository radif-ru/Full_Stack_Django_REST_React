import "./Users.css"

import {PureComponent} from "react";

/**
 * Создание и обработка формы регистрации пользователя
 */
export class UserForm extends PureComponent {
  /**
   * Прокидывание свойств (props) от родителя, начальное состояние текста
   * @param props {object} Данные, переданные родителем
   */
  constructor(props) {
    super(props);
    this.state = {
      "username": "",
      "password": "",
      "confirmPassword": "",
      "firstName": "",
      "lastName": "",
      "middleName": "",
      "email": "",
      "birthdate": "",
      "roles": []
    }
  }

  /**
   * Присваивание состояний на основе события изменения поля ввода формы
   *
   * @param event {object} Событие, оттуда извлекаются данные пользователя
   */
  handleChange(event) {
    const {name, value} = event.target;

    this.setState({
      [name]: value
    });
  }

  /**
   * Присваивание состояний на основе события обработки отправки данных в форме
   * @param event {object} Используется только для остановки события
   */
  handleSubmit(event) {
    const {
      username, password, confirmPassword, firstName, lastName, middleName,
      email, birthdate
    } = this.state;
    const {createUser} = this.props;
    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      event.preventDefault();
      return
    }
    const data = {
      "username": username,
      "password": password,
      "firstName": firstName,
      "lastName": lastName,
      "middleName": middleName,
      "email": email,
      "birthdate": birthdate,
      "roles": [2]
    }
    createUser(data);

    this.setState({
      "username": "",
      "password": "",
      "firstName": "",
      "lastName": "",
      "middleName": "",
      "email": "",
      "birthdate": "",
      "roles": ""
    })

    event.preventDefault();
  }

  /**
   * Отображение формы. Получение text из состояния
   * Вызов методов this.handleChange и this.handleSubmit при событиях изменения
   * поля ввода и отправки данных соответственно
   * @returns {JSX.Element}
   */
  render() {
    const {
      username, password, confirmPassword, firstName, lastName, middleName,
      email, birthdate
    } = this.state;

    return (
      <div>
        <form
          onSubmit={(event => this.handleSubmit(event))}
          className="row todo-form"
        >
          <legend>Регистрация:</legend>
          <div className="col-4">
            <input
              required
              type="text"
              name="username"
              maxLength="44"
              placeholder="Login"
              aria-describedby="usernameHelpInline"
              value={username}
              className="form-control"
              onChange={(event => this.handleChange(event))}
            />
            <span id="usernameHelpInline" className="form-text">
              <span className="sure">*</span>
              Введите уникальный login
            </span>
          </div>
          <div className="col-4">
            <input
              required
              type="password"
              autoComplete="on"
              minLength="8"
              size="10"
              name="password"
              maxLength="44"
              placeholder="Password"
              aria-describedby="passwordHelpInline"
              value={password}
              className="form-control"
              onChange={(event => this.handleChange(event))}
            />
            <span id="passwordHelpInline" className="form-text">
              <span className="sure">*</span>
              Придумайте пароль. Он не хранится в открытом виде.
              Ваши данные защищены даже от администрации.
           </span>
          </div>
          <div className="col-4">
            <input
              required
              type="password"
              autoComplete="on"
              minLength="8"
              size="10"
              name="confirmPassword"
              maxLength="44"
              placeholder="Подтвердите"
              aria-describedby="confirmPasswordHelpInline"
              value={confirmPassword}
              className="form-control"
              onChange={(event => this.handleChange(event))}
            />
            <span id="confirmPasswordHelpInline" className="form-text">
              <span className="sure">*</span>
              Подтвердите пароль
            </span>
          </div>
          <div className="col-4">
            <input
              type="text"
              name="firstName"
              maxLength="44"
              placeholder="Имя"
              aria-describedby="firstNameHelpInline"
              value={firstName}
              className="form-control"
              onChange={(event => this.handleChange(event))}
            />
            <span id="firstNameHelpInline" className="form-text">
              Ваше имя
            </span>
          </div>
          <div className="col-4">
            <input
              type="text"
              name="lastName"
              maxLength="55"
              placeholder="Фамилия"
              aria-describedby="lastNameHelpInline"
              value={lastName}
              className="form-control"
              onChange={(event => this.handleChange(event))}
            />
            <span id="lastNameHelpInline" className="form-text">
             Фамилия
            </span>
          </div>
          <div className="col-4">
            <input
              type="text"
              name="middleName"
              maxLength="66"
              placeholder="Отчество"
              aria-describedby="textHelpInline"
              value={middleName}
              className="form-control"
              onChange={(event => this.handleChange(event))}
            />
            <span id="middleNameHelpInline" className="form-text">
             Отчество
            </span>
          </div>
          <div className="col-4">
            <input
              required
              type="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              name="email"
              placeholder="Email"
              aria-describedby="textHelpInline"
              value={email}
              className="form-control"
              onChange={(event => this.handleChange(event))}
            />
            <span id="middleNameHelpInline" className="form-text">
              <span className="sure">*</span>
             Ваш уникальный электронный адрес
           </span>
          </div>
          <div className="col-4">
            <input
              required
              type="date"
              min="1900-12-01"
              max="2003-12-01"
              name="birthdate"
              placeholder="День рождения"
              aria-describedby="birthdateHelpInline"
              value={birthdate}
              className="form-control"
              onChange={(event => this.handleChange(event))}
            />
            <span id="birthdateHelpInline" className="form-text">
              <span className="sure">*</span>
              Дата рождения
            </span>
          </div>

          <input
            type="submit"
            value="Сохранить"
            className="auth-btn btn btn-primary col-4"
          />
        </form>
      </div>
    )
  }
}
