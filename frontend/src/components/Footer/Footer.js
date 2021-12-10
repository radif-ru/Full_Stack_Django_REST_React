import "./Footer.css"
import logo from "./logo.svg";

import React, {PureComponent} from "react";


/**
 * Формирование нижней части страницы
 */
export class Footer extends PureComponent {

  render() {

    const {
      domain, swaggerEndpoint,
      swaggerJsonEndpoint, swaggerYamlEndpoint, reDocEndpoint, RESTAPIEndpoint,
      graphQLEndpoint, tokenEndpoint, tokenRefreshEndpoint, adminEndpoint
    } = this.props

    return (
      <footer className="footer">
        <div>
          <h5>
            <a className="App-link"
               href={domain}
               target="_blank"
               rel="noopener noreferrer"
            >
              Работа с бэкендом:
            </a>
          </h5>
          <a className="App-link"
             href={`${domain}${swaggerEndpoint}`}
             target="_blank"
             rel="noopener noreferrer"
          >
            Swagger
            <span> / </span>
          </a>
          <a className=" App-link"
             href={`${domain}${reDocEndpoint}`}
             target="_blank"
             rel="noopener noreferrer"
          >
            ReDoc
            <span> / </span>
          </a>
          <a className=" App-link"
             href={`${domain}${RESTAPIEndpoint}`}
             target="_blank"
             rel="noopener noreferrer"
          >
            Django REST API
            <span> / </span>
          </a>
          <a className=" App-link"
             href={`${domain}${graphQLEndpoint}`}
             target="_blank"
             rel="noopener noreferrer"
          >
            GraphiQL
            <span> / </span>
          </a>
          <a className=" App-link"
             href={`${domain}${adminEndpoint}`}
             target="_blank"
             rel="noopener noreferrer"
          >
            Админка
            <span> / </span>
          </a>
          <a className=" App-link"
             href={`${domain}${tokenEndpoint}`}
             target="_blank"
             rel="noopener noreferrer"
          >
            Генерация токена
            <span> / </span>
          </a>
          <a className=" App-link"
             href={`${domain}${tokenRefreshEndpoint}`}
             target="_blank"
             rel="noopener noreferrer"
          >
            Обновить токен
            <span> / </span>
          </a>
          <a className=" App-link"
             href={`${domain}${swaggerJsonEndpoint}`}
             target="_blank"
             rel="noopener noreferrer"
          >
            REST API в Json
            <span> / </span>
          </a>
          <a className=" App-link"
             href={`${domain}${swaggerYamlEndpoint}`}
             target="_blank"
             rel="noopener noreferrer"
          >
            REST API в YAML
            <span> / </span>
          </a>
        </div>
        <a
          className=" App-link"
          href=" https://radif.ru"
          target="_blank"
          rel="noopener noreferrer"
        >
          &copy; 2021 &reg;Radif.ru
        </a>
        <br/>
        <div className="footer-modal">
          <img src={logo} className="App-logo" alt="logo"/>
        </div>
      </footer>
    )
  }
}
