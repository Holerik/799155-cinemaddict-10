// film-card.js

import AbstractComponent from './abstract.js';
import {formatTime} from '../date.js';

const MSEC_IN_MINUTE = 60 * 1000;
const createFilmCardTemplate = (film) => {
  const time = formatTime(film.duration * MSEC_IN_MINUTE);
  const year = (new Date(film.release)).getFullYear();
  return (
    `        <article class="film-card">
          <h3 class="film-card__title">${film.title}</h3>
          <p class="film-card__rating">${film.rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${year}</span>
            <span class="film-card__duration">${time}</span>
            <span class="film-card__genre">${film.genres[0]}</span>
          </p>
          <img src="${film.poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${film.description}</p>
          <a class="film-card__comments">${film.comments.length} comments</a>
          <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
          </form>
        </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
    this._setWatchedHandler = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).
    addEventListener(`click`, handler);
  }

  setAlreadyWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).
    addEventListener(`click`, handler);
    // this._setWatchedHandler = handler;
  }

  setAddToFavoritesClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).
    addEventListener(`click`, handler);
  }

  /*
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._element.querySelector(`.film-card__controls-item--mark-as-watched`).
      addEventListener(`click`, () => {
        this._setWatchedHandler();
      });
    }
    return this._element;
  }
  */
}
