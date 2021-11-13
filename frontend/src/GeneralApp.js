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

  async componentDidMount() {
    try {
      const users = await this.get_users_data(50);
      const projects = await this.het_projects_data();
      const todos = await this.get_todos_data();

      this.setState({
        'users': users.data.results,
        'projects': projects.data.results,
        'todos': todos.data.results
      })
    } catch (error) {
      console.log(`Ошибка запроса данных: ${error}`)
      alert(`Ошибка запроса данных: ${error}`)
    }

  }

  get_users_data(limit = 100, offset = 0) {
    return axios.get(`http://localhost:3333/api/users/?limit=${limit}&offset=${offset}/`)
  }

  het_projects_data() {
    return axios.get('http://localhost:3333/api/projects/')
  }

  get_todos_data() {
    return axios.get(`http://localhost:3333/api/todos/`)
  }

  render() {
    const {users, projects, todos} = this.state

    return (
      <BrowserRouter>
        <div className="content">
          <Header/>
          <div className='main-content'>
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
              <Route exact path='/' element={<Navigate to='/todos'/>}/>
              <Route path='*' element={<NotFound404/>}/>
            </Routes>
          </div>
        </div>
        <Footer/>
      </BrowserRouter>
    )
  }
}
