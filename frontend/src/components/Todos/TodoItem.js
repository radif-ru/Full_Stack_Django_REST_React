import {PureComponent} from 'react';
import {Link} from 'react-router-dom';
import dateFormat from 'dateformat';


export class TodoItem extends PureComponent {

  render() {

    const {todo} = this.props;

    return (
      <tr>
        <td>
          {todo.text}
        </td>
        <td>
          <Link to={`/projects/${todo.project.id}`}>
            {todo.project.name}
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
