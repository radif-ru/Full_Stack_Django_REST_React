import {Link} from 'react-router-dom';


export const ProjectItem = (props) => {

  const {project, users} = props

  return (
    <tr>
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
            {users.filter((user_data) => user_data.id === user)[0].username}
          </Link><br/>
        </span>)}
      </td>
    </tr>
  )
}
