import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import axios from "axios";

import {Header} from "./components/Header";
import {Users} from "./components/Users";
import {Projects} from "./components/Projects";
import {Todos} from "./components/Todos";
import {Footer} from "./components/Footer";
import {NotFound404} from "./components/NotFound404";
import {UserPage} from "./components/Users/UserPage";
import {ProjectPage} from "./components/Projects/ProjectPage";

export class GeneralApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'users': [],
      'projects': [],
      'todos': [],
    }
  }

  componentDidMount() {
    this.upd_projects_state();
    this.upd_users_state(50);
    this.upd_todos_state();

  }

  upd_projects_state() {
    axios
      .get('http://localhost:3333/api/projects/')
      .then(response => {
        const projects = response.data;
        this.setState(
          {
            'projects': projects.results
          }
        );
      })
      .catch(error => console.log(error));
  }

  upd_users_state(limit = 100, offset = 0) {
    axios
      .get(`http://localhost:3333/api/users/?limit=${limit}&offset=${offset}/`)
      .then(response => {
        const users = response.data;
        this.setState(
          {
            'users': users.results
          })
      })
      .catch(error => console.log(error));
  }

  upd_todos_state() {
    axios
      .get(`http://localhost:3333/api/todos/`)
      .then(response => {
        const todos = response.data;
        this.setState(
          {
            'todos': todos.results
          })
      })
      .catch(error => console.log(error));
  }

  render() {
    const {users, projects, todos} = this.state

    return (
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route exact path='/users' element={<Users users={users}/>}/>
          <Route exact path='/users/:id'
                 element={<UserPage users={users}/>}/>
          <Route exact path='/projects'
                 element={<Projects projects={projects} users={users}/>}/>
          <Route exact path='/projects/:id'
                 element={<ProjectPage projects={projects} users={users}
                                       todos={todos}/>}/>
          <Route exact path='/todos'
                 element={<Todos todos={todos} projects={projects}/>}/>
          <Route exact path='/' element={<Navigate to='/users'/>}/>
          <Route path='*' element={<NotFound404/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    )
  }
}
