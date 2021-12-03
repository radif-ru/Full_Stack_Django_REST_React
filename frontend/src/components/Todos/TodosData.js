import "./Todos.css"

import {PureComponent} from "react";
import {Link} from "react-router-dom";
import dateFormat from "dateformat";
import {TodoForm} from "./TodoForm";


/**
 * Данные заметок. Проброс свойств к каждой заметке отдельно
 */
export class TodosData extends PureComponent {

  render() {

    const {
      todos, users, projects, login, isAuthenticated, deleteTodo, editTodo,
      admin
    } = this.props

    return (
      <div className="todos-data">
        {todos.map((todo, idx) =>
          <TodosDataEl
            key={idx}
            todo={todo}
            users={users}
            projects={projects}
            login={login}
            isAuthenticated={isAuthenticated}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            todos={todos}
            admin={admin}
          />
        )}
      </div>
    )
  }
}


/**
 * Работа с каждой заметкой отдельно. Показ и скрытие формы заметки в
 * зависимости от авторизованности пользователя и авторства.
 * Возможность редактирования и удаления своих заметок
 */
class TodosDataEl extends PureComponent {
  /**
   * Изначально состояние видимости включено
   * @param props.visible {Boolean}
   */
  constructor(props) {
    super(props)
    this.state = {
      visible: true
    }
  }

  /**
   * Переключатель видимого и невидимого состояния элементов
   */
  toggleDetails = () => {
    const newToggleState = !this.state.visible
    this.setState({visible: newToggleState})
  }

  render() {
    const {
      todo, users, projects, login, isAuthenticated, deleteTodo, editTodo,
      todos, admin
    } = this.props
    const {visible} = this.state
    const user = users.find(user => user.username === login)
    return (
      <div>
        {visible && <span className="comment">{todo.text}</span>}

        {isAuthenticated() && (todo.user === user.id || admin) &&
        <div>
            <span
              onClick={this.toggleDetails}
              className="btn btn-outline-secondary"
            >
          {!visible ? "Отменить" : "Изменить текст"}
            </span>
          {!visible &&
          <div>
            Отредактировать тест:
            <TodoForm
              todo={todo}
              text={todo.text}
              editTodo={editTodo}
              toggleDetails={() => this.toggleDetails()}
              todos={todos}
            />
          </div>
          }
        </div>
        }

        <div className="comment-info">
          <Link className="comment-user" to={`/users/${todo.user}`}>
            {users.find(user => user.id === todo.user).username}
          </Link>

          <span>=> </span>

          <Link
            className="comment-user"
            to={`/projects/${projects.find(project =>
              project.id === todo.project).id}`
            }
          >
            {projects.find(project => project.id === todo.project).name}
          </Link>

          <span className="comment-datetime">
            {dateFormat(
              todo.created, "dddd, mmmm dS, yyyy, h:MM:ss TT"
            )}
            <span>. </span>
          </span>

          <span className="comment-datetime">
            {todo.created !== todo.updated &&
            <span className="comment-updated">
              <span>Обновлено: </span>
              {dateFormat(todo.updated, "dddd, mmmm dS, yyyy, h:MM:ss TT")}
            </span>

            }
          </span>
          {isAuthenticated() && (todo.user === user.id || admin) &&
          <div>
            <span className="btn btn-outline-danger">
              <span onClick={() => deleteTodo(todo.id)}>Удалить заметку</span>
            </span>
          </div>
          }
        </div>
        <hr/>
      </div>
    )
  }
}
