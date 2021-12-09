/**
 * Корень. Подключение глобальных стилей и скриптов для всего проекта
 */
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/global.css";

import "bootstrap/dist/js/bootstrap.bundle.min";

import React from "react";
import ReactDOM from "react-dom";

import reportWebVitals from "./reportWebVitals";
import {GeneralApp} from "./GeneralApp";


/**
 * Корень развёртывания приложения. Подключение главного компонента
 * к элементу найденному по id root
 */
ReactDOM.render(
  <React.StrictMode>
    <GeneralApp/>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
