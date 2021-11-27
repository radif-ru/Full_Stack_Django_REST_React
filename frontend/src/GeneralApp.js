/**
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

      "limit": 100,
      "offset": 0,

      "users": [],
      "projects": [],
      "todos": [],

      "token": '',
      "login": '',
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
      {"token": token, "login": login}, () => this.getData());
  }

  /**
   * Конечный этап получения данных, обработки Promises.
   * Обработка ошибок связанных с токеном, извлечённом из Cookies браузера,
   * недоступностью сервера и т.д.
   */
  getData() {
    this.loadDataPromise().catch((error) => {
      console.log(`getData loadDataPromise err: ${error}`);
      if (error.message.indexOf( "ISO-8859-1") !== -1) {
        alert(`Токен испорчен - неправильный формат! Кто-то изменил Cookies!
          \nПовторите вход в свой личный кабинет! И проверьтесь на вирусы!`);
        this.setToken('', '');
      } else if (error.request.status === 401) {
        alert(`Токен просрочен. \nПовторите вход в свой личный кабинет!`);
        this.setToken('', '');
      } else if (error.request.status === 0) {
        alert(`Сервер недоступен! \nПопробуйте зайти позже`);
      } else {
        alert(`Ошибка - ${error} \nПовторите вход в свой личный кабинет!`);
      }
    })
  }

  /**
   * Асинхронное извлечение Promises и присвоение состояниям - в случае
   * удачного исхода, иначе ошибки обработает вышестоящий метод
   * @returns {Promise<void>}
   */
  async loadDataPromise() {
    const {
      domain, graphQLEndpoint, usersEndpoint, limit, offset
    } = this.state;
    const headers = this.getHeaders();

    // Если пользователь не авторизован для получения данных использую GraphQL.
    // Сделано просто для примера. Никакого преимущества это не даёт и даже
    // наоборот размер данных в 2 раза выше из-за того, что id дополнительно
    // вкладываются в объекты (словари) с 1 полем id. Ещё и клиент больше
    // нагружается из-за затрат на извлечение id и преобразование их к числу...
    if (!this.isAuthenticated()) {
      const promiseObj = await this.getPromiseGraphQL(
        domain, graphQLEndpoint, headers
      );

      const users = promiseObj.data.data.allUsers;

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
      this.setState({
        "users": users,
      })
    } else {
      const promiseObj = await this.getPromise(
        domain, usersEndpoint, headers, limit, offset
      );
      const users = promiseObj.data.results
      // Теперь все данные привязаны к пользователям
      // const projects = await this.getPromise(
      //   domain, projectsEndpoint, headers, limit, offset
      // );
      // const todos = await this.getPromise(
      //   domain, todosEndpoint, headers, limit, offset
      // );

      this.setState({
        "users": users,
        // "projects": projects.data.results,
        // "todos": todos.data.results
      })
    }
  }

  /**
   * Запрос данных и передача Promise вышестоящему методу для обработки
   * @param domain {string} Домен
   * @param endpoint {string} Конечная точка
   * @param headers {object} Заголовки
   * @param limit {int} Лимит на количество полученных данных
   * @param offset {int} Смещение относительно первого объекта
   * @returns {Promise<AxiosResponse<any>>}
   */
  getPromise(domain = "http://localhost:3333", endpoint, headers, limit = 100, offset = 0) {
    return axios.get(
      `${domain}${endpoint}?limit=${limit}&offset=${offset}/`,
      {headers})
  }

  /**
   * Запрос данных и передача Promise вышестоящему методу для обработки
   * @param domain {string} Домен
   * @param graphQLEndpoint {string} Конечная точка
   * @param headers {object} Заголовки
   * @returns {Promise<AxiosResponse<any>>}
   */
  getPromiseGraphQL(domain, graphQLEndpoint, headers) {
    return axios.post(
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
      })
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
   * @param login - Логин
   * @param password - Пароль
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
   * @param token - Токен
   * @param login - Логин
   */
  setToken(token, login) {
    const cookies = new Cookies();
    cookies.set("token", token);
    cookies.set("login", login);

    this.setState({"token": token, "login": login},
      () => {
        this.getData();
      }
    );
  }

  /**
   * Деавторизация
   */
  logout() {
    this.setToken('', '');
  }

  /**
   * Отображение каркаса приложения. Маршрутизация для дочерних компонентов
   * @returns {JSX.Element}
   */
  render() {
    const {users, login} = this.state;

    return (
      <BrowserRouter>
        <div className="content">
          <Header
            isAuthenticated={() => this.isAuthenticated()}
            logout={() => this.logout()}
            login={login}
          />
          <div className="main-content">
            <Routes>
              <Route exact path="/users" element={<Users users={users}/>}/>
              <Route
                exact
                path="/users/:id"
                element={<UserPage users={users}/>}
              />
              <Route
                exact
                path="/projects"
                element={<Projects users={users}/>}
              />
              <Route
                exact
                path="/projects/:id"
                element={<ProjectPage users={users}/>}
              />
              <Route
                exact path="/todos"
                element={<Todos users={users}/>}
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
