import {PureComponent} from "react";

import {ProjectItem} from "./ProjectItem";


export class ProjectsList extends PureComponent {
  render() {
    const {projects, users} = this.props

    return (
      <div>
        <h3>Projects</h3>
        <table className='table'>
          <thead>
          <tr>
            <th>
              Name
            </th>
            <th>
              Repository
            </th>
            <th>
              Users
            </th>
          </tr>
          </thead>
          <tbody>
          {projects.map((project, idx) =>
            <ProjectItem key={idx} project={project} users={users}/>)}
          </tbody>
        </table>
      </div>
    )
  }
}