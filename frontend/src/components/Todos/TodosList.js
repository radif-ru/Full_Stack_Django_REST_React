import {PureComponent} from "react";

import {TodoItem} from "./TodoItem";


export class TodosList extends PureComponent {

  render() {
    // Все пользователи у кого есть заметки
    const users = this.props.users.filter(user => !!user.userTodos.length)

    return (
      <div>
        <h3>Todos</h3>
        <table className="table">
          <thead>
          <tr>
            <th>
              Текст
            </th>
            <th>
              Автор
            </th>
            <th>
              Проект
            </th>
            <th>
              Добавлена
            </th>
            <th>
              Обновлена
            </th>
          </tr>
          </thead>
          <tbody>
          {users.map((user, idx) =>
            <TodoItem key={idx} user={user} users={users}/>)
          }
          </tbody>
        </table>
      </div>
    )
  }
}
