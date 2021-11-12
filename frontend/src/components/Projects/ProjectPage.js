import {Link, useParams} from "react-router-dom";
import dateFormat from "dateformat";



export const ProjectPage = (props) => {

  const {id} = useParams();
  let {projects, users, todos} = props
  let project = projects.filter((project) => project.id.toString() === id)
  const noData = 'нет данных!'

  return (
    <div className='project'>
      {project.map((data, idx) => <div key={idx}>
        <p>Id: <span className='project-data'>{data.id}</span></p>
        <p>Имя: <span className='project-data'>{data.name || noData}</span></p>
        <p>Репозиторий: <span className='project-data'>
          <a href={data.repository} target='_blank' rel='noreferrer'>
            {data.repository || noData}
          </a></span></p>

        <p>Работают с проектом: <span className='project-data'>
          {data.users.map((user, idx) => <span key={idx}>
            <Link to={`/users/${user}`}>
              {users.filter((user_data) => user_data.id === user)[0].username}
            </Link>
          , </span>)}
        </span></p>

        <p>Заметки к проекту: <span className='project-data'><br/>
          {todos.filter((todo) => todo.project === data.id).map((todo, idx) =>
            <span key={idx}>
              <span><span className='comment'>{todo.text}</span> от пользователя </span>
              <Link to={`/users/${todo.user}`}>
                {users.filter((user) => user.id === todo.user)[0].username}
              </Link><span>. </span>
              <span>Оставлен: <span
                className='datetime'>{dateFormat(todo.created, 'dddd, mmmm dS, yyyy, h:MM:ss TT')}, </span> </span>
              <span>обновлен: <span className='datetime'>{dateFormat(todo.updated, 'dddd, mmmm dS, yyyy, h:MM:ss TT')}</span> </span><br/>
            </span>)}


            </span></p>
      </div>)}
    </div>
  )
}
