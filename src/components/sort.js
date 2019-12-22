// sort.js

import AbstractComponent from './abstract.js';
import {createElement} from '../utils.js';

export const SortType = {
  BY_DATE: `by-date`,
  BY_RATING: `by-rating`,
  BY_DEFAULT: `default`
};

const createSortTemplate = () => {
  return (
    ` <ul class="sort">
    <li><a href="#" data-sort-type= "${SortType.BY_DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type= "${SortType.BY_DATE}" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type= "${SortType.BY_RATING}" class="sort__button">Sort by rating</a></li>
  </ul>`
  );
};


export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.BY_DEFAULT;
    this._sortTypeChangeHandler = null;
  }

  getTemplate() {
    return createSortTemplate();
  }

  get currentSortType() {
    return this._currentSortType;
  }

  clickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `A`) {
      return;
    }
    const sortType = evt.target.dataset.sortType;
    if (this._currentSortType === sortType) {
      return;
    }
    let item = this.getElement().querySelector(`a[data-sort-type*=${this._currentSortType}]`);
    item.classList.remove(`sort__button--active`);
    this._currentSortType = sortType;
    item = this.getElement().querySelector(`a[data-sort-type*=${this._currentSortType}]`);
    item.classList.add(`sort__button--active`);
    if (this._sortTypeChangeHandler) {
      this._sortTypeChangeHandler();
    }
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._element.addEventListener(`click`, (evt) => {
        this.clickHandler(evt);
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

  setSortTypeChangeHandler(handler) {
    this._sortTypeChangeHandler = handler;
  }
}
