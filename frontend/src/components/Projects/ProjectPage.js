import {Link, useParams} from "react-router-dom";
import dateFormat from "dateformat";
import {TodoForm} from "../Todos/TodoForm";
import {TodosPage} from "../Todos/TodosPage";


/**
 * Страница проекта. Формирование данных проекта и заполнение
 * У авторизованных пользователей есть возможность создавать заметки к проектам
 * @param props {object} Данные, переданные родителем
 * @returns {JSX.Element}
 * @constructor
 */
export const ProjectPage = (props) => {

  let {id} = useParams();
  id = +id;
  const {users, projects, todos, isAuthenticated, login, createTodo} = props;

  // Проект, найденный по id
  const project = projects.find(project => project.id === id);

  // Заметки к этому проекту
  const project_todos = todos.filter(todo => todo.project === id)

  const noData = "нет данных!";

  return (
    <div className="project-page">
      {project
        ? <div>
          <p>
            <span>Id: </span>
            <span className="project-data">{project.id}</span>
          </p>
          <p>
            <span>Имя: </span>
            <span
              className="project-data">{project.name || noData}
            </span>
          </p>
          <p>
            <span>Репозиторий: </span>
            <span className="project-data">
          <a href={project.repository} target="_blank" rel="noreferrer">
            {project.repository || noData}
          </a>
          </span>
          </p>

          <p>
            <span>Работают с проектом: </span>
            <span className="project-data">
            {project.users.map((user, idx) =>
              <span key={idx}>
                <Link to={`/users/${user}`}>
                  {users.find(data => data.id === user).username}
                </Link>
                <span>, </span>
              </span>
            )}
          </span>
          </p>

          <p>
            <span>Проект создан: </span>
            <span className="project-data">
              {dateFormat(
                project.created, "dddd, mmmm dS, yyyy, h:MM:ss TT"
              )}
          </span>
          </p>

          <p>
            <span>Проект обновлён: </span>
            <span className="project-data">
              {project.created !== project.updated
                ? `${dateFormat(
                  project.updated, "dddd, mmmm dS, yyyy, h:MM:ss TT")}`
                : "---"
              }
          </span>
          </p>

          {isAuthenticated()
            ? <TodoForm
              projectId={id}
              users={users}
              login={login}
              createTodo={createTodo}
            />
            : null
          }

          <h3>Заметки к проекту: </h3><br/>
          <TodosPage todos={project_todos} users={users}/>

        </div>

        : null
      }
    </div>
  )
}
