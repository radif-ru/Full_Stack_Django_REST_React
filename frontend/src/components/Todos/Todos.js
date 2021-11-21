import './Todos.css'

import React, {PureComponent} from 'react';

import {TodosList} from './TodosList';


export class Todos extends PureComponent {

  render() {

    const {todos} = this.props

    return (
      <TodosList todos={todos}/>
    )
  }
}
