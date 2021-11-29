import {useParams} from "react-router-dom";

import dateFormat from "dateformat";
import {TodosPage} from "../Todos/TodosPage";
import {TodoForm} from "../Todos/TodoForm";


/**
 * Личный кабинет пользователя
 * @param props {object} Свойства переданные родителем
 * @returns {JSX.Element}
 * @constructor
 */
export const UserPage = (props) => {
  let {id} = useParams();
  id = +id;
  const {users, projects, todos, isAuthenticated, login, createTodo} = props;
  const user = users.find((user) => user.id === id);

  const user_todos = todos.filter(todo => todo.user === id)

  // const user_projects = projects.filter(
  //   project => project.users.find(proj_user => proj_user === id)
  // )

  const noData = "нет данных!";

  return (
    <div>
      {user
        ? <div className="user">
          <div>
            <p>
              <span>Id: </span>
              <span className="user-data">{user.id}</span>
            </p>
            <p>
              <span>Login: </span>
              <span className="user-data">{user.username}</span>
            </p>
            <p>
              <span>Имя: </span>
              <span className="user-data">{user.firstName || noData}</span>
            </p>
            <p>
              <span>Фамилия: </span>
              <span className="user-data">{user.lastName || noData}</span>
            </p>
            <p>
              <span>Отчество: </span>
              <span className="user-data">{user.middleName || noData}</span>
            </p>
            <p>
              <span>Электронная почта: </span>
              <span className="user-data">{user.email}</span>
            </p>
            <p>
              <span>Дата рождения: </span>
              <span className="user-data">
              {user.birthdate
                ? dateFormat(user.birthdate, "fullDate")
                : noData
              }
            </span>
            </p>
            <p>
              <span>Роли пользователя: </span>
              {user.roles.map((role, idx) =>
                <span key={idx} className="user-data"> | {role.role} |</span>
              )}
            </p>
            <p>
              <span>Зарегистрировался(-ась): </span>
              <span className="user-data">
              {dateFormat(
                user.dateJoined, "dddd, mmmm dS, yyyy, h:MM:ss TT"
              )}
            </span>
            </p>
            <p>
              <span>Последний раз заходил(-а): </span>
              <span className="user-data">
              {dateFormat(
                user.lastLogin, "dddd, mmmm dS, yyyy, h:MM:ss TT"
              )}
            </span>
            </p>
            <p>
              <span>Данные обновлены: </span>
              <span className="user-data">
              {dateFormat(
                user.updated, "dddd, mmmm dS, yyyy, h:MM:ss TT"
              )}
            </span>
            </p>
          </div>

          <h3>Заметки пользователя: </h3><br/>

          {isAuthenticated() && user.username === login
            ? <TodoForm
              users={users}
              projects={projects}
              login={login}
              createTodo={createTodo}
            />
            : null
          }

          <TodosPage todos={user_todos} users={users}/>

        </div>

        : null
      }
    </div>
  )
}
