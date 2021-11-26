import {Link, useParams} from "react-router-dom";
import dateFormat from "dateformat";


export const ProjectPage = (props) => {

  let {id} = useParams();
  id = +id
  const {users} = props

  // Проекты, отфильтрованные по id
  const projectData = users.map(user => user.userProjects)
    .map(projects => projects.filter(project => project.id === id)[0])
    .filter(el => el)[0]
  const project = !!projectData ? projectData : {id: 0, users: []}

  // Заметки проекта
  const todos = users.map(user => user.userTodos).map(
    todos => todos.filter(todo => todo.project === id)).map(
    todo => todo[0]).filter(el => el)

  const noData = "нет данных!"

  return (
    <div className="project-page">
      <div>
        <p>Id: <span className="project-data">{project.id}</span></p>
        <p>Имя: <span className="project-data">{project.name || noData}</span>
        </p>
        <p>Репозиторий: <span className="project-data">
          <a href={project.repository} target="_blank" rel="noreferrer">
            {project.repository || noData}</a></span>
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
