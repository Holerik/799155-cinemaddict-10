// movie-controller.js

import FilmCardComponent from '../components/film-card.js';
import {renderElement, RenderPosition, remove, replace} from '../utils.js';
import FilmPopupComponent from '../components/film-popup.js';
import {Model} from '../data.js';

export const Mode = {
  ADDING: `adding`,
  POPUP: `popup`,
  DEFAULT: `default`
};

export default class MovieController {
  constructor(container, footer, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._popupComponent = null;
    this._filmComponent = null;
    this._footer = footer;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._mode = Mode.DEFAULT;
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
  }

  _replacePopupToFilmcard() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._popupComponent.getElement().querySelector(`.film-details__close-btn`).
    removeEventListener(`click`, this._closeButtonClickHandler);
    if (document.contains(this._popupComponent.getElement())) {
      replace(this._filmComponent, this._popupComponent);
    }
    this._mode = Mode.DEFAULT;
  }

  _replaceFilmcardToPopup() {
    this._viewChangeHandler();
    replace(this._popupComponent, this._filmComponent);
    this._mode = Mode.POPUP;
  }


  _escKeyDownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._replacePopupToFilmcard();
    }
  }

  _closeButtonClickHandler() {
    this._replacePopupToFilmcard();
  }

  get mode() {
    return this._mode;
  }

  render(film, mode) {
    const oldFilmComponent = this._filmComponent;
    const oldPopupComponent = this._popupComponent;
    this._filmComponent = new FilmCardComponent(film);
    this._popupComponent = new FilmPopupComponent(film);
    this._mode = mode;

    switch (mode) {
      case Mode.DEFAULT:
        if (oldFilmComponent && oldPopupComponent) {
          replace(this._filmComponent, oldFilmComponent);
          replace(this._popupComponent, oldPopupComponent);
          this._replacePopupToFilmcard();
        } else {
          renderElement(this._container, this._filmComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.POPUP:
        if (oldPopupComponent) {
          replace(this._popupComponent, oldPopupComponent);
        }
        break;
      case Mode.ADDING:
        break;
    }

    const renderPopupClickHandle = () => {
      this._replaceFilmcardToPopup();
      document.addEventListener(`keydown`, this._escKeyDownHandler);
      this._popupComponent.getElement().querySelector(`.film-details__close-btn`).
      addEventListener(`click`, this._closeButtonClickHandler);
    };

    const poster = this._filmComponent.getElement().querySelector(`.film-card__poster`);
    poster.addEventListener(`click`, renderPopupClickHandle);

    const comments = this._filmComponent.getElement().querySelector(`.film-card__comments`);
    comments.addEventListener(`click`, renderPopupClickHandle);

    const title = this._filmComponent.getElement().querySelector(`.film-card__title`);
    title.addEventListener(`click`, renderPopupClickHandle);


    const setFavorite = () => {
      const newFilm = Model.clone(film);
      newFilm.isFavorite = !film.isFavorite;
      this._dataChangeHandler(this, film, newFilm);
    };

    this._filmComponent.setAddToFavoritesClickHandler(() => {
      setFavorite();
    });

    this._popupComponent.setAddToFavoritesClickHandler(() => {
      setFavorite();
    });

    const addToWatchList = () => {
      const newFilm = Model.clone(film);
      newFilm.inWatchList = !film.inWatchList;
      this._dataChangeHandler(this, film, newFilm);
    };

    this._filmComponent.setAddToWatchlistClickHandler(() => {
      addToWatchList();
    });

    this._popupComponent.setAddToWatchlistClickHandler(() => {
      addToWatchList();
    });

    const setWatched = () => {
      const newFilm = Model.clone(film);
      newFilm.isWatched = !film.isWatched;
      this._dataChangeHandler(this, film, newFilm);
      this._popupComponent.rerender();
    };

    this._filmComponent.setAlreadyWatchedClickHandler(() => {
      setWatched();
    });

    this._popupComponent.setAlreadyWatchedClickHandler(() => {
      setWatched();
    });
  }

  destroy() {
    remove(this._filmComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replacePopupToFilmcard();
    }
  }
}
