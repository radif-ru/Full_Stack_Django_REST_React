import {PureComponent} from "react";

import {ProjectItem} from "./ProjectItem";


/**
 * Формирование заголовков таблицы и данных для заполнения ячеек
 */
export class ProjectsList extends PureComponent {

  render() {
    const {
      projects, users, deleteProject, login, isAuthenticated, admin
    } = this.props

    return (
      <div>
        <h3>Проекты</h3>
        <table className="table">
          <thead>
          <tr>
            <th>
              Имя
            </th>
            <th>
              Репозиторий
            </th>
            <th>
              Авторы
            </th>
            {isAuthenticated() && <th> </th>}
          </tr>
          </thead>
          <tbody>
          {projects.map((project, idx) =>
            <ProjectItem
              key={idx}
              project={project}
              users={users}
              login={login}
              isAuthenticated={isAuthenticated}
              deleteProject={deleteProject}
              admin={admin}
            />
          )}
          </tbody>
        </table>
      </div>
    )
  }
}