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
      "text": this.props.text,
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
   * Создание или редактирование данных в зависимости от переданных свойств.
   * Валидация данных.
   * @param event {object} Используется только для остановки события
   */
  handleSubmit(event) {
    const {text} = this.state;
    const {
      users, login, createTodo, editTodo, todo, toggleDetails, todos
    } = this.props;

    const projectId = this.props.projectId
      ? this.props.projectId
      : this.state.projectId

    const user = users && users.find(user => user.username === login);

    if (todos.find(todo =>
      todo.text === text && todo.project === projectId && todo.user === user.id
    )) {
      alert("Запрещено одному и тому же пользователю оставлять 2 одинаковые " +
        "заметки к одному проекту! Отредактируйте текст");
      event.preventDefault();
      return
    }

    if (editTodo) {
      const data = {
        "text": text
      }
      editTodo(data, todo.id);
      toggleDetails();
      event.preventDefault();
      return
    }

    const data = {
      "project": +projectId,
      "user": +user.id,
      "text": text
    }
    createTodo(data);
    this.setState({
      "text": "",
    });
    event.preventDefault();
  }

  /**
   * При передаче свойства projects, формируется список проектов, появляется
   * возможность выбора проекта, к которому оставляется заметка.
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
