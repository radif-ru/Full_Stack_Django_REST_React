import "./UploadImages.css"

import {PureComponent} from "react";


/**
 * Универсальная(ые) форма(ы) загрузки и изменения изображения
 */
export class UploadImageForm extends PureComponent {
  /**
   * Прокидывание свойств (props) от родителя, начальные состояния
   * @param props {object} Данные, переданные родителем
   */
  constructor(props) {
    super(props);
    this.state = {
      // Для загрузки изображения и изменения данных
      "file": "",
      "url": this.props.uploadImage ? this.props.uploadImage.url : "",
      "name": this.props.uploadImage ? this.props.uploadImage.name : "",
      // Для конвертера - создания изображения с изменённым разрешением
      "height": this.props.uploadImage ? this.props.uploadImage.height : "",
      "width": this.props.uploadImage ? this.props.uploadImage.width : ""
    }
  }

  /**
   * Присваивание состояний на основе события изменения поля ввода формы
   *
   * @param event {object} Событие, оттуда извлекаются данные проекта
   */
  handleChange(event) {
    const {name, value} = event.target;

    // Изображение
    if (event.target.files) {
      this.setState({
        "file": event.target.files[0]
      });
      return
    }

    this.setState({
      [name]: value
    });
  }

  /**
   * Обработка и отправка данных формы на сервер
   * @param event {object} Используется только для остановки события
   */
  handleSubmit(event) {
    const {file, url, name, height, width} = this.state;
    const {
      toggleDetails, editImage, uploadImage, createImage, resizeImage,
      toggleDetailsResize
    } = this.props;

    if (resizeImage) {
      if (!height && !width) {
        alert("Необходимо указать ширину или высоту")
      }
      let data = new FormData();
      data.append("height", height)
      data.append("width", width)
      resizeImage(data, uploadImage.id);
      toggleDetailsResize();
      event.preventDefault();
      return
    }

    if (editImage) {
      const data = {"name": name}
      editImage(data, uploadImage.id);
      toggleDetails();
      event.preventDefault();
      return
    }

    if (file && url) {
      alert("Загружать можно только из 1 источника - из устройства или извне");
      this.setState({
        "file": "",
        "url": "",
      });
      event.preventDefault();
      return
    }

    if (!file && !url) {
      alert("Необходимо выбрать загружаемый файл или указать url-адрес");
      event.preventDefault();
      return
    }

    // FormData - использую для отправки формы с файлом
    let data = new FormData();
    if (file) {
      data.append("file", file, file.name)
    }
    data.append("url", url)
    data.append("name", name)

    createImage(data);
    this.setState({
      "file": "",
      "url": "",
      "name": "",
    });
    event.preventDefault();
  }

  /**
   * Отображение формы. В качестве соавторов можно выбрать всех, кроме себя
   * @returns {JSX.Element}
   */
  render() {
    const {name, url, height, width} = this.state;
    const {editImage, createImage, resizeImage} = this.props;

    return (
      <form
        onSubmit={(event => this.handleSubmit(event))}
        className="row todo-form"
      >
        {createImage && <div className="col-4">
          <input
            type="file"
            name="file"
            accept="image/*"
            placeholder="выбрать изображение"
            aria-describedby="textHelpFileInline"
            className="form-control"
            onChange={(event => this.handleChange(event))}
          />
          <span id="textHelpFileInline" className="form-text">
            Выберите изображение из Вашего устройства
          </span>
        </div>}

        {createImage && <div className="col-3">
          <input
            type="url"
            name="url"
            maxLength="99"
            placeholder="url-адрес изображения"
            aria-describedby="textHelpUrlInline"
            value={url}
            className="form-control"
            onChange={(event => this.handleChange(event))}
          />
          <span id="textHelpUrlInline" className="form-text">
            Введите url-адрес изображения из внешнего источника
          </span>
        </div>}

        {resizeImage && <div className="col-3">
          <input
            type="number"
            name="width"
            max="10240"
            min="12"
            placeholder="ширина изображения"
            aria-describedby="textHelpWidthInline"
            value={width}
            className="form-control"
            onChange={(event => this.handleChange(event))}
          />
          <span id="textHelpWidthInline" className="form-text">
            Укажите новую ширину изображения
          </span>
        </div>}

        {resizeImage && <div className="col-3">
          <input
            type="number"
            name="height"
            max="10240"
            min="12"
            placeholder="высота изображения"
            aria-describedby="textHelpHeightInline"
            value={height}
            className="form-control"
            onChange={(event => this.handleChange(event))}
          />
          <span id="textHelpHeightInline" className="form-text">
            Укажите новую высоту изображения
          </span>
        </div>}

        {(editImage || createImage) && <div className="col-3">
          <input
            type="text"
            name="name"
            maxLength="33"
            placeholder="Имя изображения"
            aria-describedby="textHelpNameInline"
            value={name}
            className="form-control"
            onChange={(event => this.handleChange(event))}
          />
          <span id="textHelpNameInline" className="form-text">
            Можно не указывать
          </span>
        </div>}

        <input
          type="submit"
          value="Сохранить"
          className="auth-btn btn btn-primary col-2"
        />
      </form>
    )
  }
}
