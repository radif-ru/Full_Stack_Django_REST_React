import React, {PureComponent} from 'react';
import axios from "axios";

import './Todos.css'
import {TodosList} from "./TodosList";

export class Todos extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            'todos': [],
        }
    }

    componentDidMount() {
        axios
            .get('http://localhost:3333/api/todos/')
            .then(response => {
                const todos = response.data;
                this.setState(
                    {
                        'todos': todos.results
                    }
                );
            })
            .catch(error => console.log(error));
    }

    render() {
        return (
            <TodosList todos={this.state.todos}/>
        )
    }
}
