import {Link} from 'react-router-dom';


export const ProjectItem = (props) => {

  const {user, users} = props
  const user_projects = user.userProjects

  return (
    user_projects.map((project, idx) => <tr key={idx}>
      <td>
        <Link to={`/projects/${project.id}`}>{project.name}</Link>
      </td>
      <td>
        <a target='_blank' rel='noreferrer' href={project.repository}>
          {project.repository}
        </a>
      </td>
      <td>
        {project.users.map((user, idx) => <span key={idx}>
          <Link to={`/users/${user}`}>
            {users.filter(data => data.id === user)[0].username}
          </Link><br/>
        </span>)}
      </td>
    </tr>)
  )
}
