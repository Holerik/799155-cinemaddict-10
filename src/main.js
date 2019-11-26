const FILMS_COUNT = 5;
const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;

import {renderTemplate} from './components/render.js';
import {createFilmListTemplate} from './components/film-list.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createFilmPopupTemlate} from './components/film-popup.js';
import {createFilterTemplate} from './components/filter.js';
import {createMostCommentedTemplate} from './components/most-comments.js';
import {createProfileTemplate} from './components/profile.js';
import {createShowMoreTemplate} from './components/show-more.js';
import {createTopRatedTemplate} from './components/top-rated.js';

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

renderTemplate(siteHeaderElement, createProfileTemplate(), `beforeend`);
renderTemplate(siteMainElement, createFilterTemplate(), `beforeend`);
renderTemplate(siteMainElement, createFilmListTemplate(), `beforeend`);

const filmsBlock = siteMainElement.querySelector(`.films`);
const filmsListContainer = filmsBlock.querySelector(`.films-list__container`);

new Array(FILMS_COUNT)
  .fill(``)
  .forEach(
      () => renderTemplate(filmsListContainer, createFilmCardTemplate(), `beforeend`)
  );

renderTemplate(filmsListContainer, createShowMoreTemplate(), `beforeend`);
renderTemplate(filmsBlock, createTopRatedTemplate(), `beforeend`);
renderTemplate(filmsBlock, createMostCommentedTemplate(), `beforeend`);

const filmsListExtraBlocks = filmsBlock.querySelectorAll(`.films-list--extra`);
const topRatedFilmsListContainer = filmsListExtraBlocks[0].querySelector(`.films-list__container`);

new Array(TOP_RATED_COUNT)
  .fill(``)
  .forEach(
      () => renderTemplate(topRatedFilmsListContainer, createFilmCardTemplate(), `beforeend`)
  );

const mostCommentedFilmsListContainer = filmsListExtraBlocks[1].querySelector(`.films-list__container`);
new Array(MOST_COMMENTED_COUNT)
  .fill(``)
  .forEach(
      () => renderTemplate(mostCommentedFilmsListContainer, createFilmCardTemplate(), `beforeend`)
  );

const siteFooterElement = document.querySelector(`.footer`);
renderTemplate(siteFooterElement, createFilmPopupTemlate(), `afterend`);
