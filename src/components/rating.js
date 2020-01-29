// rating.js

import AbstractComponent from './abstract.js';

const createUserRatingTemplate = (film, disable) => {
  const createInputTemplate = () => {
    let index = 1;
    let element = ``;
    while (index < 10) {
      element +=
      `              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${index}" id="rating-${index}" ${film.personalRating === index ? `checked` : ``} ${disable ? `disabled` : ``}>
      <label class="film-details__user-rating-label" for="rating-${index}">${index}</label>
      `;
      index++;
    }
    return element;
  };

  return (
    `  <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${film.poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${film.title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
             ${createInputTemplate()}
            </div>
          </section>
        </div>  
    </section>`
  );
};

export default class UserRating extends AbstractComponent {
  constructor(film, disable) {
    super();
    this._element = null;
    this._film = film;
    this._disable = disable;
  }

  getTemplate() {
    return createUserRatingTemplate(this._film, this._disable);
  }
}
