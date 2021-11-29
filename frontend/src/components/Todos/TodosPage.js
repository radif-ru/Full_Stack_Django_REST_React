import {PureComponent} from "react";
import {Link} from "react-router-dom";
import dateFormat from "dateformat";

export class TodosPage extends PureComponent {

  render() {

    const {todos, users} = this.props

    return (
      <div className="todos">
        {todos.map((todo, idx) =>
          <div key={idx}>
            <span className="comment">{todo.text}</span>

            <div className="comment-info">
              <Link className="comment-user" to={`/users/${todo.user}`}>
                {users.find(user => user.id === todo.user).username}
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
            </div>
            <br/>
          </div>
        )}
      </div>
    )
  }
}