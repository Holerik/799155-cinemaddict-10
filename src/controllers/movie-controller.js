// movie-controller.js

import FilmCardComponent from '../components/film-card.js';
import {renderElement, RenderPosition, remove, replace} from '../utils.js';
import FilmPopupComponent from '../components/film-popup.js';
import {FilmObject as Film, parseFormData, profile} from '../data.js';
import {filmsModel} from '../main.js';

export const Mode = {
  ADDING: `adding`,
  UPDATE: `update`,
  DELETE: `delete`,
  POPUP: `popup`,
  DEFAULT: `default`
};

export default class MovieController {
  constructor(container, footer, dataChangeHandler, viewChangeHandler) {
    this.filmId = undefined;
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
    this.filmId = film.id;
    const oldFilmComponent = this._filmComponent;
    const oldPopupComponent = this._popupComponent;
    this._filmComponent = new FilmCardComponent(film);
    this._popupComponent = new FilmPopupComponent(film);
    this._mode = mode;

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
      const newFilm = Film.clone(film);
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
      const newFilm = Film.clone(film);
      newFilm.inWatchList = !film.inWatchList;
      this._dataChangeHandler(this, film, newFilm);
    };

    this._filmComponent.setAddToWatchlistClickHandler(() => {
      addToWatchList();
    });

    this._popupComponent.setAddToWatchlistClickHandler(() => {
      addToWatchList();
    });

    const removeRating = () => {
      const newFilm = Film.clone(film);
      newFilm.isWatched = !film.isWatched;
      profile.removeRating(film);
      newFilm.personalRating = 0;
      profile.reset(filmsModel);
      this._dataChangeHandler(this, film, newFilm);
    };

    const setRating = (evt) => {
      const rating = evt.target.value;
      this._popupComponent.getElement().querySelector(`.film-details__user-rating`).textContent = `Your rate ${rating}`;
      const newFilm = Film.clone(film);
      newFilm.personalRating = parseInt(rating, 10);
      profile.setRating(film, rating);
      this._dataChangeHandler(this, film, newFilm);
    };

    this._popupComponent.setRatingHandler((evt) => {
      setRating(evt);
    });

    const setWatched = () => {
      const newFilm = Film.clone(film);
      newFilm.isWatched = !film.isWatched;
      if (!film.isWatched) {
        newFilm.watchDate = new Date();
      } else {
        profile.removeRating(film);
        newFilm.personalRating = 0;
      }
      profile.reset(filmsModel);
      this._dataChangeHandler(this, film, newFilm);
    };

    this._filmComponent.setAlreadyWatchedClickHandler(() => {
      setWatched();
    });

    this._popupComponent.setAlreadyWatchedClickHandler(() => {
      setWatched();
    });

    this._popupComponent.setDeleteCommentHandler((evt) => {
      evt.preventDefault();
      const newFilm = Film.clone(film);
      const commentElement = this._popupComponent.getDeletingComment(evt);
      // удаляем comment из newFilm.comments
      // ...
      const index = newFilm.comments.findIndex((comment) => {
        if (commentElement.textContent.indexOf(comment.text) > -1) {
          return true;
        }
        return false;
      });
      newFilm.comments = [film.comments[index]];
      this._mode = Mode.DELETE;
      this._dataChangeHandler(this, film, newFilm);
    });

    this._popupComponent.setWatchedResetHandler((evt) => {
      evt.preventDefault();
      removeRating();
    });

    this._popupComponent.setAddCommentHandler((evt) => {
      evt.preventDefault();
      const newFilm = Film.clone(film);
      const comment = this._popupComponent.getNewComment();
      newFilm.comments = [comment];
      this._mode = Mode.ADDING;
      this._dataChangeHandler(this, null, newFilm);
    });

    this._popupComponent.setSubmitHandler((evt) => {
      if (evt.code === `Enter` && evt.ctrlKey) {
        evt.preventDefault();
        const formData = new FormData(this._popupComponent.getElement());
        const data = parseFormData(formData);
        const newFilm = Film.clone(film);
        newFilm.comments.push(data[`local_comment`]);
        this._mode = Mode.ADDING;
        this._dataChangeHandler(this, film, newFilm);
      }
    });

    this._popupComponent.setCloseButtonClickHandler(this._closeButtonClickHandler);

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
      case Mode.ADDING:
      case Mode.DELETE:
        if (oldPopupComponent) {
          replace(this._popupComponent, oldPopupComponent);
        }
        break;
    }
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
