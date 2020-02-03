// movie-controller.js

import FilmCardComponent from '../components/film-card.js';
import {renderElement, RenderPosition, remove, replace, debounce} from '../utils.js';
import FilmPopupComponent from '../components/film-popup.js';
import {FilmObject as Film, parseFormData, profile} from '../data.js';

export const Mode = {
  ADDING: `adding`,
  RATING: `rating`,
  UPDATE: `update`,
  DELETE: `delete`,
  POPUP: `popup`,
  DEFAULT: `default`
};

export const Block = {
  COMMENT_AREA: `comment_area`,
  RATING_BLOCK: `rating_block`,
  NONE: `none`
};

export const BlockOperation = {
  BLOCK: 1,
  UNBLOCK: 0
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
    this._disabledElement = Block.NONE;
    this.shakeElement = this.shakeElement.bind(this);
  }

  _replacePopupToFilmcard() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._popupComponent.getElement().querySelector(`.film-details__close-btn`).
    removeEventListener(`click`, this._closeButtonClickHandler);
    if (document.contains(this._popupComponent.getElement())) {
      this._filmComponent.recoveryListeners();
      replace(this._filmComponent, this._popupComponent);
    }
    remove(this._popupComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceFilmcardToPopup() {
    this._viewChangeHandler();
    this._popupComponent.recoveryListeners();
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

  setDeleteButtonCaption(caption) {
    this._popupComponent.setDeleteButtonText(caption);
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


    const setFavorite = (evt) => {
      evt.preventDefault();
      const newFilm = Film.clone(film);
      newFilm.isFavorite = !film.isFavorite;
      this._dataChangeHandler(this, film, newFilm);
    };

    this._filmComponent.setAddToFavoritesClickHandler((evt) => {
      debounce(setFavorite(evt));
    });

    this._popupComponent.setAddToFavoritesClickHandler((evt) => {
      debounce(setFavorite(evt));
    });

    const addToWatchList = (evt) => {
      evt.preventDefault();
      const newFilm = Film.clone(film);
      newFilm.inWatchList = !film.inWatchList;
      this._dataChangeHandler(this, film, newFilm);
    };

    this._filmComponent.setAddToWatchlistClickHandler((evt) => {
      debounce(addToWatchList(evt));
    });

    this._popupComponent.setAddToWatchlistClickHandler((evt) => {
      debounce(addToWatchList(evt));
    });

    const removeRating = () => {
      const newFilm = Film.clone(film);
      newFilm.isWatched = !film.isWatched;
      profile.removeRating(film);
      newFilm.personalRating = 0;
      this._dataChangeHandler(this, film, newFilm);
    };

    const setRating = (evt) => {
      evt.preventDefault();
      const rating = evt.target.value;
      evt.target.checked = true;
      this._popupComponent.getElement().querySelector(`.film-details__user-rating`).textContent = `Your rate ${rating}`;
      const newFilm = Film.clone(film);
      newFilm.personalRating = parseInt(rating, 10);
      profile.setRating(film, rating);
      this._mode = Mode.RATING;
      this._dataChangeHandler(this, film, newFilm);
    };

    this._popupComponent.setRatingHandler((evt) => {
      setRating(evt);
    });

    const setWatched = (evt) => {
      evt.preventDefault();
      const newFilm = Film.clone(film);
      newFilm.isWatched = !film.isWatched;
      if (!film.isWatched) {
        newFilm.watchDate = new Date();
      } else {
        profile.removeRating(film);
        newFilm.personalRating = 0;
      }
      this._dataChangeHandler(this, film, newFilm);
    };

    this._filmComponent.setAlreadyWatchedClickHandler((evt) => {
      debounce(setWatched(evt));
    });

    this._popupComponent.setAlreadyWatchedClickHandler((evt) => {
      debounce(setWatched(evt));
    });

    this._popupComponent.setDeleteCommentHandler((evt) => {
      evt.preventDefault();
      this._popupComponent.setDeleteButtonText(`Deleting ...`);
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
      newFilm.comments.push(comment);
      this._mode = Mode.ADDING;
      this._dataChangeHandler(this, film, newFilm);
    });

    this._popupComponent.setSubmitHandler((evt) => {
      if (evt.code === `Enter` && evt.ctrlKey) {
        evt.preventDefault();
        if (this._disabledElement === Block.COMMENT_AREA) {
          this.disableElement(Block.COMMENT_AREA, BlockOperation.UNBLOCK);
        }
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

  disableElement(type, disable) {
    this._disabledElement = type;
    switch (type) {
      case Block.COMMENT_AREA:
        this._popupComponent.disableCommentArea(disable);
        break;
      case Block.RATING_BLOCK:
        this._popupComponent.disableRatingBlock(disable);
        break;
      default:
        break;
    }
    if (disable === BlockOperation.UNBLOCK) {
      this._disabledElement = Block.NONE;
    }
  }

  shakeElement() {
    switch (this._disabledElement) {
      case Block.COMMENT_AREA:
        this._popupComponent.shakeCommentArea();
        break;
      case Block.RATING_BLOCK:
        this._popupComponent.shakeRatingBlock();
        break;
      default:
        break;
    }
  }
}
