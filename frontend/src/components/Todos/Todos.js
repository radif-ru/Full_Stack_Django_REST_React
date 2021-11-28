import "./Todos.css"

import React, {PureComponent} from "react";

import {TodosList} from "./TodosList";


export class Todos extends PureComponent {

  render() {
    const {users, projects, deleteTodo, isAuthenticated, login} = this.props;

    return (
      <TodosList
        users={users}
        projects={projects}
        deleteTodo={deleteTodo}
        isAuthenticated={isAuthenticated}
        login={login}
      />
    )
  }
}
