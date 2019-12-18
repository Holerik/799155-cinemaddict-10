// film-list.js

import AbstractComponent from './abstract.js';

const createFilmListTemplate = () => {
  return (
    `<section class="films">
       <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
      </div>
    </section>
  </section>`);
};

export default class FilmList extends AbstractComponent {
  constructor() {
    super();
    this._element = null;
  }

  getTemplate() {
    return createFilmListTemplate();
  }
}
