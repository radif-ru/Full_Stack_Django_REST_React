/**
 * На клиенте используется архитектура One Way Data Flow
 * Главный родитель компонентов
 */
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
  /**
   * Конструктор главного родителя компонентов. Назначение начальных состояний
   * @param props свойства унаследованные от вышестоящего компонента
   */
  constructor(props) {
    super(props);
    this.state = {
      "domain": "http://localhost:3333",

      "usersEndpoint": "/api/users/",
      "projectsEndpoint": "/api/projects/",
      "todosEndpoint": "/api/todos/",

      "graphQLEndpoint": "/graphql/",

      "tokenEndpoint": "/api/token/",

      "limit": 1000,
      "offset": 0,

      "users": [],
      "projects": [],
      "todos": [],

      "token": "",
      "login": "",
    }
  }

  /**
   * Вызывается сразу после монтирования (то есть, вставки компонента в DOM).
   * В этом методе должны происходить действия, которые требуют наличия
   * DOM-узлов. Это хорошее место для создания сетевых запросов.
   */
  componentDidMount() {
    this.getToken()
  }

  /**
   * Получение токена и логина из хранилища - Cookies и присвоение состояниям
   */
  getToken() {
    const cookies = new Cookies();
    const token = cookies.get("token");
    const login = cookies.get("login");
    this.setState(
      {"token": token, "login": login}, () => this.getAllData());
  }

  /**
   * Создание и возврат заголовков для запросов
   * @returns {{"Content-Type": string}}
   */
  getHeaders() {
    let headers = {
      "Content-Type": "application/json"
    }
    if (this.isAuthenticated()) {
      // Для JWT к токену в заголовке нужно добавить префикс Bearer
      // headers["Authorization"] = `Bearer ${this.state.token}`;
      // Для безопасности изменил проверку на сервере значения заголовка на
      // кастомное
      headers["Authorization"] = `Bear_R@d1f ${this.state.token}`;
    }
    return headers
  }

  /**
   * Проверка - авторизован ли пользователь
   * @returns {boolean} - возвращает true или false
   */
  isAuthenticated() {
    return !!(this.state.token);
  }

  /**
   * Авторизация пользователя. Получение токена на основе логина и пароля
   * @param login {string} - Логин
   * @param password {string}  - Пароль
   */
  auth(login, password) {
    const {domain, tokenEndpoint} = this.state
    axios.post(`${domain}${tokenEndpoint}`, {
      "username": login,
      "password": password
    }).then(response => {
      this.setToken(response.data["access"], login);
    }).catch(error => {
        console.log(`getToken err: ${error}`);
        alert("Неверный логин или пароль");
      }
    )
  }

  /**
   * Присвоение токена и логина в Cookies и состояния приложения
   * @param token {string}  - Токен
   * @param login {string}  - Логин
   */
  setToken(token, login) {
    const cookies = new Cookies();
    cookies.set("token", token);
    cookies.set("login", login);

    this.setState({"token": token, "login": login},
      () => {
        this.getAllData();
      }
    );
  }

  /**
   * Деавторизация
   */
  logout() {
    this.setToken("", "");
  }

  /**
   * Получить все данные
   */
  getAllData() {
    // Если пользователь не авторизован для получения данных использую GraphQL.
    // Сделано просто для примера. Никакого преимущества это не даёт и даже
    // наоборот размер данных в 2 раза выше из-за того, что id дополнительно
    // вкладываются в объекты (словари) с 1 полем id. Ещё и клиент больше
    // нагружается из-за затрат на извлечение id и преобразование их к числу...
    if (!this.isAuthenticated()) {
      this.getUsersDataGraphQL();
    } else {
      this.getUsersDataREST();
    }
  }

  /**
   * Получить данные пользователей из Django REST
   */
  getUsersDataREST() {
    const {
      domain, usersEndpoint, limit, offset
    } = this.state;
    const headers = this.getHeaders();

    this.getDataREST(domain, usersEndpoint, headers, limit, offset)
  }

  /**
   * Получить данные заметок из Django REST
   */
  getTodosDataREST() {
    const {
      domain, todosEndpoint, limit, offset
    } = this.state;
    const headers = this.getHeaders();

    this.getDataREST(domain, todosEndpoint, headers, limit, offset);
  }

  /**
   * Получить данные проектов из Django REST
   */
  getProjectsDataREST() {
    const {
      domain, projectsEndpoint, limit, offset
    } = this.state;
    const headers = this.getHeaders();

    this.getDataREST(domain, projectsEndpoint, headers, limit, offset);
  }

  /**
   * Получить данные пользователей из GraphQL
   */
  getUsersDataGraphQL() {
    const {domain, graphQLEndpoint} = this.state;
    const headers = this.getHeaders();
    this.getDataGraphQL(domain, graphQLEndpoint, headers);
  }


  /**
   * Удаление заметки с помощью Django REST
   * @param id {int} Идентификатор заметки
   * @returns {Promise<void>}
   */
  async deleteTodo(id) {
    const {domain, todosEndpoint} = this.state;
    const headers = this.getHeaders();
    await this.deleteDataREST(domain, todosEndpoint, id, headers);
  }


  /**
   * Создание заметки с помощью Django REST
   * @param project {int} Идентификатор проекта
   * @param user {int} Идентификатор пользователя
   * @param text {string} Текст заметки
   * @returns {Promise<void>}
   */
  async createTodo(project, user, text) {
    const {domain, todosEndpoint} = this.state;
    const headers = this.getHeaders();
    const data = {
      "project": project,
      "user": user,
      "text": text
    }
    await this.createDataREST(data, domain, todosEndpoint, headers);
  }

  /**
   * Асинхронный запрос данных из Django REST, извлечение и обработка
   * @param domain {string} Домен
   * @param endpoint {string} Конечная точка
   * @param headers {object} Заголовки
   * @param limit {int} Лимит на количество полученных данных
   * @param offset {int} Смещение относительно первого объекта
   * @returns {Promise<void>}
   */
  async getDataREST(
    domain = "http://localhost:3333",
    endpoint, headers, limit = 100, offset = 0) {

    await axios.get(
      `${domain}${endpoint}?limit=${limit}&offset=${offset}/`,
      {headers}).then(response => {
      // В случае удачного удаления перезагружаю данные с сервера.
      // Можно конечно просто удалить элемент из состояния, но это может
      // привести к артефактам, рассинхрону с актуальными данными...
      const users = response.data.results;

      this.setAllData(users);

    })
      .catch((error) => {
        this.handleErrors(error, "getDataREST");
      })
  }

  /**
   * Асинхронный запрос данных из GraphQL, извлечение и обработка
   * Так же происходит пересборка данных, комментарии ниже
   * @param domain {string} Домен
   * @param graphQLEndpoint {string} Конечная точка
   * @param headers {object} Заголовки
   * @returns {Promise<void>}
   */
  async getDataGraphQL(domain, graphQLEndpoint, headers) {
    await axios.post(
      `${domain}${graphQLEndpoint}`,
      {
        query: `{
          allUsers {
            id
            username
            firstName
            lastName
            middleName
            email
            birthdate
            roles {
              id
              role
            }
            userProjects {
              id
              name
              repository
              isActive
              created
              updated
              users {
                id
              }
            }
            userTodos{
              id
              text
              isActive
              created
              updated
              project {
                id
              }
              user {
                id
              }
            }
          }
        }`,
        headers: headers,
      }).then(response => {

      const users = response.data.data.allUsers;

      // Во избежание конфликтов пересобираю данные так же, как если бы запрос
      // делался на Django REST, а не на GraphQL. ID перевожу в цифровой формат

      users.map(user => {
        user.id = +user.id;
        // Преобразую поля заметок
        user.userTodos.map(todo => {
          // В поле user и project помещаю соответствующие id, вместо объектов
          todo.id = +todo.id;
          todo.user = +todo.user.id;
          todo.project = +todo.project.id;
          return todo
        });
        // Преобразую поля проектов
        user.userProjects.map(project => {
          project.id = +project.id;
          // Вместо массива объектов, делаю массив из id
          const usersArr = [];
          project.users.map(user => {
            usersArr.push(+user.id);
            return user
          })
          project.users = usersArr;
          return project
        })
        return user
      })

      this.setAllData(users);

    })
      .catch((error) => {
        this.handleErrors(error, "getDataGraphQL");
      })
  }

  /**
   * Сохраняю полученные данные из Django REST и GraphQL в состояния
   * @param data {array} Полученные данные
   */
  setAllData(data) {
    // Данные пользователей. Сначала делаю копию массива, чтобы изменения не
    // коснулись других ссылок на данные массива, затем удаляю лишние данные
    let users = JSON.parse(JSON.stringify(data));
    users.map(user => {
      delete user.userProjects;
      delete user.userTodos;
      return user;
    })

    // Проекты всех пользователей
    let projects = data.map(user => user.userProjects)
      .filter(project => project.length)
      .reduce((arr1, arr2) => [...arr1, ...arr2], ...[]);
    // Уникальные id проектов
    const unique_ids = [...new Set(projects.map(project => project.id))];
    // Уникальные проекты
    projects = unique_ids
      .map(id => projects.find(project => project.id === id));
    // Сортировка проектов по дате обновления
    projects.sort((a, b) =>
      new Date(b.updated) - new Date(a.updated)
    )

    // Заметки всех пользователей
    let todos = data.map(user => user.userTodos).filter(todo => todo.length)
    // Разворот массивов внутри массива
    todos = todos.reduce((arr1, arr2) => [...arr1, ...arr2], ...[]);
    // Сортировка заметок по дате обновления
    todos.sort((a, b) =>
      new Date(b.updated) - new Date(a.updated)
    )

    this.setState({
      "users": users,
      "projects": projects,
      "todos": todos
    })
  }


  /**
   * POST запрос в Django REST на создание данных
   * @param data {object} Отправляемые данные
   * @param domain {string} Домен
   * @param endpoint {string} Конечная точка
   * @param headers {object} Заголовки
   */
  createDataREST(data, domain, endpoint, headers) {
    axios.post(`${domain}${endpoint}`, data, {headers})
      .then(response => {
        // В случае удачной операции перезагружаю данные с сервера.
        // Можно конечно просто удалить элемент из состояния, но это может
        // привести к артефактам, рассинхрону с актуальными данными...
        this.getAllData();
      })
      .catch(error => {
          this.handleErrors(error, "createDataREST");
        }
      )
  }

  /**
   * Удаление данных с помощью Django REST
   * @param domain {string} Домен
   * @param endpoint {string} Конечная точка заметок
   * @param id {int} Идентификатор
   * @param headers {object} Заголовки
   */
  deleteDataREST(domain, endpoint, id, headers) {
    axios.delete(`${domain}${endpoint}${id}`, {headers})
      .then(response => {
        // В случае удачного удаления перезагружаю данные с сервера.
        // Можно конечно просто удалить элемент из состояния, но это может
        // привести к артефактам, рассинхрону с актуальными данными...
        this.getAllData();
      })
      .catch(error => {
          this.handleErrors(error, "deleteDataREST");
        }
      )
  }

  /**
   * Обработка ошибок связанных с токеном, извлечённом из
   * Cookies браузера, недоступностью сервера и т.д.
   * @param error {object} Объект ошибки
   * @param text {string} Пояснение к ошибке, или откуда вызвана
   */
  handleErrors(error, text = "") {
    console.log(`${text} err: ${error}`);
    if (error.message.indexOf("ISO-8859-1") !== -1) {
      alert(`Токен испорчен - неправильный формат! Кто-то изменил Cookies!
          \nПовторите вход в свой личный кабинет! И проверьтесь на вирусы!`);
      this.setToken("", "");
    }
    if (!!error.request) {
      if (error.request.status === 401) {
        alert(`Токен просрочен. \nПовторите вход в свой личный кабинет!`);
        this.setToken("", "");
      } else if (error.request.status === 0) {
        alert(`Сервер недоступен! \nПопробуйте зайти позже`);
      } else if (error.request.status === 500) {
        alert(`Внутренняя ошибка сервера! \nСервер не может обработать Ваш 
        запрос`);
      } else if (error.request.status === 403) {
        alert(`Для Вас это действие запрещено!`)
      } else if (error.request.status === 404) {
        alert(`Данные не найдены. Подождите. Не кликайте много раз подряд. 
        \nВозможно мы ещё не обработали запрос`)
      } else if (error.request.status === 400) {
        alert(`Сервер не принял Ваши данные. Возможно они не уникальны. 
        \nПопробуйте ввести что-то другое`)
      }
    } else {
      alert(`Ошибка - ${error}`);
    }
  }

  /**
   * Отображение каркаса приложения. Маршрутизация для дочерних компонентов
   * @returns {JSX.Element}
   */
  render() {
    const {users, projects, todos, login} = this.state;

    return (
      <BrowserRouter>
        <div className="content">
          <Header
            isAuthenticated={() => this.isAuthenticated()}
            logout={() => this.logout()}
            login={login}
            users={users}
          />
          <div className="main-content">
            <Routes>
              <Route exact path="/users" element={<Users users={users}/>}/>
              <Route
                exact
                path="/users/:id"
                element={
                  <UserPage
                    users={users}
                    projects={projects}
                    todos={todos}
                    login={login}
                    isAuthenticated={() => this.isAuthenticated()}
                    createTodo={(project, user, text) =>
                      this.createTodo(project, user, text)
                    }
                  />
                }
              />
              <Route
                exact
                path="/projects"
                element={<Projects users={users} projects={projects}/>}
              />
              <Route
                exact
                path="/projects/:id"
                element={
                  <ProjectPage
                    users={users}
                    isAuthenticated={() => this.isAuthenticated()}
                    login={login}
                    projects={projects}
                    todos={todos}
                    createTodo={(project, user, text) =>
                      this.createTodo(project, user, text)
                    }
                  />
                }
              />
              <Route
                exact path="/todos"
                element={
                  <Todos
                    users={users}
                    projects={projects}
                    todos={todos}
                    isAuthenticated={() => this.isAuthenticated()}
                    deleteTodo={(id) => this.deleteTodo(id)}
                    login={login}
                  />
                }
              />
              <Route
                exact
                path="/login"
                element={
                  <LoginForm
                    auth={(login, password) => this.auth(login, password)}
                  />
                }
              />
              <Route exact path="/" element={<Navigate to="/todos"/>}/>
              <Route path="*" element={<NotFound404/>}/>
            </Routes>
          </div>
        </div>
        <Footer/>
      </BrowserRouter>
    )
  }
}
