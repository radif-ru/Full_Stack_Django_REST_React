import "./Projects.css"

import {PureComponent} from "react";
import {Link} from "react-router-dom";

import dateFormat from "dateformat";

/**
 * Компонент данных проекта
 */
export class ProjectData extends PureComponent {

  render() {

    const {project, users, login, isAuthenticated, deleteProject} = this.props
    const user = users.find(user => user.username === login);

    const noData = "нет данных!";

    return (
      <div className="project-data-set">
        <p>
          <span>Имя: </span>
          <span
            className="project-data">{
            <Link to={`/projects/${project.id}`}>
              {project.name || noData}
            </Link>
          }
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
        {isAuthenticated() && project.users
          .find(el => el === user.id) &&
        <div className="btn btn-outline-danger">
          <div onClick={() => deleteProject(project.id)}>Удалить!</div>
        </div>
        }
        <hr/>
      </div>
    )
  }
}