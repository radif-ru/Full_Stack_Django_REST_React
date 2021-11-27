import {PureComponent} from "react";
import {Link} from "react-router-dom";
import dateFormat from "dateformat";


export class TodoItem extends PureComponent {

  render() {
    const {user, users} = this.props;
    const userTodos = user.userTodos;
    const projectsData = users.map(user => user.userProjects);

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
            {projectsData.map(projects => projects
              .filter(project => project.id === todo.project))
              .filter(el => el.length)[0][0]
              .name
            }
          </Link>
        </td>
        <td>
          {dateFormat(todo.created, "dddd, mmmm dS, yyyy, h:MM:ss TT")}
        </td>
        <td>
          {dateFormat(todo.updated, "dddd, mmmm dS, yyyy, h:MM:ss TT")}
        </td>
      </tr>)
    )
  }
}
