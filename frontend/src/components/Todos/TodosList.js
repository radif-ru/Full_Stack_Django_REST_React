import {PureComponent} from "react";

import {TodoItem} from "./TodoItem";

/**
 * Формирование заголовков таблицы и данных для заполнения ячеек
 * Для авторизованных появляется поле удаления заметки, но кнопка удаления
 * отображается только у владельцев заметок
 */
export class TodosList extends PureComponent {

  render() {
    const {
      users, projects, todos, deleteTodo, isAuthenticated, login
    } = this.props;

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
            {isAuthenticated() ? <th> </th> : null}
          </tr>
          </thead>
          <tbody>
          {todos.map((todo, idx) =>
            <TodoItem
              key={idx}
              todo={todo}
              users={users}
              projects={projects}
              deleteTodo={deleteTodo}
              isAuthenticated={isAuthenticated}
              login={login}
            />
          )}
          </tbody>
        </table>
      </div>
    )
  }
}
