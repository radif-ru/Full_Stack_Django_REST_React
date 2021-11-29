/**
 * Создание и обработка формы создания заметки
 */
import {PureComponent} from "react";

export class TodoForm extends PureComponent {
  /**
   * Прокидывание свойств (props) от родителя, начальное состояние текста
   * @param props {object} Данные, переданные родителем
   */
  constructor(props) {
    super(props);
    this.state = {
      "text": ""
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
   * project_id, users, login, createTodo получаются из свойств,
   * которые передал родитель, text из состояния. createTodo - отправка данных
   * @param event {object} Используется только для остановки события
   */
  handleSubmit(event) {
    const {text} = this.state;
    const {project_id, users, login, createTodo} = this.props;
    const user = users.filter(user => user.username === login)[0].id;
    createTodo(+project_id, +user, text);
    this.setState({
      "text": ""
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

    return (
      <form onSubmit={(event => this.handleSubmit(event))} className="row g-2">
        <div className="col-auto">
          <input
            type="text"
            name="text"
            placeholder="Текст"
            aria-describedby="textHelpInline"
            value={text}
            className="form-control"
            onChange={(event => this.handleChange(event))}
          />
          <span id="textHelpInline" className="form-text">
            Введите текст вашей заметки к проекту
          </span>
        </div>
        <input
          type="submit"
          value="Сохранить"
          className="auth-btn btn btn-primary col-auto"
        />
      </form>
    )
  }
}
