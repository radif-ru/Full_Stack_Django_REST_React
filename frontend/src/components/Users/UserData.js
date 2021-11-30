import "./Users.css"

import {PureComponent} from "react";

import dateFormat from "dateformat";

/**
 * Компонент данных пользователя
 */
export class UserData extends PureComponent {

  render() {

    const {user} = this.props

    const noData = "нет данных!";

    return (
      <div>
        <div>
          <span>Login: </span>
          <span className="user-data">{user.username}</span>
        </div>
        <div>
          <span>Имя: </span>
          <span className="user-data">{user.firstName || noData}</span>
        </div>
        <div>
          <span>Фамилия: </span>
          <span className="user-data">{user.lastName || noData}</span>
        </div>
        <div>
          <span>Отчество: </span>
          <span className="user-data">{user.middleName || noData}</span>
        </div>
        <div>
          <span>Электронная почта: </span>
          <a href={`malito:${user.email}`} className="user-data">
            {user.email}
          </a>
        </div>
        <div>
          <span>Дата рождения: </span>
          <span className="user-data">
              {user.birthdate
                ? dateFormat(user.birthdate, "fullDate")
                : noData
              }
          </span>
        </div>
        <div>
          <span>Роли пользователя: </span>
          {user.roles.map((role, idx) =>
            <span key={idx} className="user-data"> | {role.role} |</span>
          )}
        </div>
        <div>
          <span>Зарегистрировался(-ась): </span>
          <span className="user-data">
              {dateFormat(
                user.dateJoined, "dddd, mmmm dS, yyyy, h:MM:ss TT"
              )}
          </span>
        </div>
        <div>
          <span>Последний раз заходил(-а): </span>
          <span className="user-data">
              {dateFormat(
                user.lastLogin, "dddd, mmmm dS, yyyy, h:MM:ss TT"
              )}
          </span>
        </div>
        <div>
          <span>Данные обновлены: </span>
          <span className="user-data">
                {user.updated === user.dateJoined
                  ? dateFormat(
                    user.updated, "dddd, mmmm dS, yyyy, h:MM:ss TT"
                  )
                  : <span>---</span>}
          </span>
        </div>
      </div>
    )
  }
}