import {PureComponent} from "react";
import {Link} from "react-router-dom";
import dateFormat from "dateformat";


export class TodoItem extends PureComponent {

  render() {
    const {
      user, projects, deleteTodo, isAuthenticated, login
    } = this.props;
    const userTodos = user.userTodos;

    return (
      userTodos.map((todo, idx) => <tr key={idx}>
        <td>
          {todo.text}
        </td>
        <td>
          <Link to={`/users/${user.id}`}>{user.username}</Link>
        </td>
        <td>
          <Link to={`/projects/${todo.project}`}>
            {/*Имя проекта*/}
            {projects.filter(project => project.id === todo.project).length
              ? projects.filter(project => project.id === todo.project)[0].name
              : null
            }
          </Link>
        </td>
        <td>
          {dateFormat(todo.created, "dddd, mmmm dS, yyyy, h:MM:ss TT")}
        </td>
        <td>
          {dateFormat(todo.updated, "dddd, mmmm dS, yyyy, h:MM:ss TT")}
        </td>
        {/*У авторизованных пользователей есть возможность удалять заметки,
        но только свои*/}
        {isAuthenticated() && user.username === login
          ? <td className="btn btn-outline-danger">
              <div onClick={() => deleteTodo(todo.id)}>Del</div>
          </td>
          : null
        }
      </tr>)
    )
  }
}
