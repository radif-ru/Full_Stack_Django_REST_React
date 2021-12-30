import "./UploadImages.css"

import React, {PureComponent} from "react";
import axios from "axios";


/**
 * Работа с изображениями, загрузка на сервер, получение из сервера, удаление
 */
export class UploadImages extends PureComponent {
  /**
   * Конструктор компонента. Назначение начальных состояний
   * @param props свойства унаследованные от вышестоящего компонента
   */
  constructor(props) {
    super(props);
    this.state = {
      "uploadImages": [],
    }
  }

  componentDidMount() {
    const {
      domain, uploadImagesEndpoint, limit, offset
    } = this.props;

    this.getUploadImages(domain, uploadImagesEndpoint, limit, offset)
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
  async getUploadImages(
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
      const data = response.data.results;
      this.setState({"uploadImages": data})
    })
      .catch((error) => {
        handleErrors(error, "getUploadImages");
      })
  }


  render() {

    const {uploadImages} = this.state

    return (
      <div>
        <h3 className="images-title">
          Работа с изображениями, загрузка на сервер, получение из сервера,
          удаление
        </h3>
        {uploadImages && uploadImages.map((uploadImage, idx) =>
          <div key={idx}>
            <div className="images-name">Имя: {uploadImage.name}</div>
            <div className="images-el">
              Загружена из {(uploadImage.url &&
              <a href={uploadImage.url} target="_blank" rel="noreferrer">
                {uploadImage.url}</a>) || "устройства"}
            </div>
            {uploadImage.parentPicture && <div className="images-parrent">
              Разрешение картинки изменено! Родительское изображение:
              <span> </span>
              {<a
                href={uploadImages
                  .find(image => image.id === uploadImage.parentPicture).url}
                target="_blank"
                rel="noreferrer">
                {uploadImages
                  .find(image => image.id === uploadImage.parentPicture).url}
              </a>}
            </div>}
            <div className="images-el">
              Ширина: {uploadImage.width} | Высота: {uploadImage.height}
            </div>
            <div className="images-el">
              <a href={uploadImage.picture} target="_blank" rel="noreferrer">
                <img className="images-img"
                  src={uploadImage.picture}
                  alt={uploadImage.name}
                />
              </a>
            </div>
            <br/>
          </div>
        )}
      </div>
    )
  }
}
