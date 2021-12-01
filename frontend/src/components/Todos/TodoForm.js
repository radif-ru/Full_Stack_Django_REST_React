import "./Todos.css"

import {PureComponent} from "react";

/**
 * Создание и обработка формы создания заметки
 */
export class TodoForm extends PureComponent {
  /**
   * Прокидывание свойств (props) от родителя, начальное состояние текста
   * @param props {object} Данные, переданные родителем
   */
  constructor(props) {
    super(props);
    this.state = {
      "text": "",
      "projectId": ""
    }
  }

  /**
   * Присваивание состояний на основе события изменения поля ввода формы
   * @param event {object} Событие, оттуда извлекаются имя и значения текста
   */
  handleChange(event) {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  }

  /**
   * Присваивание состояний на основе события обработки отправки данных в форме
   * text получен из состояния - куда он попал из this.handleChange
   * projectId, users, login, createTodo получаются из свойств,
   * которые передал родитель, text из состояния. createTodo - отправка данных
   * @param event {object} Используется только для остановки события
   */
  handleSubmit(event) {
    const {text} = this.state;
    const {users, login, createTodo} = this.props;
    const projectId = this.props.projectId
      ? this.props.projectId
      : this.state.projectId
    const user = users.find(user => user.username === login).id;
    const data = {
      "project": +projectId,
      "user": +user,
      "text": text
    }
    createTodo(data);
    this.setState({
      "text": "",
    });
    event.preventDefault();
  }

  /**
   * Отображение формы. Получение text из состояния
   * Вызов методов this.handleChange и this.handleSubmit при событиях изменения
   * поля ввода и отправки данных соответственно
   * @returns {JSX.Element}
   */
  render() {
    const {text} = this.state;
    const {projects} = this.props

    return (
      <div>
        <form
          onSubmit={(event => this.handleSubmit(event))}
          className="row todo-form"
        >
          <legend>Создать заметку:</legend>
          <div className="col-5">
          <textarea
            required
            maxLength="333"
            name="text"
            placeholder="Текст"
            aria-describedby="textHelpInline"
            value={text}
            className="form-control todos__form-text-area"
            onChange={(event => this.handleChange(event))}
          />
            <span id="textHelpInline" className="form-text">
            Введите текст вашей заметки к проекту
          </span>
          </div>
          {projects &&
          <div className="col-3">
            <select
              required
              name="projectId"
              className="form-control form-select todos__form-select"
              aria-describedby="textHelpSelect"
              placeholder="Проекты"
              onChange={(event) =>
                this.handleChange(event)
              }
            >
              <option value="" defaultValue="" hidden>Список проектов</option>
              {projects.map((item, idx) =>
                <option value={item.id} key={idx}>
                  {item.name}
                </option>)
              }
            </select>
            <span id="textHelpSelect" className="form-text">
                Выберете проект, к которому хотите оставить заметку
              </span>
          </div>
          }
          <input
            type="submit"
            value="Сохранить"
            className="auth-btn btn btn-primary col-2"
          />
        </form>
      </div>
    )
  }
}
