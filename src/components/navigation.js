// navigation.js

import AbstractSmartComponent from './abstract-smart.js';
import {createElement} from '../utils.js';

export const FilterType = {
  WATCHLIST: `watchlist`,
  HISTORY: `watched`,
  FAVORITES: `favorites`,
  STATS: `stats`,
  DEFAULT: `all`
};

const createNavigationTemplate = (model) => {
  let watchListFilms = 0;
  let historyFilms = 0;
  let favorityFilms = 0;
  const films = model.getFilmsAll();
  for (let film of films) {
    watchListFilms += film.inWatchList ? 1 : 0;
    historyFilms += film.isWatched ? 1 : 0;
    favorityFilms += film.isFavorite ? 1 : 0;
  }
  return (
    ` <nav class="main-navigation">
    <a href="#all" data-navi-type= "${FilterType.DEFAULT}" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" data-navi-type= "${FilterType.WATCHLIST}" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchListFilms}</span></a>
    <a href="#history" data-navi-type= "${FilterType.HISTORY}" class="main-navigation__item">History <span class="main-navigation__item-count">${historyFilms}</span></a>
    <a href="#favorites" data-navi-type= "${FilterType.FAVORITES}" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorityFilms}</span></a>
    <a href="#stats" data-navi-type= "${FilterType.STATS}" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`
  );
};


export default class Navigation extends AbstractSmartComponent {
  constructor(model) {
    super();
    this._model = model;
    this._currentFilterType = FilterType.DEFAULT;
  }

  getTemplate() {
    return createNavigationTemplate(this._model);
  }

  get currentFilterType() {
    return this._currentFilterType;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._element.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        if (evt.target.tagName !== `A`) {
          return;
        }
        const naviType = evt.target.dataset.naviType;
        if (this._currentFilterType === naviType) {
          return;
        }
        this._currentFilterType = naviType;
        const children = Array.from(this._element.children);
        children.some((target) => {
          if (target.classList.contains(`main-navigation__item--active`)) {
            target.classList.remove(`main-navigation__item--active`);
            return true;
          }
          return false;
        });
        this._model.setFilterType(this._currentFilterType);
        evt.target.classList.add(`main-navigation__item--active`);
      });
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  recoveryListeners() {}
}
