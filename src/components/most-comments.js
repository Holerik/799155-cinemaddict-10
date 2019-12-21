// most-comments.js

import AbstractComponent from './abstract.js';

const createMostCommentedTemplate = () => {
  return (
    `    <section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class MostCommentedFilms extends AbstractComponent {
  constructor() {
    super();
    this._element = null;
  }

  getTemplate() {
    return createMostCommentedTemplate();
  }
}
