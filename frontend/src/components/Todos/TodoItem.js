import {PureComponent} from 'react';
import {Link} from 'react-router-dom';
import dateFormat from 'dateformat';


export class TodoItem extends PureComponent {

  render() {
    const {user, users} = this.props
    const user_todos = user.userTodos
    const projects_data = users.map(user => user.userProjects)

    return (
      user_todos.map((todo, idx) => <tr key={idx}>

        <td>
          {todo.text}
        </td>
        <td>
          <Link to={`/users/${user.id}`}>{user.username}</Link>
        </td>
        <td>
          <Link to={`/projects/${todo.project}`}>
            {/*Имя проекта*/}
            {projects_data.map(projects => projects.filter(
              project => project.id === todo.project)).filter(
              el => el.length)[0][0].name}
          </Link>
        </td>
        <td>
          {dateFormat(todo.created, 'dddd, mmmm dS, yyyy, h:MM:ss TT')}
        </td>
        <td>
          {dateFormat(todo.updated, 'dddd, mmmm dS, yyyy, h:MM:ss TT')}
        </td>
      </tr>)
    )
  }
}
