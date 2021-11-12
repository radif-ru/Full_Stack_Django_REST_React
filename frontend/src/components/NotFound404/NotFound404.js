import React, {PureComponent} from 'react';

import './NotFound404.css'

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
