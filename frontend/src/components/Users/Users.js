import "./Users.css"

import React, {PureComponent} from "react";

import {UsersList} from "./UsersList";


export class Users extends PureComponent {

  render() {

    const users = this.props.users;

    return (
      <div>
        <UsersList users={users}/>
      </div>
    )
  }
}
