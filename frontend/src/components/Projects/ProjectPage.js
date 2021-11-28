import {Link, useParams} from "react-router-dom";
import dateFormat from "dateformat";
import {TodoForm} from "../Todos/TodoForm";


export const ProjectPage = (props) => {

  let {id} = useParams();
  id = +id;
  const {users, isAuthenticated, login, createTodo} = props;

  // Проекты, отфильтрованные по id
  const projectData = users.map(user => user.userProjects)
    .map(projects => projects.filter(project => project.id === id)[0])
    .filter(el => el)[0];
  const project = !!projectData ? projectData : {id: 0, users: []};

  // Заметки проекта всех пользователей
  let todos = users.map(user => user.userTodos)
    .map(todos => todos.filter(todo => todo.project === id))
    .filter(el => el[0]);

  // Разворот массивов внутри массива
  if (todos.length) {
    todos = todos.reduce((arr1, arr2) => [...arr1, ...arr2], ...[]);
  }


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

        {/*У авторизованных пользователей есть возможность создавать заметки
        к проектам*/}
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
        {todos.map((todo, idx) =>
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
                  : ''
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
