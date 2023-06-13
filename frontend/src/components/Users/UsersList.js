import {PureComponent} from "react";
import {UserItem} from "./UserItem";


/**
 * Формирование заголовков таблицы и данных для заполнения ячеек
 */
export class UsersList extends PureComponent {

  render() {
    const {users, roles} = this.props;

    return (
      <div>
        <h3>Пользователи</h3>
        <table className="table">
          <thead>
          <tr>
            <th>
              Login
            </th>
            <th>
              Имя
            </th>
            <th>
              Фамилия
            </th>
            <th>
              Отчество
            </th>
            <th>
              Email
            </th>
            <th>
              Дата рождения
            </th>
            <th>
              Роли
            </th>
          </tr>
          </thead>
          <tbody>
          {users.map((user, idx) =>
            <UserItem key={idx} user={user} roles={roles}/>
          )}
          </tbody>
        </table>
      </div>
    )
  }
}
