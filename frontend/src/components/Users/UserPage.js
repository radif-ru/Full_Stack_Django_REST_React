import {useParams} from "react-router-dom";

import dateFormat from "dateformat";


export const UserPage = (props) => {
  const {id} = useParams();
  const {users} = props;
  const user = users.filter((user) => user.id.toString() === id);
  const noData = "нет данных!";

  return (
    <div className="user">
      {user.map((data, idx) =>
        <div key={idx}>
          <p>
            <span>Id: </span>
            <span className="user-data">{data.id}</span>
          </p>
          <p>
            <span>Login: </span>
            <span className="user-data">{data.username}</span>
          </p>
          <p>
            <span>Имя: </span>
            <span className="user-data">{data.firstName || noData}</span>
          </p>
          <p>
            <span>Фамилия: </span>
            <span className="user-data">{data.lastName || noData}</span>
          </p>
          <p>
            <span>Отчество: </span>
            <span className="user-data">{data.middleName || noData}</span>
          </p>
          <p>
            <span>Электронная почта: </span>
            <span className="user-data">{data.email}</span>
          </p>
          <p>
            <span>Дата рождения: </span>
            <span className="user-data">
              {data.birthdate
                ? dateFormat(data.birthdate, "fullDate")
                : noData
              }
            </span>
          </p>
          <p>
            <span>Роли пользователя: </span>
            {data.roles.map((role, idx) =>
            <span key={idx} className="user-data"> | {role.role} |</span>
          )}
          </p>
          <p>
            <span>Зарегистрировался(-ась): </span>
            <span className="user-data">
              {dateFormat(
                data.dateJoined, "dddd, mmmm dS, yyyy, h:MM:ss TT"
              )}
            </span>
          </p>
          <p>
            <span>Последний раз заходил(-а): </span>
            <span className="user-data">
              {dateFormat(
                data.lastLogin, "dddd, mmmm dS, yyyy, h:MM:ss TT"
              )}
            </span>
          </p>
          <p>
            <span>Данные обновлены: </span>
            <span className="user-data">
              {dateFormat(
                data.updated, "dddd, mmmm dS, yyyy, h:MM:ss TT"
              )}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
