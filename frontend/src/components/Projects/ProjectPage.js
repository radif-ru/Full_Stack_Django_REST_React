import "./Projects.css"

import {useParams} from "react-router-dom";
import {TodoForm} from "../Todos/TodoForm";
import {TodosData} from "../Todos/TodosData";
import {ProjectData} from "./ProjectData";


/**
 * Страница проекта. Формирование данных проекта и заполнение
 * У авторизованных пользователей есть возможность создавать заметки к
 * проектам, редактировать, удалить проект со всеми заметками, если он автор
 * @param props {object} Данные, переданные родителем
 * @returns {JSX.Element}
 * @constructor
 */
export const ProjectPage = (props) => {

  let {id} = useParams();
  id = +id;
  const {
    users, projects, todos, isAuthenticated, login, createTodo, deleteTodo,
    deleteProject, editTodo
  } = props;

  const project = projects.find(project => project.id === id);

  const project_todos = todos.filter(todo => todo.project === id)

  return (
    <div className="project-page">
      {project &&
      <div>

        <ProjectData
          project={project}
          users={users}
          isAuthenticated={isAuthenticated}
          login={login}
          deleteProject={deleteProject}
        />

        {isAuthenticated() &&
          <div>
            <h3>Создать заметку</h3>
            <TodoForm
              projectId={id}
              users={users}
              login={login}
              createTodo={createTodo}
              todos={todos}
            />
          </div>

        }

        <h3>Заметки к проекту: </h3><br/>
        <TodosData
          todos={project_todos}
          users={users}
          projects={projects}
          login={login}
          isAuthenticated={isAuthenticated}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
        />

      </div>
      }
    </div>
  )
}
