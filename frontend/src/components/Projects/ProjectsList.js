import {PureComponent} from 'react';

import {ProjectItem} from './ProjectItem';


export class ProjectsList extends PureComponent {

  render() {

    const users = this.props.users.filter(user => !!user.userProjects.length)

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
          {users.map((user, idx) =>
            <ProjectItem key={idx} user={user} users={users}/>)}
          </tbody>
        </table>
      </div>
    )
  }
}