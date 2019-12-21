// show-more.js

import AbstractComponent from './abstract.js';

const createShowMoreTemplate = () => {
  return (
    `      <button class="films-list__show-more">Show more</button>`
  );
};

export default class ShowMoreButton extends AbstractComponent {
  constructor() {
    super();
    this._element = null;
    this._clickHandler = null;
  }

  getTemplate() {
    return createShowMoreTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
    this._clickHandler = handler;
  }

  removeClickHandler() {
    this.getElement().removeEventListener(`click`, this._clickHandler);
    this._clickHandler = null;
  }
}
