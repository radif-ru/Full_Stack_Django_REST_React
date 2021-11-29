import {Link} from "react-router-dom";


/**
 * Заполнение ячеек проектов, формирование авторов для каждого проекта
 * @param props {object} - Данные, переданные родителем
 * @returns {JSX.Element}
 * @constructor
 */
export const ProjectItem = (props) => {

  const {project, users} = props;

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
        {project.users.map((user_id, idx) => <span key={idx}>
          <Link to={`/users/${user_id}`}>
            {users.filter(user => user.id === user_id)[0].username}
          </Link><br/>
        </span>)}
      </td>
    </tr>
  )
}
