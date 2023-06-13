import {Link} from "react-router-dom";


/**
 * Заполнение ячеек проектов, формирование авторов для каждого проекта
 * @param props {object} - Данные, переданные родителем
 * @returns {JSX.Element}
 * @constructor
 */
export const ProjectItem = (props) => {

  const {project, users, deleteProject, isAuthenticated, login, admin} = props;
  const user = users.find(user => user.username === login);

  return (
    <tr>
      <td>
        <Link to={`/projects/${project.id}`}>{project.name}</Link>
      </td>
      <td>
        <a target="_blank" rel="noreferrer" href={project.repository}>
          {project.repository}
        </a>
      </td>
      <td>
        {project.users.map((userId, idx) => <span key={idx}>
          <Link to={`/users/${userId}`}>
            {users.find(user => user.id === userId).username}
          </Link><br/>
        </span>)}
      </td>
      {isAuthenticated() && (project.users.find(el => el === user.id) || admin) &&
      <td className="btn btn-outline-danger">
        <div onClick={() => deleteProject(project.id)}>Del</div>
      </td>
      }
    </tr>
  )
}
