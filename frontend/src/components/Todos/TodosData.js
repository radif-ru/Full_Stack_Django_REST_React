import "./Todos.css"

import {PureComponent} from "react";
import {Link} from "react-router-dom";
import dateFormat from "dateformat";

export class TodosData extends PureComponent {

  render() {

    const {
      todos, users, projects, login, isAuthenticated, deleteTodo
    } = this.props
    const user = users.find(user => user.username === login)

    return (
      <div className="todos-data">
        {todos.map((todo, idx) =>
          <div key={idx}>
            <span className="comment">{todo.text}</span>

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
                {todo.created !== todo.updated
                  ? `Обновлено: ${dateFormat(
                    todo.updated, "dddd, mmmm dS, yyyy, h:MM:ss TT")}`
                  : null
                }
              </span>
              {isAuthenticated() && todo.user === user.id
                ? <span className="btn btn-outline-danger">
                  <span onClick={() => deleteTodo(todo.id)}>Удалить!</span>
                </span>
                : null
              }
            </div>
            <br/>
          </div>
        )}
      </div>
    )
  }
}