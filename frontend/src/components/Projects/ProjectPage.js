import {Link, useParams} from "react-router-dom";
import dateFormat from "dateformat";


export const ProjectPage = (props) => {

  const {id} = useParams();
  const {projects, todos} = props
  const project = projects.length > 0 ? projects.filter((project) =>
    project.id.toString() === id)[0] : {
    id: 0,
    users: []
  }
  const noData = 'нет данных!'

  return (
    <div className='project-page'>
      <div>
        <p>Id: <span className='project-data'>{project.id}</span></p>
        <p>Имя: <span className='project-data'>{project.name || noData}</span>
        </p>
        <p>Репозиторий: <span className='project-data'>
          <a href={project.repository} target='_blank' rel='noreferrer'>
            {project.repository || noData}</a></span>
        </p>

        <p>Работают с проектом: <span className='project-data'>
          {project.users.map((user, idx) => <span key={idx}>
            <Link to={`/users/${user.id}`}>
              {user.username}
            </Link>, </span>)}</span>
        </p>

        <h3>Заметки к проекту: </h3><br/>
        {todos.filter((todo) => todo.project.id.toString() === id).map((todo, idx) =>
          <div key={idx}>
            <span className='comment'>{todo.text}</span>

            <div className='comment-info'>
              <Link className='comment-user' to={`/users/${todo.user.id}`}>
                {todo.user.username}
              </Link>
              <span className='comment-datetime'>
                {dateFormat(
                  todo.created, 'dddd, mmmm dS, yyyy, h:MM:ss TT'
                )}.
              </span>
              <span className='comment-datetime'>
                {todo.created !== todo.updated ? `Обновлено: ${dateFormat(
                  todo.updated, 'dddd, mmmm dS, yyyy, h:MM:ss TT'
                )}` : ''}
              </span>
            </div>
            <br/>
          </div>)}
      </div>
    </div>
  )
}
