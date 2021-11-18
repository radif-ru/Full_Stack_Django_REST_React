import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import axios from "axios";
import Cookies from "universal-cookie/es6";

import {Header} from "./components/Header";
import {Users} from "./components/Users";
import {Projects} from "./components/Projects";
import {Todos} from "./components/Todos";
import {Footer} from "./components/Footer";
import {NotFound404} from "./components/NotFound404";
import {UserPage} from "./components/Users/UserPage";
import {ProjectPage} from "./components/Projects/ProjectPage";
import {LoginForm} from "./components/Authorization";

export class GeneralApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'users': [],
      'projects': [],
      'todos': [],
      'token': '',
      'login': '',
    }
  }

  componentDidMount() {
    this.get_token()
  }

  get_token() {
    const cookies = new Cookies()
    const token = cookies.get('token')
    const login = cookies.get('login');
    this.setState(
      {'token': token, 'login': login}, () => this.get_data())
  }

  get_data() {
    this.load_data_promise().catch((error) => {
      // Обработка ошибок с токеном, извлечённом из Cookies браузера
      console.log(`get_data_load_data_promise_err: ${error}`);
      if (error.name === 'TypeError') {
        alert(`Токен испорчен - неправильный формат! Кто-то изменил Cookies!
          \nПовторите вход в свой личный кабинет! И проверьтесь на вирусы!`);
        this.logout();
        this.get_data();
      } else if (error.request.status === 401) {
        alert(`Токен просрочен. \nПовторите вход в свой личный кабинет!`);
        this.logout();
        this.get_data();
      } else if (error.request.status === 0) {
        alert(`Сервер недоступен! \nПопробуйте зайти позже`);
      } else {
        alert(`Ошибка - ${error} \nПовторите вход в свой личный кабинет!`);
        this.logout();
        this.get_data();
      }
    })
  }

  async load_data_promise() {
    const users = await this.get_users_promise(33);
    const projects = await this.get_projects_promise(33);
    const todos = await this.get_todos_promise(99);

    this.setState({
      'users': users.data.results,
      'projects': projects.data.results,
      'todos': todos.data.results
    })
  }

  get_users_promise(limit = 100, offset = 0) {
    const headers = this.get_headers()
    return axios.get(
      `http://localhost:3333/api/users/?limit=${limit}&offset=${offset}/`,
      {headers})
  }

  get_projects_promise(limit = 100, offset = 0) {
    const headers = this.get_headers()
    return axios.get(
      `http://localhost:3333/api/projects/?limit=${limit}&offset=${offset}/`,
      {headers})
  }

  get_todos_promise(limit = 100, offset = 0) {
    const headers = this.get_headers()
    return axios.get(
      `http://localhost:3333/api/todos/?limit=${limit}&offset=${offset}/`,
      {headers})
  }

  get_headers() {
    let headers = {
      'Content-Type': 'application/json'
    }
    if (this.is_authenticated()) {
      // Для JWT к токену в заголовке нужно добавить префикс Bearer
      headers['Authorization'] = `Bearer ${this.state.token}`;
    }
    return headers
  }

  is_authenticated() {
    return this.state.token !== '' && this.state.token !== undefined
  }

  auth(login, password) {
    axios.post('http://localhost:3333/api/token/', {
      "username": login,
      "password": password
    }).then(response => {
      this.set_token(response.data['access'], login);
    }).catch(error => {
        console.log(`get_token err: ${error}`);
        alert('Неверный логин или пароль');
      }
    )
  }

  set_token(token, login) {
    const cookies = new Cookies();
    cookies.set('token', token);
    cookies.set('login', login);

    this.setState({'token': token, 'login': login}, () => {
      this.get_data();
    });
  }

  logout() {
    this.set_token('', '');
  }

  render() {
    const {users, projects, todos, login} = this.state

    return (
      <BrowserRouter>
        <div className="content">
          <Header is_authenticated={() => this.is_authenticated()}
                  logout={() => this.logout()} login={login}/>
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

              <Route exact path='/login' element={<LoginForm auth={
                (login, password) => this.auth(login, password)}/>}/>

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
