import './Todos.css'

import React, {PureComponent} from 'react';

import {TodosList} from "./TodosList";


export class Todos extends PureComponent {

  render() {

    const {todos, projects} = this.props

    return (
      <TodosList todos={todos} projects={projects}/>
    )
  }
}
