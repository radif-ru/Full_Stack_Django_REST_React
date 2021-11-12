import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";

import './assets/global.css';

import reportWebVitals from './reportWebVitals';
import {Header} from "./components/Header";
import {Users} from "./components/Users";
import {Projects} from "./components/Projects";
import {Todos} from "./components/Todos";
import {NotFound404} from "./components/NotFound404";
import {Footer} from "./components/Footer";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Header/>
      <Routes>
        <Route exact path='/users' element={<Users/>}/>
        <Route exact path='/projects' element={<Projects/>}/>
        <Route exact path='/todos' element={<Todos/>}/>
        <Route exact path='/' element={<Navigate to='/users'/>}/>
        <Route path='*' element={<NotFound404/>}/>
      </Routes>
      <Footer/>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
