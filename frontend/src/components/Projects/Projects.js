import React, {PureComponent} from 'react';
import axios from "axios";

import './Projects.css'

import {ProjectsList} from "./ProjectsList";


export class Projects extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      'projects': [],
    }
  }

  componentDidMount() {
    axios
      .get('http://localhost:3333/api/projects/')
      .then(response => {
        const projects = response.data;
        this.setState(
          {
            'projects': projects.results
          }
        );
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <ProjectsList projects={this.state.projects}/>
    )
  }
}
