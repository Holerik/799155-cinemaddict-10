// film-popup.js
import AbstractSmartComponent from './abstract-smart.js';
import {createElement} from '../utils.js';
import {formatTime, formatDate} from '../date.js';
import CommentsComponent from './comment.js';
import RatingComponent from './rating.js';

const genres = (film) => {
  let genre = ``;
  for (let item of film.genres) {
    genre += `<span class="film-details__genre">` + item + `</span>\n`;
  }
  return genre;
};

const createFilmPopupTemlate = (film) => {
  const comments = new CommentsComponent(film);
  const rating = new RatingComponent(film);
  const time = formatTime(film.duration);
  const date = formatDate(film.release);

  let template =
    `  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${film.poster}" alt="">

          <p class="film-details__age">${film.age}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${film.title}</h3>
              <p class="film-details__title-original">Original: ${film.title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${film.rating}</p>
              <p class="film-details__user-rating">Your rate 9</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${film.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${film.writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${film.actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${date}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${time}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${film.country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genre${film.genres.length > 1 ? `s` : ``}</td>
              <td class="film-details__cell">
              ${genres(film)}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${film.description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${film.inWatchList ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${film.isWatched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${film.isFavorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div  class="form-details__middle-container">
    ${film.isWatched ? `` : rating.getTemplate()}
    </div>
    <div class="form-details__bottom-container">
    ${comments.getTemplate()}
    </div>
  </form>`;
  return template;
};

export default class FilmPopup extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._watchListHandler = null;
    this._watchedHandler = null;
    this._favoriteHandler = null;
    this._closeButtonClickHandler = null;
    this._setRating = this._setRating.bind(this);
    this._setEmoji = this._setEmoji.bind(this);
  }

  getTemplate() {
    return createFilmPopupTemlate(this._film);
  }

  _setRating(evt) {
    let rating = evt.target.value;
    this.getElement().querySelector(`.film-details__user-rating`).textContent = `Your rate ${rating}`;
  }

  _setEmoji(evt) {
    let imgSrc = evt.target.labels[0].firstElementChild.src;
    const addEmojiElem = this._element.querySelector(`.film-details__add-emoji-label`);
    addEmojiElem.innerHTML = ``;
    const img = document.createElement(`img`);
    img.src = imgSrc;
    img.width = `55`;
    img.height = `55`;
    img.alt = `emoji`;
    addEmojiElem.appendChild(img);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      const ratingArray = this._element.querySelectorAll(`.film-details__user-rating-input`);
      ratingArray.forEach((element) => {
        element.addEventListener(`click`, this._setRating);
      });
      const emojiArray = this._element.querySelectorAll(`.film-details__emoji-item`);
      emojiArray.forEach((element) => {
        element.addEventListener(`click`, this._setEmoji);
      });
    }
    return this._element;
  }

  recoveryListeners() {
    this.setAddToFavoritesClickHandler(this._favoriteHandler);
    this.setAddToWatchlistClickHandler(this._watchListHandler);
    this.setAlreadyWatchedClickHandler(this._watchedHandler);
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`#watchlist`).
    addEventListener(`click`, handler);
    this._watchListHandler = handler;
  }

  setAlreadyWatchedClickHandler(handler) {
    this.getElement().querySelector(`#watched`).
    addEventListener(`click`, handler);
    this._watchedHandler = handler;
  }

  setAddToFavoritesClickHandler(handler) {
    this.getElement().querySelector(`#favorite`).
    addEventListener(`click`, handler);
    this._favoriteHandler = handler;
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).
    addEventListener(`click`, handler);
    this._closeButtonClickHandler = handler;
  }
}
