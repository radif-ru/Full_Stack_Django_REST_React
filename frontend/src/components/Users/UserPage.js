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
    roles, users, projects, todos, isAuthenticated, login, createTodo,
    createProject, deleteTodo, deleteProject, editTodo, admin, editProject
  } = props;
  const user = users.find((user) => user.id === id);

  const user_todos = todos.filter(todo => todo.user === id);

  const user_projects = projects.filter(
    project => project.users.find(proj_user => proj_user === id)
  );

  return (
    <div>
      {user &&
      <div className="user">

        <UserData user={user} roles={roles}/>

        {isAuthenticated() && user.username === login &&
        <h4 className="user-create-title">Создать:
          <span> </span>
          <a href="#project">Проект</a>
          <span> </span>
          <a href="#todo">Заметку</a>
        </h4>
        }

        <div id="project">
          <br/>
          <br/>
        </div>

        {isAuthenticated() && user.username === login &&
        <ProjectForm
          users={users}
          projects={projects}
          login={login}
          createProject={createProject}
        />
        }

        <h3 className="user-title">Проекты пользователя: </h3>
        <br/>

        {user_projects.map((project, idx) =>
          <ProjectData
            key={idx}
            project={project}
            users={users}
            isAuthenticated={isAuthenticated}
            login={login}
            deleteProject={deleteProject}
            admin={admin}
            editProject={editProject}
            projects={projects}
          />
        )}

        <div id="todo">
          <br/>
          <br/>
        </div>

        {isAuthenticated() && user.username === login &&
        <div>
          <h3>Создать заметку</h3>
          <TodoForm
          users={users}
          projects={projects}
          login={login}
          createTodo={createTodo}
          todos={todos}
        />
        </div>
        }

        <h3 className="user-title">Заметки пользователя: </h3>
        <br/>

        <TodosData
          todos={user_todos}
          users={users}
          projects={projects}
          login={login}
          isAuthenticated={isAuthenticated}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
          admin={admin}
        />

      </div>
      }
    </div>
  )
}
