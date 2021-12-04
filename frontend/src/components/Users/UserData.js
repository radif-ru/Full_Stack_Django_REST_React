import "./Users.css"

import {PureComponent} from "react";

import dateFormat from "dateformat";
import {UserForm} from "./UserForm";

/**
 * Компонент данных пользователя
 */
export class UserData extends PureComponent {
  /**
   * Изначально состояние видимости включено
   * @param props.visible {Boolean}
   */
  constructor(props) {
    super(props)
    this.state = {
      visible: true
    }
  }

  /**
   * Переключатель видимого и невидимого состояния элементов
   */
  toggleDetails = () => {
    const newToggleState = !this.state.visible
    this.setState({visible: newToggleState})
  }

  render() {

    const {
      user, roles, editUser, setNotification, getNotification, isAuthenticated,
    login, admin} = this.props;
    const {visible} = this.state;

    const noData = "нет данных!";

    return (
      <div>
        {visible &&
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
            {user.roles.map((roleId, idx) =>
              <span key={idx} className="user-data"> | {
                roles.find(role => role.id === roleId) && roles
                  .find(role => role.id === roleId).role
              } |</span>
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
            <span className="user-data user-data-updated">
                {user.updated !== user.dateJoined
                  ? dateFormat(
                    user.updated, "dddd, mmmm dS, yyyy, h:MM:ss TT"
                  )
                  : <span>---</span>}
          </span>
          </div>
        </div>
        }
        {isAuthenticated() && (user.username === login || admin) &&
        <div>
            <span
              onClick={this.toggleDetails}
              className="btn btn-outline-secondary"
            >
          {!visible ? "Отменить" : "Изменить данные"}
            </span>
          {!visible &&
          <div>
            <UserForm
              roles={roles}
              user={user}
              getNotification={getNotification}
              setNotification={setNotification}
              toggleDetails={() => this.toggleDetails()}
              editUser={editUser}
            />
          </div>
          }
        </div>
        }
      </div>
    )
  }
}