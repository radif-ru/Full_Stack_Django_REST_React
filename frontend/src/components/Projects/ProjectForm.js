import "./Projects.css"

import {PureComponent} from "react";

/**
 * Создание и обработка формы создания проекта
 * При создании проекта пользователь обязательно попадает в список авторов,
 * но может указать соавторов дополнительно
 */
export class ProjectForm extends PureComponent {
  /**
   * Прокидывание свойств (props) от родителя, начальное состояние текста
   * @param props {object} Данные, переданные родителем
   */
  constructor(props) {
    super(props);
    this.state = {
      "name": this.props.project ? this.props.project.name : "",
      "repository": this.props.project ? this.props.project.repository : "",
      "usersId": this.props.project ? this.props.project.users : ""
    }
  }

  /**
   * Присваивание состояний на основе события изменения поля ввода формы
   *
   * @param event {object} Событие, оттуда извлекаются данные проекта
   */
  handleChange(event) {
    const {name, value} = event.target;
    // Авторы
    if (event.target.selectedOptions) {
      let usersId = [];
      for (let i = 0; i < event.target.selectedOptions.length; i++) {
        usersId.push(+event.target.selectedOptions.item(i).value);
      }
      this.setState({
        "usersId": usersId
      });
      return
    }
    // Имя и репозиторий
    this.setState({
      [name]: value
    });
  }

  /**
   * Присваивание состояний на основе события обработки отправки данных в форме
   * К авторам добавляется создатель проекта
   * @param event {object} Используется только для остановки события
   */
  handleSubmit(event) {
    const {name, repository, usersId} = this.state;
    const {
      users, login, createProject, editProject, project, toggleDetails,
      projects
    } = this.props;
    const user = users && users.find(user => user.username === login);
    const allUsersId = [...usersId, user.id]
    const data = {
      "name": name,
      "repository": repository,
      "users": allUsersId
    }

    if (projects.find(el =>
      el.name === name && el.repository === repository && el.users === usersId
    )) {
      alert("Запрещено создавать 2 проекта с совпадающими именем, " +
        "репозиторием и авторами! Отредактируйте данные или измените авторов");
      event.preventDefault();
      return
    }

    if (editProject) {
      editProject(data, project.id);
      toggleDetails();
      event.preventDefault();
      return
    }
    createProject(data);
    this.setState({
      "name": "",
      "repository": "",
      "users": "",
    });
    event.preventDefault();
  }

  /**
   * Отображение формы. В качестве соавторов можно выбрать всех, кроме себя
   * @returns {JSX.Element}
   */
  render() {
    const {name, repository} = this.state;
    const {users, login, project} = this.props;
    const user = users.find(user => user.username === login);
    const otherUsers = users.filter(el => el.id !== user.id);

    return (
      <form
        onSubmit={(event => this.handleSubmit(event))}
        className="row todo-form"
      >
        <div className="col-3">
          <input
            required
            type="text"
            name="name"
            maxLength="33"
            placeholder="Имя"
            aria-describedby="textHelpInline"
            value={name}
            className="form-control"
            onChange={(event => this.handleChange(event))}
          />
          <span id="textHelpInline" className="form-text">
            Введите имя проекта
          </span>
        </div>
        <div className="col-4">
          <input
            required
            type="url"
            name="repository"
            maxLength="99"
            placeholder="url-адрес репозитория"
            aria-describedby="textHelpInline"
            value={repository}
            className="form-control"
            onChange={(event => this.handleChange(event))}
          />
          <span id="textHelpInline" className="form-text">
            Введите url-адрес репозитория
          </span>
        </div>

        <div className="col-3">
          <select
            multiple
            defaultValue={project && project.users}
            name="usersId"
            className="form-control form-select"
            aria-describedby="textHelpSelect"
            placeholder="Пользователи"
            onChange={(event) =>
              this.handleChange(event)
            }
          >
            {otherUsers.map((user, idx) =>
                <option value={user.id} key={idx}>
                  {user.username}
                </option>
            )}
          </select>
          <span id="textHelpSelect" className="form-text">
            Добавьте тех, кто так же работают с проектом
          </span>
        </div>

        <input
          type="submit"
          value="Сохранить"
          className="auth-btn btn btn-primary col-2"
        />
      </form>
    )
  }
}
