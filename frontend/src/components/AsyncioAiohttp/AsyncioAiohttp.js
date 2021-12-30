import "./AsyncioAiohttp.css"

import React, {PureComponent} from "react";
import axios from "axios";


/**
 * Работа с Рыба-текстами, асинхронно сформированными на сервере
 */
export class AsyncioAiohttp extends PureComponent {
  /**
   * Конструктор компонента. Назначение начальных состояний
   * @param props свойства унаследованные от вышестоящего компонента
   */
  constructor(props) {
    super(props);
    this.state = {
      "asyncFishTodos": [],
    }
  }

  componentDidMount() {
    const {
      domain, asyncioAiohttpEndpoint, limit, offset
    } = this.props;

    this.getAsyncFishTodos(domain, asyncioAiohttpEndpoint, limit, offset)
  }

  /**
   * Асинхронный запрос данных из Django REST, извлечение и обработка
   * @param domain {string} Домен
   * @param endpoint {string} Конечная точка
   * @const headers {object} Заголовки
   * @param limit {number} Лимит на количество полученных данных
   * @param offset {number} Смещение относительно первого объекта
   * @returns {Promise<void>}
   */
  async getAsyncFishTodos(
    domain = "http://localhost:3333",
    endpoint,
    limit = 100,
    offset = 0
  ) {

    const {getHeaders, handleErrors} = this.props

    const headers = getHeaders();
    await axios.get(
      `${domain}${endpoint}?limit=${limit}&offset=${offset}/`,
      {headers}).then(response => {
      const data = response.data;
      this.setState({"asyncFishTodos": data})
    })
      .catch((error) => {
        handleErrors(error, "getAsyncFishTodos");
      })
  }


  render() {

    const {asyncFishTodos} = this.state

    return (
      <div>
        <h3 className="asyncio-title">Асинхронное получение сгенерированных
          Рыба-текстов. Используются библиотеки AsyncIO и Aiohttp.
          На сервере выполняется множество асинхронных запросов
          (отдельно за каждым абзацем),
          сюда приходит готовый массив данных. Данные всегда разные.
        </h3>
        {asyncFishTodos && asyncFishTodos.map((asyncFish, idx) =>
          <p key={idx}>
            <span className="asyncio-id">ID {asyncFish.id}</span><br/>
            <span className="asyncio-text">{asyncFish.text}</span>
          </p>
        )}
      </div>
    )
  }
}
