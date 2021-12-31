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
import {UserForm} from "./components/Users/UserForm";
import dateFormat from "dateformat";
import {i18n} from "dateformat";
import {getMyDateFormat} from "./scripts/getMyDateFormat";
import {AsyncioAiohttp} from "./components/AsyncioAiohttp";
import {UploadImages} from "./components/UploadImages";

// Меняю форматирование даты на свой кастомный язык
getMyDateFormat(dateFormat, i18n)


/**
 * На клиенте используется принцип One-Way Data Flow
 * Главный родитель компонентов
 */
export class GeneralApp extends React.Component {
  /**
   * Конструктор главного родителя компонентов. Назначение начальных состояний
   * @param props свойства унаследованные от вышестоящего компонента
   */
  constructor(props) {
    super(props);
    this.state = {
      "domain": "https://backend.radif.ru",
      "swaggerEndpoint": "/swagger/",
      "swaggerJsonEndpoint": "/swagger.json",
      "swaggerYamlEndpoint": "/swagger.yaml",
      "reDocEndpoint": "/redoc/",
      "RESTAPIEndpoint": "/api/",
      "adminEndpoint": "/administration/",

      // Включены вложенные объекты данных, для получения данных без
      // вложенности есть много других endpoint-ов, подробнее в OpenAPI проекта
      "rolesEndpoint": "/api/roles/",
      "usersEndpoint": "/api/users/",
      "projectsEndpoint": "/api/projects/",
      "todosEndpoint": "/api/todos/",

      "asyncioAiohttpEndpoint": "/api/todos/async_fish_todos/",
      "uploadImagesEndpoint": "/api/images/",
      "imageResizeEndpoint": "/resize/",

      "graphQLEndpoint": "/graphql/",

      "tokenEndpoint": "/api/token/",
      "tokenRefreshEndpoint": "/api/token/refresh/",

      "limit": 999,
      "offset": 0,

      "roles": [],
      "users": [],
      "projects": [],
      "todos": [],

      "token": "",
      "refreshToken": "",
      "login": "",
      "admin": false,

      "notification": ""
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
   * @returns {boolean} Возвращает true или false
   */
  isAuthenticated() {
    return !!(this.state.token)
  }

  /**
   * Проверка - является ли администратором пользователь
   * @param login {string} Логин пользователя
   * @param users {Array} Массив объектов пользователей
   * @param roles {Array} Массив объектов ролей
   * @returns {boolean} Возвращает true или false
   */
  isAdmin(login, users, roles) {
    const user = users.find(user => user.username === login);
    const adminRole = roles.find(role => role.role === "администратор");
    return !!user.roles.find(roleId => roleId === adminRole.id)
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
   * Присвоение токена и логина в Cookies для всех путей и состояния приложения
   * @param token {string} Токен
   * @param login {string} Логин
   */
  setToken(token, login) {
    const cookies = new Cookies();
    cookies.set("token", token, {path: "/"});
    cookies.set("login", login, {path: "/"});


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
      this.getRolesDataSetGraphQL();
    } else {
      this.getRolesDataSetREST();
    }
  }

  /**
   * Получить данные ролей из Django REST и все связанные данные других таблиц
   */
  getRolesDataSetREST() {
    const {
      domain, rolesEndpoint, limit, offset
    } = this.state;

    this.getDataREST(domain, rolesEndpoint, limit, offset)
  }

  /**
   * Получить данные ролей из GraphQL и все связанные данные других таблиц
   */
  getRolesDataSetGraphQL() {
    const {domain, graphQLEndpoint} = this.state;
    const queryGraphQL = `
      {
        allRoles {
          id
          role
          roleUsers {
            id
            username
            firstName
            lastName
            middleName
            email
            birthdate
            lastLogin
            isStaff
            isActive
            dateJoined
            updated
            roles {
              id
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
        }
      }`;
    this.getDataGraphQL(domain, graphQLEndpoint, queryGraphQL);
  }

  /**
   * Получить данные пользователей из Django REST со связанными данными
   */
  getUsersDataSetREST() {
    const {
      domain, usersEndpoint, limit, offset
    } = this.state;

    this.getDataREST(domain, usersEndpoint, limit, offset)
  }

  /**
   * Получить данные заметок из Django REST со связанными данными
   */
  getTodosDataSetREST() {
    const {
      domain, todosEndpoint, limit, offset
    } = this.state;

    this.getDataREST(domain, todosEndpoint, limit, offset);
  }

  /**
   * Получить данные проектов из Django REST со связанными данными
   */
  getProjectsDataSetREST() {
    const {
      domain, projectsEndpoint, limit, offset
    } = this.state;

    this.getDataREST(domain, projectsEndpoint, limit, offset);
  }

  /**
   * Регистрация пользователя
   * @param data {Object} Объект данных пользователя
   * @returns {Promise<void>}
   */
  async createUser(data) {
    const {domain, usersEndpoint} = this.state;
    await this.createDataREST(data, domain, usersEndpoint);
  }

  /**
   * Создание проекта с помощью Django REST.
   * При создании проекта создателю назначается дополнительная роль -
   * владелец проекта. Но если он добавляет других пользователей к этому
   * проекту им не назначается данная роль.
   * @param data.name {string} Имя проекта
   * @param data.repository {url, string} Ссылка на репозиторий проекта
   * @param data.users {array} Массив id пользователей
   * @returns {Promise<void>}
   */
  async createProject(data) {
    const {domain, projectsEndpoint, roles, users, login} = this.state;
    await this.createDataREST(data, domain, projectsEndpoint);

    const projectOwnerRole = +roles.find(
      role => role.role === "владелец проекта"
    ).id
    const authUser = users.find(user => user.username === login)
    if (!authUser.roles.find(role => role === projectOwnerRole)) {
      await this.editUser({
        "roles": [...authUser.roles, projectOwnerRole]
      }, +authUser.id)
    }
  }

  /**
   * Создание заметки с помощью Django REST
   * @param data.project {number} Идентификатор проекта
   * @param data.user {number} Идентификатор пользователя
   * @param data.text {string} Текст заметки
   * @returns {Promise<void>}
   */
  async createTodo(data) {
    const {domain, todosEndpoint} = this.state;
    await this.createDataREST(data, domain, todosEndpoint);
  }

  /**
   * Редактирование пользователя. Обновление состояния актуальными данными без
   * перезагрузки данных из БД.
   * @param data {Object} Изменяемые данные пользователя
   * @param id {number} Идентификатор пользователя
   * @returns {Promise<void>}
   */
  async editUser(data, id) {
    const {domain, usersEndpoint, users} = this.state;
    const newUser = users.find(todo => todo.id === id);
    // Обновляю проект новыми данными, если есть
    Object.keys(data).map((objectKey, index) =>
      newUser[objectKey] = data[objectKey]
    );
    await this.setState(
      {
        "users": users.map(user =>
          // Замена обновлённых данных и даты обновления с помощью фичи ES6
          user.id === id
            ? {
              ...user, ...newUser, updated: dateFormat(
                new Date(), "dddd, d mmmm, yyyy года, h:MM:ss tt"
              )
            }
            : user
        )
      },
      // Отправляю в БД только те данные, которые нужно изменить
      () => this.editDataREST(data, domain, usersEndpoint, id)
    )
  }

  /**
   * Редактирование проекта. Обновление состояния актуальными данными без
   * перезагрузки данных из БД.
   * @param data {Object} Объект со свойствами проекта
   * @param id {number} Идентификатор проекта
   * @returns {Promise<void>}
   */
  async editProject(data, id) {
    const {domain, projectsEndpoint, projects} = this.state;
    const newProject = projects.find(todo => todo.id === id);
    // Обновляю проект новыми данными, если есть
    Object.keys(data).map((objectKey, index) =>
      newProject[objectKey] = data[objectKey]
    );
    await this.setState(
      {
        "projects": projects.map(project =>
          // Замена обновлённых данных и даты обновления с помощью фичи ES6
          project.id === id
            ? {
              ...project, ...newProject, updated: dateFormat(
                new Date(), "dddd, d mmmm, yyyy года, h:MM:ss tt"
              )
            }
            : project
        )
      },
      // Отправляю в БД только те данные, которые нужно изменить
      () => this.editDataREST(data, domain, projectsEndpoint, id)
    )
  }

  /**
   * Редактирование заметки. Обновление состояния актуальными данными без
   * перезагрузки данных из БД.
   * @param data {Object} Объект со свойствами заметки
   * @param data.text {string} Текст заметки
   * @param id {number} Идентификатор заметки
   * @returns {Promise<void>}
   */
  async editTodo(data, id) {
    const {domain, todosEndpoint, todos} = this.state;
    const newTodo = todos.find(todo => todo.id === id);
    // Обновляю заметку новыми данными, если есть
    Object.keys(data).map((objectKey, index) =>
      newTodo[objectKey] = data[objectKey]
    );
    await this.setState(
      {
        "todos": todos.map(todo =>
          // Замена обновлённых данных и даты обновления с помощью фичи ES6
          todo.id === id
            ? {
              ...todo, ...newTodo, updated: dateFormat(
                new Date(), "dddd, d mmmm, yyyy года, h:MM:ss tt"
              )
            }
            : todo
        )
      },
      // Отправляю в БД только те данные, которые нужно изменить
      () => this.editDataREST(data, domain, todosEndpoint, id)
    )
  }

  /**
   * Удаление проекта с помощью Django REST.
   * Перерисовка без перезагрузки данных из БД.
   * Вместе с проектом удаляются все связанные заметки.
   * @param id {number} Идентификатор проекта
   * @returns {Promise<void>}
   */
  async deleteProject(id) {
    const {domain, projectsEndpoint, projects, todos} = this.state;
    await this.setState(
      {
        "projects": projects.filter(projects => projects.id !== id),
        "todos": todos.filter(todo => todo.project !== id)
      },
      () => this.deleteDataREST(domain, projectsEndpoint, id)
    )
  }

  /**
   * Удаление заметки с помощью Django REST.
   * Перерисовка без перезагрузки данных из БД.
   * @param id {number} Идентификатор заметки
   * @returns {Promise<void>}
   */
  async deleteTodo(id) {
    const {domain, todosEndpoint, todos} = this.state;
    await this.setState(
      {"todos": todos.filter(todo => todo.id !== id)},
      () => this.deleteDataREST(domain, todosEndpoint, id)
    )
  }

  /**
   * Асинхронный запрос данных из Django REST, извлечение и обработка
   * @param domain {string} Домен
   * @param endpoint {string} Конечная точка
   * @const headers {object} Заголовки
   * @param limit {number} Лимит на количество полученных данных
   * @param offset {number} Смещение относительно первого объекта
   * @returns {Promise<void>}
   */
  async getDataREST(
    domain = "http://localhost:3333",
    endpoint,
    limit = 100,
    offset = 0
  ) {

    const headers = this.getHeaders();
    await axios.get(
      `${domain}${endpoint}?limit=${limit}&offset=${offset}/`,
      {headers}).then(response => {
      const data = response.data.results;
      this.setAllData(data);
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
   * @param queryGraphQL {string} Запрос на языке GraphQL
   * @const headers {object} Заголовки
   * @returns {Promise<void>}
   */
  async getDataGraphQL(
    domain,
    graphQLEndpoint,
    queryGraphQL
  ) {
    const headers = this.getHeaders();
    await axios.post(
      `${domain}${graphQLEndpoint}`,
      {
        query: queryGraphQL,
        headers: headers,
      }).then(response => {

      const rolesSet = response.data.data.allRoles;

      const usersSet = rolesSet.map(role => {
        // id ролей перевожу в числовой формат.
        // Хотя и role.id не возвращается, но как мы знаем данные в JS хранятся
        // по ссылке, так что они изменились глобально.
        role.id = +role.id;
        // Возвращаю пользователей для дальнейшей мутации данных
        return role.roleUsers;
      })
        .reduce((arr1, arr2) => [...arr1, ...arr2])

      // Во избежание конфликтов пересобираю данные так же, как если бы запрос
      // делался на Django REST, а не на GraphQL. ID перевожу в цифровой формат

      usersSet.map(user => {
        user.id = +user.id;
        // Преобразую объекты ролей в массив из id
        const rolesArr = [];
        user.roles.map(role => {
          rolesArr.push(+role.id);
          return role
        });
        user.roles = rolesArr;
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

      this.setAllData(rolesSet);

    })
      .catch((error) => {
        this.handleErrors(error, "getDataGraphQL");
      })
  }

  /**
   * Сохраняю полученные данные из Django REST и GraphQL в состояния.
   * Мутирую данные, распределяю по категориям, сортирую...
   * @param data {array} Полученные данные.
   */
  setAllData(data) {
    let roles = [];
    let projects = [];
    let todos = [];

    let usersSet = data.map(role => {
      // Собираю роли
      roles.push({id: role.id, role: role.role});
      // Возвращаю набор пользователей со связанными данными
      return role.roleUsers;
    })
      .reduce((arr1, arr2) => [...arr1, ...arr2], ...[])
    // Уникальные id пользователей
    const uniqueUsersIds = [...new Set(usersSet.map(project => project.id))];
    // Уникальные пользователи
    const users = uniqueUsersIds.map(userId => {
      const {userProjects, userTodos, ...rest} = usersSet.find(
        user => {
          if (user.id === userId) {
            // Сразу, при сборке данных привожу даты в нужный формат
            user.updated = user.updated ? dateFormat(
              user.updated, "dddd, d mmmm, yyyy года, h:MM:ss tt"
            ) : null;
            user.dateJoined = user.dateJoined ? dateFormat(
              user.dateJoined, "dddd, d mmmm, yyyy года, h:MM:ss tt"
            ) : null;
            user.lastLogin = user.lastLogin ? dateFormat(
              user.lastLogin, "dddd, d mmmm, yyyy года, h:MM:ss tt"
            ) : null;
            return true
          }
          return false
        }
      );
      // Собираю заметки
      todos.push(...userTodos.map(todo => {
        // Сразу, при сборке данных привожу даты в нужный формат
        todo.created = todo.created ? dateFormat(
          todo.created, "dddd, d mmmm, yyyy года, h:MM:ss tt"
        ) : null;
        todo.updated = todo.updated ? dateFormat(
          todo.updated, "dddd, d mmmm, yyyy года, h:MM:ss tt"
        ) : null;
        return todo
      }));
      // Собираю проекты
      projects.push(...userProjects);
      // Возвращаю чистых пользователей
      return rest;
    });
    // Сортирую пользователей по дате регистрации
    users.sort((a, b) =>
      new Date(b.dateJoined) - new Date(a.dateJoined)
    )

    // Уникальные id проектов
    const uniqueProjectsIds = [...new Set(projects.map(project => project.id))];
    // Уникальные проекты
    projects = uniqueProjectsIds
      .map(id => projects.find(project => {
        if (project.id === id) {
          // Сразу, при сборке данных привожу дату в нужный формат
          project.created = project.created ? dateFormat(
            project.created, "dddd, d mmmm, yyyy года, h:MM:ss tt"
          ) : null;
          // Сразу, при сборке данных привожу дату в нужный формат
          project.updated = project.updated ? dateFormat(
            project.updated, "dddd, d mmmm, yyyy года, h:MM:ss tt"
          ) : null;
          return true
        }
        return false
      }));
    // Сортировка проектов по дате обновления
    projects.sort((a, b) =>
      new Date(b.created) - new Date(a.created)
    )

    // Сортировка заметок по дате обновления
    todos.sort((a, b) =>
      new Date(b.created) - new Date(a.created)
    )

    let admin = false;
    if (this.isAuthenticated()) {
      admin = this.isAdmin(this.state.login, users, roles);
    }

    this.setState({
      "roles": roles,
      "users": users,
      "projects": projects,
      "todos": todos,
      "admin": admin
    })
  }

  /**
   * POST запрос в Django REST на создание данных
   * В случае удачной операции создаю уведомление. Перезагружаю данные с
   * сервера для избежания артефактов, рассинхрона с актуальными данными...
   * В других методах (удаления, изменения) происходит перерисовка данных,
   * без повторной загрузки из БД
   * @param data {object} Отправляемые данные
   * @param domain {string} Домен
   * @param endpoint {string} Конечная точка
   * @const headers {object} Заголовки
   */
  createDataREST(data, domain, endpoint) {
    const headers = this.getHeaders();
    axios.post(`${domain}${endpoint}`, data, {headers})
      .then(response => {
        this.setNotification("Успешная операция!");
        this.getAllData();
      })
      .catch(error => {
          this.handleErrors(error, "createDataREST");
        }
      )
  }

  /**
   * Редактирование данных с помощью Django REST. Patch запрос.
   * Данные перезагружаются только в случае ошибки.
   * Перерисовка происходит через метод, вызвавший этот метод.
   * @param data {Object} Объект данных
   * @param domain {string} Домен
   * @param endpoint {string} Конечная точка
   * @param id {number} Идентификатор изменяемых данных
   */
  editDataREST(data, domain, endpoint, id) {
    const headers = this.getHeaders();
    axios.patch(`${domain}${endpoint}${id}/`, data, {headers})
      .then(response => {
      })
      .catch(error => {
          this.handleErrors(error, "createDataREST");
          this.getAllData();
        }
      )
  }

  /**
   * Удаление данных с помощью Django REST.
   * Данные перезагружаются только в случае ошибки.
   * Перерисовка происходит через метод, вызвавший этот метод.
   * @param domain {string} Домен
   * @param endpoint {string} Конечная точка
   * @param id {number} Идентификатор удаляемых данных
   * @const headers {object} Заголовки
   */
  deleteDataREST(domain, endpoint, id) {
    const headers = this.getHeaders()
    axios.delete(`${domain}${endpoint}${id}`, {headers})
      .then(response => {
      })
      .catch(error => {
          this.handleErrors(error, "deleteDataREST");
          this.getAllData();
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
        alert(`Сервер не может обработать Ваш запрос.
        \nВероятно вы отправили некорректные данные.
        `);
      } else if (error.request.status === 403) {
        alert(`Для Вас это действие запрещено!`)
      } else if (error.request.status === 404) {
        alert(`Данные не найдены. Подождите. Не кликайте много раз подряд. 
        \nВозможно мы ещё не обработали запрос`)
      } else if (error.request.status === 400) {
        alert(`Сервер не принял Ваши данные. Данные должны быть уникальны. 
        \nПоля должны быть заполнены правильно. Попробуйте ввести что-то другое
        `)
      }
    } else {
      alert(`Ошибка - ${error}`);
    }
  }

  /**
   * Получить уведомление
   * @returns {string|Notification|*}
   */
  getNotification() {
    return this.state.notification
  }

  /**
   * Установка уведомления
   * @param text {string} Текст уведомления
   */
  setNotification(text) {
    this.setState({
      "notification": text
    })
  }

  /**
   * Отображение каркаса приложения. Маршрутизация для дочерних компонентов
   * @returns {JSX.Element}
   */
  render() {
    const {
      roles, users, projects, todos, login, admin, domain, swaggerEndpoint,
      swaggerJsonEndpoint, swaggerYamlEndpoint, reDocEndpoint, RESTAPIEndpoint,
      graphQLEndpoint, tokenEndpoint, tokenRefreshEndpoint, adminEndpoint,
      asyncioAiohttpEndpoint, limit, offset, uploadImagesEndpoint,
      imageResizeEndpoint
    } = this.state;

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
              <Route
                exact path="/users"
                element={<Users users={users} roles={roles}/>}
              />
              <Route
                exact
                path="/users/:id"
                element={
                  <UserPage
                    roles={roles}
                    users={users}
                    projects={projects}
                    todos={todos}
                    login={login}
                    isAuthenticated={() => this.isAuthenticated()}
                    createTodo={(project, user, text) =>
                      this.createTodo(project, user, text)
                    }
                    deleteTodo={id => this.deleteTodo(id)}
                    createProject={(name, repository, users) =>
                      this.createProject(name, repository, users)
                    }
                    deleteProject={(id => this.deleteProject(id))}
                    editTodo={(data, id) => this.editTodo(data, id)}
                    admin={admin}
                    editProject={(data, id) => this.editProject(data, id)}
                    editUser={(data, id) => this.editUser(data, id)}
                    getNotification={() => this.getNotification()}
                    setNotification={text => this.setNotification(text)}
                  />
                }
              />
              <Route
                exact
                path="/registration"
                element={
                  <UserForm
                    roles={roles}
                    createUser={data => this.createUser(data)}
                    getNotification={() => this.getNotification()}
                    setNotification={text => this.setNotification(text)}
                  />
                }
              />
              <Route
                exact
                path="/projects"
                element={
                  <Projects
                    users={users}
                    projects={projects}
                    isAuthenticated={() => this.isAuthenticated()}
                    login={login}
                    deleteProject={(id => this.deleteProject(id))}
                    admin={admin}
                  />
                }
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
                    deleteTodo={(id) => this.deleteTodo(id)}
                    deleteProject={(id => this.deleteProject(id))}
                    editTodo={(data, id) => this.editTodo(data, id)}
                    admin={admin}
                    editProject={(data, id) => this.editProject(data, id)}
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
                    deleteTodo={id => this.deleteTodo(id)}
                    login={login}
                    admin={admin}
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
              <Route
                exact
                path="asyncio-aiohttp"
                element={
                  <AsyncioAiohttp
                    domain={domain}
                    asyncioAiohttpEndpoint={asyncioAiohttpEndpoint}
                    limit={limit}
                    offset={offset}
                    getHeaders={() => this.getHeaders()}
                    handleErrors={
                      (error, text) => this.handleErrors(error, text)
                    }
                  />
                }
              />
              <Route
                exact
                path="upload-images"
                element={
                  <UploadImages
                    domain={domain}
                    uploadImagesEndpoint={uploadImagesEndpoint}
                    limit={limit}
                    offset={offset}
                    getHeaders={() => this.getHeaders()}
                    handleErrors={
                      (error, text) => this.handleErrors(error, text)
                    }
                    isAuthenticated={() => this.isAuthenticated()}
                    imageResizeEndpoint={imageResizeEndpoint}
                  />
                }
              />

              <Route exact path="/" element={<Navigate to="/todos"/>}/>
              <Route path="*" element={<NotFound404/>}/>
            </Routes>
          </div>
          <Footer
            domain={domain}
            swaggerEndpoint={swaggerEndpoint}
            swaggerJsonEndpoint={swaggerJsonEndpoint}
            swaggerYamlEndpoint={swaggerYamlEndpoint}
            reDocEndpoint={reDocEndpoint}
            RESTAPIEndpoint={RESTAPIEndpoint}
            graphQLEndpoint={graphQLEndpoint}
            tokenEndpoint={tokenEndpoint}
            tokenRefreshEndpoint={tokenRefreshEndpoint}
            adminEndpoint={adminEndpoint}
          />
        </div>
      </BrowserRouter>
    )
  }
}
