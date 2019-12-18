// filter.js

import AbstractComponent from './abstract.js';

const createFilterTemplate = (films) => {
  let watchListFilms = 0;
  let historyFilms = 0;
  let favorityFilms = 0;
  for (let film of films) {
    watchListFilms += film.inWatchList ? 1 : 0;
    historyFilms += film.isWatched ? 1 : 0;
    favorityFilms += film.isFavorite ? 1 : 0;
  }
  return (
    `  <nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchListFilms}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyFilms}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorityFilms}</span></a>
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>

  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(films) {
    super();
    this._element = null;
    this._films = films;
  }

  getTemplate() {
    return createFilterTemplate(this._films);
  }
}
