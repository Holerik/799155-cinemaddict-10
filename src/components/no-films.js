// no-films.js

import AbstractComponent from './abstract.js';

const createNoFilmsTemplate = () => {
  return `<h2 class="film-list__title">
  &laquoThere are no movies in our database&raquo</h2>`;
};

export default class NoTasks extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createNoFilmsTemplate();
  }
}
