// navigation.js

import AbstractComponent from './abstract.js';
import {createElement} from '../utils.js';

export const NavigationType = {
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
  STATS: `stats`,
  DEFAULT: `all`
};

const createNavigationTemplate = (films) => {
  let watchListFilms = 0;
  let historyFilms = 0;
  let favorityFilms = 0;
  for (let film of films) {
    watchListFilms += film.inWatchList ? 1 : 0;
    historyFilms += film.isWatched ? 1 : 0;
    favorityFilms += film.isFavorite ? 1 : 0;
  }
  return (
    ` <nav class="main-navigation">
    <a href="#all" data-navi-type= "${NavigationType.DEFAULT}" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" data-navi-type= "${NavigationType.WATCHLIST}" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchListFilms}</span></a>
    <a href="#history" data-navi-type= "${NavigationType.HISTORY}" class="main-navigation__item">History <span class="main-navigation__item-count">${historyFilms}</span></a>
    <a href="#favorites" data-navi-type= "${NavigationType.FAVORITES}" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorityFilms}</span></a>
    <a href="#stats" data-navi-type= "${NavigationType.STATS}" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`
  );
};


export class NavigationComponent extends AbstractComponent {
  constructor(films) {
    super();
    this._currentNaviType = NavigationType.DEFAULT;
    this._films = films;
    this._controller = null;
  }

  getTemplate() {
    return createNavigationTemplate(this._films);
  }

  get currentNavigationType() {
    return this._currentNaviType;
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
        if (this._currentNaviType === naviType) {
          return;
        }
        this._currentNaviType = naviType;
        if (this._controller) {
          this._controller.renderFilmElements();
        }
      });
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  setController(controller) {
    this._controller = controller;
  }
}
