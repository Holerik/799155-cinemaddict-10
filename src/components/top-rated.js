// top-rated.js

import AbstractComponent from './abstract.js';

const createTopRatedTemplate = () => {
  return (
    `  <section class="films-list--extra">
  <h2 class="films-list__title">Top rated</h2>

  <div class="films-list__container">
  </div>
</section>`);
};

export default class TopRatedFilms extends AbstractComponent {
  constructor() {
    super();
    this._element = null;
  }

  getTemplate() {
    return createTopRatedTemplate();
  }
}
