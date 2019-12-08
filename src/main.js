
const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;

import {renderTemplate} from './utils.js';
import {filmObjectsArray, FILMS_PER_PAGE, profile} from './data.js';
import {createFilmListTemplate} from './components/film-list.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createFilmPopupTemlate} from './components/film-popup.js';
import {createFilterTemplate} from './components/filter.js';
import {createMostCommentedTemplate} from './components/most-comments.js';
import {createProfileTemplate} from './components/profile.js';
import {createShowMoreTemplate} from './components/show-more.js';
import {createTopRatedTemplate} from './components/top-rated.js';

let filmsRenderArray = [];
let topRatedFilmsArray = [];
let mostCommentedFilmsArray = [];


let filmsCount = filmObjectsArray.length;
let lastRenderFilm = filmsCount > FILMS_PER_PAGE ? FILMS_PER_PAGE : filmsCount;

const getFilmsRanderArray = (delta) => {
  lastRenderFilm = lastRenderFilm + delta > filmsCount ? filmsCount : lastRenderFilm + delta;
  let films = filmObjectsArray.slice(0, lastRenderFilm);
  return films;
};

const getTopRatedFilmsArray = (count) => {
  let topFilms = filmsRenderArray.slice(0, filmsCount).sort((film1, film2) => {
    if (film1.rating < film2.rating) {
      return 1;
    }
    return -1;
  }).slice(0, count);
  return topFilms;
};

const getMostCommentedFilmsArray = (count) => {
  let mostCommentedFilms = filmsRenderArray.slice(0, filmsCount).sort((film1, film2) => {
    if (film1.comments.size < film2.comments.size) {
      return 1;
    }
    return -1;
  }).slice(0, count);
  return mostCommentedFilms;
};

const removeFilmElements = () => {
  while (filmsListContainer) {
    let filmElement = filmsListContainer.querySelector(`.film-card`);
    if (filmElement) {
      filmsListContainer.removeChild(filmElement);
    } else {
      break;
    }
  }
};

const renderFilmElements = (delta = 0) => {
  removeFilmElements();
  filmsRenderArray = getFilmsRanderArray(delta);
  for (let film of filmsRenderArray) {
    renderTemplate(filmsListContainer, createFilmCardTemplate(film), `beforeend`);
  }
  if (lastRenderFilm === filmsCount) {
    moreButton.classList.add(`visually-hidden`);
  }
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

renderTemplate(siteHeaderElement, createProfileTemplate(profile), `beforeend`);
renderTemplate(siteMainElement, createFilterTemplate(filmObjectsArray), `beforeend`);
renderTemplate(siteMainElement, createFilmListTemplate(), `beforeend`);

const filmsBlock = siteMainElement.querySelector(`.films`);
const filmsListContainer = filmsBlock.querySelector(`.films-list__container`);

renderFilmElements();

renderTemplate(filmsListContainer, createShowMoreTemplate(), `afterend`);
renderTemplate(filmsBlock, createTopRatedTemplate(), `beforeend`);
renderTemplate(filmsBlock, createMostCommentedTemplate(), `beforeend`);

const moreButton = document.querySelector(`.films-list__show-more`);

const filmsListExtraBlocks = filmsBlock.querySelectorAll(`.films-list--extra`);

const topRatedFilmsListContainer = filmsListExtraBlocks[0].querySelector(`.films-list__container`);
topRatedFilmsArray = getTopRatedFilmsArray(TOP_RATED_COUNT);
for (let film of topRatedFilmsArray) {
  renderTemplate(topRatedFilmsListContainer, createFilmCardTemplate(film), `beforeend`);
}

const mostCommentedFilmsListContainer = filmsListExtraBlocks[1].querySelector(`.films-list__container`);
mostCommentedFilmsArray = getMostCommentedFilmsArray(MOST_COMMENTED_COUNT);
for (let film of mostCommentedFilmsArray) {
  renderTemplate(mostCommentedFilmsListContainer, createFilmCardTemplate(film), `beforeend`);
}

const siteFooterElement = document.querySelector(`.footer`);
const statisticsElement = siteFooterElement.querySelector(`.footer__statistics p`);
statisticsElement.textContent = `${filmsCount} movies inside`;

renderTemplate(siteFooterElement, createFilmPopupTemlate(filmsRenderArray[0]), `afterend`);

if (filmsCount < FILMS_PER_PAGE) {
  moreButton.classList.add(`visually-hidden`);
}

moreButton.addEventListener(`click`, () => {
  renderFilmElements(FILMS_PER_PAGE);
});

