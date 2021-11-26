import "./NotFound404.css"

import React, {PureComponent} from "react";


export class NotFound404 extends PureComponent {

  render() {

    return (
      <div>
        <h2>Данная страница недоступна! </h2>
        <p>Неправильный путь: <b>{window.location.href}</b></p>
      </div>
    )
  }
}
