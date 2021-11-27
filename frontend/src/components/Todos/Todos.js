import "./Todos.css"

import React, {PureComponent} from "react";

import {TodosList} from "./TodosList";


export class Todos extends PureComponent {

  render() {
    const {users} = this.props;

    return (
      <TodosList users={users}/>
    )
  }
}
