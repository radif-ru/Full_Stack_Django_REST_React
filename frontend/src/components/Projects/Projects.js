import './Projects.css'

import React, {PureComponent} from 'react';

import {ProjectsList} from './ProjectsList';


export class Projects extends PureComponent {

  render() {

    const {projects, users} = this.props

    return (
      <ProjectsList projects={projects} users={users}/>
    )
  }
}
