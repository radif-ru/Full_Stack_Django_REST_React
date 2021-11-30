import "./Users.css"

import {useParams} from "react-router-dom";

import {TodosData} from "../Todos/TodosData";
import {TodoForm} from "../Todos/TodoForm";
import {ProjectData} from "../Projects/ProjectData";
import {ProjectForm} from "../Projects/ProjectForm";
import {UserData} from "./UserData";


/**
 * Личный кабинет пользователя
 * @param props {object} Свойства переданные родителем
 * @returns {JSX.Element}
 * @constructor
 */
export const UserPage = (props) => {
  let {id} = useParams();
  id = +id;
  const {
    users, projects, todos, isAuthenticated, login, createTodo, createProject,
    deleteTodo, deleteProject
  } = props;
  const user = users.find((user) => user.id === id);

  const user_todos = todos.filter(todo => todo.user === id);

  const user_projects = projects.filter(
    project => project.users.find(proj_user => proj_user === id)
  );

  return (
    <div>
      {user
        ? <div className="user">

          <UserData user={user}/>

          {isAuthenticated() && user.username === login
            ? <h4 className="user-create-title">Создать:
              <span> </span>
              <a href="#project">Проект</a>
              <span> </span>
              <a href="#todo">Заметку</a>
            </h4>
            : null
          }

          <div id="project">
            <br/>
          </div>

          {isAuthenticated() && user.username === login
            ? <ProjectForm
              users={users}
              projects={projects}
              login={login}
              createProject={createProject}
            />
            : null
          }

          <h3 className="user-title">Проекты пользователя: </h3>

          {user_projects.map((project, idx) =>
            <ProjectData
              key={idx}
              project={project}
              users={users}
              isAuthenticated={isAuthenticated}
              login={login}
              deleteProject={deleteProject}
            />
          )}

          <div id="todo">
            <br/>
          </div>

          {isAuthenticated() && user.username === login
            ? <TodoForm
              users={users}
              projects={projects}
              login={login}
              createTodo={createTodo}
            />
            : null
          }

          <h3 className="user-title">Заметки пользователя: </h3><br/>

          <TodosData
            todos={user_todos}
            users={users}
            projects={projects}
            login={login}
            isAuthenticated={isAuthenticated}
            deleteTodo={deleteTodo}
          />

        </div>

        : null
      }
    </div>
  )
}
