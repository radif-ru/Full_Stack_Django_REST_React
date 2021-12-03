import "./Todos.css"

import React, {PureComponent} from "react";

import {TodosList} from "./TodosList";


/**
 * Работа с заметками
 */
export class Todos extends PureComponent {

  render() {
    const {
      users, projects, todos, deleteTodo, isAuthenticated, login, admin
    } = this.props;

    return (
      <TodosList
        users={users}
        projects={projects}
        todos={todos}
        deleteTodo={deleteTodo}
        isAuthenticated={isAuthenticated}
        login={login}
        admin={admin}
      />
    )
  }
}
