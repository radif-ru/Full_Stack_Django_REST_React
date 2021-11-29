import {PureComponent} from "react";

import {ProjectItem} from "./ProjectItem";

/**
 * Формирование заголовков таблицы и данных для заполнения ячеек
 */
export class ProjectsList extends PureComponent {

  render() {
    const {projects, users} = this.props

    return (
      <div>
        <h3>Projects</h3>
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
          </tr>
          </thead>
          <tbody>
          {projects.map((project, idx) =>
            <ProjectItem key={idx} project={project} users={users}/>
          )}
          </tbody>
        </table>
      </div>
    )
  }
}