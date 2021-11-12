import React, {PureComponent} from 'react';
import axios from "axios";

import './Users.css'

import {UsersList} from "./UsersList";


export class Users extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      'users': [],
    }
  }

  componentDidMount() {
    axios
      .get('http://localhost:3333/api/users/?limit=100&offset=0/')
      .then(response => {
        const users = response.data;
        this.setState(
          {
            'users': users.results
          }
        );
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        <UsersList users={this.state.users}/>
      </div>
    )
  }
}
