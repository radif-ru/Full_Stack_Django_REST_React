import {PureComponent} from "react";
import {Link} from "react-router-dom";
import dateFormat from "dateformat";

export class TodoItem extends PureComponent {

  render() {

    let {todo, projects} = this.props;

    return (
      <tr>
        <td>
          {todo.text}
        </td>
        <td>
          <Link to={`/projects/${todo.project}`}>
            {projects.filter((project) => project.id === todo.project)[0].name}
          </Link>
        </td>
        <td>
          {dateFormat(todo.created, 'dddd, mmmm dS, yyyy, h:MM:ss TT')}
        </td>
        <td>
          {dateFormat(todo.updated, 'dddd, mmmm dS, yyyy, h:MM:ss TT')}
        </td>
      </tr>
    )
  }
}
