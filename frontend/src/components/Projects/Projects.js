import "./Projects.css"

import React, {PureComponent} from "react";

import {ProjectsList} from "./ProjectsList";


/**
 * Работа с проектами
 */
export class Projects extends PureComponent {

  render() {

    const {users, projects} = this.props

    return (
      <ProjectsList users={users} projects={projects}/>
    )
  }
}
