import "./Projects.css"

import {PureComponent} from "react";
import {Link} from "react-router-dom";

import dateFormat from "dateformat";
import {ProjectForm} from "./ProjectForm";

/**
 * Компонент данных проекта
 */
export class ProjectData extends PureComponent {
  /**
   * Изначально состояние видимости включено
   * @param props.visible {Boolean}
   */
  constructor(props) {
    super(props)
    this.state = {
      visible: true
    }
  }

  /**
   * Переключатель видимого и невидимого состояния элементов
   */
  toggleDetails = () => {
    const newToggleState = !this.state.visible
    this.setState({visible: newToggleState})
  }

  render() {

    const {
      project, users, login, isAuthenticated, deleteProject, admin,
      editProject, projects
    } = this.props
    const {visible} = this.state
    const user = users.find(user => user.username === login);

    const noData = "нет данных!";

    return (
      <div className="project-data-set">
        {visible &&
        <div>
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
        </div>
        }

        {isAuthenticated() && (project.users
          .find(el => el === user.id) || admin) &&
        <div>
            <span
              onClick={this.toggleDetails}
              className="btn btn-outline-secondary"
            >
          {!visible ? "Отменить" : "Изменить данные"}
            </span>
          {!visible &&
          <div>
            Отредактировать поля:
            <ProjectForm
              users={users}
              project={project}
              login={login}
              editProject={editProject}
              toggleDetails={() => this.toggleDetails()}
              projects={projects}
            />
          </div>
          }
        </div>
        }

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
        {isAuthenticated() && (project.users
          .find(el => el === user.id) || admin) &&
        <div className="btn btn-outline-danger">
          <div onClick={() => deleteProject(project.id)}>Удалить!</div>
        </div>
        }
        <hr/>
      </div>
    )
  }
}