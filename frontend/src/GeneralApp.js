/**
 * Главный родитель компонентов
 */
import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import axios from 'axios';
import Cookies from 'universal-cookie/es6';

import {Header} from './components/Header';
import {Users} from './components/Users';
import {Projects} from './components/Projects';
import {Todos} from './components/Todos';
import {Footer} from './components/Footer';
import {NotFound404} from './components/NotFound404';
import {UserPage} from './components/Users/UserPage';
import {ProjectPage} from './components/Projects/ProjectPage';
import {LoginForm} from './components/Authorization';

export class GeneralApp extends React.Component {
  /**
   * Конструктор главного родителя компонентов. Назначение начальных состояний
   * @param props свойства унаследованные от вышестоящего компонента
   */
  constructor(props) {
    super(props);
    this.state = {
      'domain': 'http://localhost:3333',

      'users_endpoint': '/api/users/',
      'projects_endpoint': '/api/projects/',
      'todos_endpoint': '/api/todos/',
      'token_endpoint': '/api/token/',

      'users': [],
      'projects': [],
      'todos': [],

      'token': '',
      'login': '',
    }
  }

  /**
   * Вызывается сразу после монтирования (то есть, вставки компонента в DOM).
   * В этом методе должны происходить действия, которые требуют наличия
   * DOM-узлов. Это хорошее место для создания сетевых запросов.
   */
  componentDidMount() {
    this.get_token()
  }

  /**
   * Получение токена и логина из хранилища - Cookies и присвоение состояниям
   */
  get_token() {
    const cookies = new Cookies()
    const token = cookies.get('token')
    const login = cookies.get('login');
    this.setState(
      {'token': token, 'login': login}, () => this.get_data())
  }

  /**
   * Конечный этап получения данных, обработки Promises.
   * Обработка ошибок связанных с токеном, извлечённом из Cookies браузера,
   * недоступностью сервера и т.д.
   */
  get_data() {
    this.load_data_promise().catch((error) => {
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

  /**
   * Асинхронное извлечение Promises и присвоение состояниям - в случае
   * удачного исхода, иначе ошибки обработает вышестоящий метод
   * @returns {Promise<void>}
   */
  async load_data_promise() {
    const headers = this.get_headers()
    const {
      domain, users_endpoint, projects_endpoint, todos_endpoint
    } = this.state

    const users = await this.get_promise(
      domain, users_endpoint, headers, 33
    );
    const projects = await this.get_promise(
      domain, projects_endpoint, headers, 33
    );
    const todos = await this.get_promise(
      domain, todos_endpoint, headers, 33
    );

    this.setState({
      'users': users.data.results,
      'projects': projects.data.results,
      'todos': todos.data.results
    })
  }

  /**
   * Запрос данных и передача Promise вышестоящему методу для обработки
   * @param domain Домен
   * @param endpoint Конечная точка
   * @param headers Заголовки
   * @param limit Лимит на количество полученных данных
   * @param offset Смещение относительно первого объекта
   * @returns {Promise<AxiosResponse<any>>}
   */
  get_promise(domain='http://localhost:3333', endpoint, headers, limit = 100, offset = 0) {
    return axios.get(
      `${domain}${endpoint}?limit=${limit}&offset=${offset}/`,
      {headers})
  }

  /**
   * Создание и возврат заголовков для запросов
   * @returns {{"Content-Type": string}}
   */
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

  /**
   * Проверка - авторизован ли пользователь
   * @returns {boolean} - возвращает true или false
   */
  is_authenticated() {
    return this.state.token !== '' && this.state.token !== undefined
  }

  /**
   * Авторизация пользователя. Получение токена на основе логина и пароля
   * @param login - Логин
   * @param password - Пароль
   */
  auth(login, password) {
    const {domain, token_endpoint} = this.state
    axios.post(`${domain}${token_endpoint}`, {
      'username': login,
      'password': password
    }).then(response => {
      this.set_token(response.data['access'], login);
    }).catch(error => {
        console.log(`get_token err: ${error}`);
        alert('Неверный логин или пароль');
      }
    )
  }

  /**
   * Присвоение токена и логина в Cookies и состояния приложения
   * @param token - Токен
   * @param login - Логин
   */
  set_token(token, login) {
    const cookies = new Cookies();
    cookies.set('token', token);
    cookies.set('login', login);

    this.setState({'token': token, 'login': login}, () => {
      this.get_data();
    });
  }

  /**
   * Деавторизация
   */
  logout() {
    this.set_token('', '');
  }

  /**
   * Отображение каркаса приложения. Маршрутизация для дочерних компонентов
   * @returns {JSX.Element}
   */
  render() {
    const {users, projects, todos, login} = this.state

    return (
      <BrowserRouter>
        <div className='content'>
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
