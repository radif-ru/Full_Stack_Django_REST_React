import {PureComponent} from "react";
import {Link} from "react-router-dom";
import dateFormat from "dateformat";


/**
 * Формирование данных. Заполнение ячеек заметок
 * По заметке определяются пользователь и проект, кому она принадлежит
 * У авторизованных пользователей есть возможность удалять заметки,
 * но только свои
 */
export class TodoItem extends PureComponent {

  render() {
    const {
      todo, users, projects, deleteTodo, isAuthenticated, login
    } = this.props;
    const user = users.filter(user => user.id === todo.user)[0];
    const project = projects.filter(project => project.id === todo.project)[0];

    return (
      <tr>
        <td>
          {todo.text}
        </td>
        <td>
          <Link to={`/users/${user.id}`}>{user.username}</Link>
        </td>
        <td>
          <Link to={`/projects/${todo.project}`}>{project.name}</Link>
        </td>
        <td>
          {dateFormat(todo.created, "dddd, mmmm dS, yyyy, h:MM:ss TT")}
        </td>
        <td>
          {todo.updated !== todo.created
            ? `${dateFormat(
              todo.updated, "dddd, mmmm dS, yyyy, h:MM:ss TT")}`
            : "---"
          }
        </td>
        {isAuthenticated() && user.username === login
          ? <td className="btn btn-outline-danger">
            <div onClick={() => deleteTodo(todo.id)}>Del</div>
          </td>
          : null
        }
      </tr>
    )
  }
}
