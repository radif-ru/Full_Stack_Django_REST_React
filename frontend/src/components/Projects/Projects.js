import './Projects.css'

import React, {PureComponent} from 'react';

import {ProjectsList} from './ProjectsList';


export class Projects extends PureComponent {

  render() {

    const {projects} = this.props

    return (
      <ProjectsList projects={projects}/>
    )
  }
}
