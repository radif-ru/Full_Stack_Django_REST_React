import "./Users.css"

import React, {PureComponent} from "react";

import {UsersList} from "./UsersList";


/**
 * Работа с пользователями
 */
export class Users extends PureComponent {

  render() {

    const {users, roles} = this.props;

    return (
      <div>
        <UsersList users={users} roles={roles}/>
      </div>
    )
  }
}
