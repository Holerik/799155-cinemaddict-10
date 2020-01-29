// film-list.js

import AbstractComponent, {HIDDEN_CLASS} from './abstract.js';

const createFilmListTemplate = () => {
  return (
    `<section class="films">
       <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <h2 class="films-list__title film-list__loading">&laquoLoading ...&raquo</h2>
      <div class="films-list__container">
      </div>
    </section>
  </section>`);
};

export default class FilmList extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilmListTemplate();
  }

  hide() {
    this._element.querySelector(`.film-list__loading`).classList.add(HIDDEN_CLASS);
  }
}
