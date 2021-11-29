import {Link, useParams} from "react-router-dom";
import dateFormat from "dateformat";
import {TodoForm} from "../Todos/TodoForm";


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

  // Проекты, отфильтрованные по id
  let project = projects.filter(project => project.id === id)[0];
  project = !!project ? project : {id: 0, users: []};

  // Заметки к этому проекту
  const project_todos = todos.filter(todo => todo.project === id)

  const noData = "нет данных!";

  return (
    <div className="project-page">
      <div>
        <p>Id: <span className="project-data">{project.id}</span></p>
        <p>Имя: <span className="project-data">{project.name || noData}</span>
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
                  {users.filter(data => data.id === user)[0].username}
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
            project_id={id}
            users={users}
            login={login}
            createTodo={createTodo}
          />
          : null
        }

        <h3>Заметки к проекту: </h3><br/>
        {project_todos.map((todo, idx) =>
          <div key={idx}>
            <span className="comment">{todo.text}</span>

            <div className="comment-info">
              <Link className="comment-user" to={`/users/${todo.user}`}>
                {users.filter(user => user.id === todo.user)[0].username}
              </Link>
              <span className="comment-datetime">
                {dateFormat(
                  todo.created, "dddd, mmmm dS, yyyy, h:MM:ss TT"
                )}
                <span>.</span>
              </span>
              <span className="comment-datetime">
                {todo.created !== todo.updated
                  ? `Обновлено: ${dateFormat(
                    todo.updated, "dddd, mmmm dS, yyyy, h:MM:ss TT")}`
                  : ""
                }
              </span>
            </div>
            <br/>
          </div>
        )}
      </div>
    </div>
  )
}
