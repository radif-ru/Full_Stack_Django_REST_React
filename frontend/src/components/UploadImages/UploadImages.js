import "./UploadImages.css"

import {PureComponent} from "react";
import axios from "axios";
import {UploadImageData} from "./UploadImageData";
import {UploadImageForm} from "./UploadImageForm";


/**
 * Работа с изображениями, загрузка на сервер, получение из сервера, удаление,
 * изменение имени, создание с новым разрешением - доступно авторизованным!
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
    this.getUploadImages();
  }

  /**
   * Асинхронный запрос данных из Django REST, извлечение и обработка
   * @const domain {string} Домен
   * @const uploadImagesEndpoint {string} Конечная точка
   * @const headers {object} Заголовки
   * @const limit {number} Лимит на количество полученных данных
   * @const offset {number} Смещение относительно первого объекта
   * @returns {Promise<void>}
   */
  async getUploadImages() {

    const {
      getHeaders, handleErrors, domain, uploadImagesEndpoint, limit, offset
    } = this.props;

    const headers = getHeaders();
    await axios.get(
      `${domain}${uploadImagesEndpoint}?limit=${limit}&offset=${offset}/`,
      {headers}).then(response => {
      const data = response.data.results;
      this.setState({"uploadImages": data});
    })
      .catch((error) => {
        handleErrors(error, "getUploadImages");
      })
  }

  /**
   * Загрузка нового изображения
   * @param data {Object} Объект данных изображения
   * @returns {Promise<void>}
   */
  async createImage(data) {
    await this.createImageDataREST(data);
  }

  /**
   * POST запрос в Django REST на создание данных
   * В случае удачной операции перезагружаю данные с
   * сервера для избежания артефактов, рассинхрона с актуальными данными...
   * В других методах (удаления, изменения) происходит перерисовка данных,
   * без повторной загрузки из БД
   * @param data {object} Отправляемые данные
   * @const domain {string} Домен
   * @const endpoint {string} Конечная точка
   * @const headers {object} Заголовки
   */
  createImageDataREST(data) {
    const {
      domain, uploadImagesEndpoint, handleErrors, getHeaders
    } = this.props;
    let headers = getHeaders();
    // multipart/form-data - использую для отправки формы с файлом
    headers["Content-Type"] = "multipart/form-data";
    axios.post(`${domain}${uploadImagesEndpoint}`, data, {headers})
      .then(response => {
        this.getUploadImages();
      })
      .catch(error => {
          handleErrors(error, "createImageDataREST");
        }
      )
  }

  /**
   * Конвертер изображения - изменение разрешения и сохранение в новый файл
   * @param data {Object} Объект данных изображения
   * @param id {number} Идентификатор
   * @returns {Promise<void>}
   */
  async resizeImage(data, id) {
    await this.resizeImageDataREST(data, id);
  }

  /**
   * POST запрос в Django REST на создание данных
   * В случае удачной операции перезагружаю данные с
   * сервера для избежания артефактов, рассинхрона с актуальными данными...
   * В других методах (удаления, изменения) происходит перерисовка данных,
   * без повторной загрузки из БД
   * @param data {object} Отправляемые данные
   * @param id {number} Идентификатор
   * @const domain {string} Домен
   * @const endpoint {string} Конечная точка
   * @const headers {object} Заголовки
   */
  resizeImageDataREST(data, id) {
    const {
      domain, uploadImagesEndpoint, handleErrors, getHeaders,
      imageResizeEndpoint
    } = this.props;
    let headers = getHeaders();
    headers["Content-Type"] = "multipart/form-data";
    axios.post(
      `${domain}${uploadImagesEndpoint}${id}${imageResizeEndpoint}`,
      data,
      {headers})
      .then(response => {
        this.getUploadImages();
      })
      .catch(error => {
          handleErrors(error, "resizeImageDataREST");
        }
      )
  }

  /**
   * Удаление изображения из состояния. Отфильтрованная перерисовка данных.
   * Вызов удаления из сервера.
   * @param id {number} Идентификатор изображения
   * @returns {Promise<void>}
   */
  async deleteUploadImage(id) {
    const {uploadImages} = this.state;
    this.setState({
        "uploadImages": uploadImages.filter(image => image.id !== id),
      },
      () => this.deleteUploadImageDataREST(id)
    )
  }

  /**
   * Удаление загруженного изображения с помощью Django REST.
   * Данные перезагружаются только в случае ошибки.
   * @param id {number} Идентификатор удаляемых данных
   * @const headers {object} Заголовки
   */
  deleteUploadImageDataREST(id) {
    const {
      getHeaders, handleErrors, domain, uploadImagesEndpoint
    } = this.props;

    const headers = getHeaders();
    axios.delete(`${domain}${uploadImagesEndpoint}${id}`, {headers})
      .then(response => {
      })
      .catch(error => {
          handleErrors(error, "deleteUploadImage");
          this.getUploadImages();
        }
      )
  }

  /**
   * Редактирование изображения. Обновление состояния актуальными данными без
   * перезагрузки данных из БД.
   * @param data {Object} Объект с данными изображения
   * @param id {number} Идентификатор изображения
   * @returns {Promise<void>}
   */
  async editImage(data, id) {
    const {uploadImages} = this.state;
    const newImage = uploadImages.find(uploadImage => uploadImage.id === id);
    // Обновляю изображение новыми данными, если есть
    Object.keys(data).map((objectKey, index) =>
      newImage[objectKey] = data[objectKey]
    );
    await this.setState(
      {
        "uploadImages": uploadImages.map(uploadImage =>
          // Замена обновлённых данных и даты обновления с помощью фичи ES6
          uploadImage.id === id
            ? {...uploadImage, ...newImage}
            : uploadImage
        )
      },
      // Отправляю в БД только те данные, которые нужно изменить
      () => this.editImageDataREST(data, id)
    )
  }

  /**
   * Редактирование данных с помощью Django REST. Patch запрос.
   * Данные перезагружаются только в случае ошибки.
   * Перерисовка происходит через метод, вызвавший этот метод.
   * @param data {Object} Объект данных
   * @param id {number} Идентификатор изменяемых данных
   */
  editImageDataREST(data, id) {
    const {
      getHeaders, handleErrors, domain, uploadImagesEndpoint
    } = this.props;

    const headers = getHeaders();
    axios.patch(`${domain}${uploadImagesEndpoint}${id}/`, data, {headers})
      .then(response => {
      })
      .catch(error => {
          handleErrors(error, "editImageDataREST");
          this.getUploadImages();
        }
      )
  }


  render() {

    const {uploadImages} = this.state;
    const {isAuthenticated} = this.props;

    return (
      <div>
        <h3 className="images-title">
          Работа с изображениями, загрузка на сервер, получение из сервера,
          удаление, изменение имени, создание с новым разрешением - доступно
          авторизованным!
        </h3>

        {isAuthenticated() &&
        <div>
          <h3>Загрузить изображение (из устройства или внешнего источника)</h3>
          <UploadImageForm createImage={(data) => this.createImage(data)}/>
        </div>
        }

        {uploadImages && uploadImages.map((uploadImage, idx) =>
          <UploadImageData
            key={idx}
            uploadImages={uploadImages}
            uploadImage={uploadImage}
            isAuthenticated={isAuthenticated}
            deleteUploadImage={(id) => this.deleteUploadImage(id)}
            editImage={(data, id) => this.editImage(data, id)}
            resizeImage={(data, id) => this.resizeImage(data, id)}
          />
        )}
      </div>
    )
  }
}
