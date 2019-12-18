// no-films.js
import {createElement} from '../utils.js';

const createNoFilmsTemplate = () => {
  return `<h2 class="film-list__title">
  &laquoThere are no movies in our database&raquo</h2>`;
};

export default class NoTasks {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoFilmsTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
