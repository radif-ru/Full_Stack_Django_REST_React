import {PureComponent} from "react";
import {Link} from "react-router-dom";


/**
 * Формирование данных. Заполнение ячеек заметок
 * По заметке определяются пользователь и проект, кому она принадлежит
 * У авторизованных пользователей есть возможность удалять заметки,
 * но только свои
 */
export class TodoItem extends PureComponent {

  render() {
    const {
      todo, users, projects, deleteTodo, isAuthenticated, login, admin
    } = this.props;
    const user = users.find(user => user.id === todo.user);
    const project = projects.find(project => project.id === todo.project);

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
          {todo.created}
        </td>
        <td>
          {todo.updated !== todo.created ? todo.updated : "---"}
        </td>
        {isAuthenticated() && (user.username === login || admin) &&
        <td className="btn btn-outline-danger">
          <div onClick={() => deleteTodo(todo.id)}>Del</div>
        </td>
        }
      </tr>
    )
  }
}
