import "./UploadImages.css"

import {PureComponent} from "react";
import {UploadImageForm} from "./UploadImageForm";


/**
 * Обработка и рендеринг данных изображения, форм
 */
export class UploadImageData extends PureComponent {
  /**
   * Изначально состояние видимости выключено
   * @param props.visible {Boolean}
   */
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      visibleResize: false
    }
  }

  /**
   * Переключатель видимого и невидимого состояния элементов
   */
  toggleDetails = () => {
    const newToggleState = !this.state.visible;
    this.setState({visible: newToggleState});
  }

  /**
   * Переключатель видимого и невидимого состояния конвертера изображения
   */
  toggleDetailsResize = () => {
    const newToggleState = !this.state.visibleResize;
    this.setState({visibleResize: newToggleState});
  }

  render() {

    const {
      uploadImages, uploadImage, isAuthenticated, deleteUploadImage, editImage,
      resizeImage
    } = this.props;
    const parentPictureObj = uploadImages
      .find(image => image.id === uploadImage.parentPicture);
    const parentPictureUrl = parentPictureObj && parentPictureObj.picture;
    const {visible, visibleResize} = this.state;

    return (
      <div>
        <div className="images-name">Имя: {uploadImage.name}</div>
        <div className="images-el">
          Загружена из {(uploadImage.url &&
          <a href={uploadImage.url} target="_blank" rel="noreferrer">
            {uploadImage.url}
          </a>) || "устройства"}
        </div>
        {uploadImage.parentPicture && <div className="images-parrent">
          Разрешение картинки изменено! Родительское изображение:
          <span> </span>
          {<a
            href={parentPictureUrl}
            target="_blank"
            rel="noreferrer"
          >
            {parentPictureUrl}
          </a>}
        </div>}

        {isAuthenticated() && <div>
            <span
              onClick={this.toggleDetailsResize}
              className="btn btn-outline-secondary"
            >
          {visibleResize ? "Отменить" : "Конвертер - изменить разрешение"}
            </span>
          {visibleResize &&
          <div>
            Создать изображение с новым разрешением:
            <UploadImageForm
              uploadImage={uploadImage}
              toggleDetailsResize={() => this.toggleDetailsResize()}
              uploadImages={uploadImages}
              resizeImage={resizeImage}
            />
          </div>
          }
        </div>
        }

        {isAuthenticated() && <div>
            <span
              onClick={this.toggleDetails}
              className="btn btn-outline-secondary"
            >
          {visible ? "Отменить" : "Изменить данные"}
            </span>
          {visible &&
          <div>
            Отредактировать поля:
            <UploadImageForm
              uploadImage={uploadImage}
              toggleDetails={() => this.toggleDetails()}
              uploadImages={uploadImages}
              editImage={editImage}
            />
          </div>
          }
        </div>
        }

        {isAuthenticated() && <div
          className="btn btn-outline-danger"
          onClick={() => deleteUploadImage(uploadImage.id)}
        >
          Удалить!
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
    )
  }
}
