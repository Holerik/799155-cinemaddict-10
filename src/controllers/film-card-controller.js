// film-card-controller.js

export default class FilmCardController {
  constructor(filmComponent, popupComponent) {
    this._filmComponent = filmComponent;
    this._popupComponent = popupComponent;
  }

  destroy() {
    this._filmComponent.getElement().remove();
    this._filmComponent.removeElement();
    this._popupComponent.getElement().remove();
    this._popupComponent.removeElement();
  }
}
