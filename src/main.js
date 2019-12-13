
const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;

import {filmObjectsArray, FILMS_PER_PAGE, profile} from './data.js';
import {renderElement, RenderPosition} from './utils.js';
import FilmListComponent from './components/film-list.js';
import FilmCardComponent from './components/film-card.js';
import FilmPopupComponent from './components/film-popup.js';
import FilterComponent from './components/filter.js';
import MostCommentsComponent from './components/most-comments.js';
import ProfileComponent from './components/profile.js';
import ShowMoreComponent from './components/show-more.js';
import TopRatedComponent from './components/top-rated.js';
import NoFilmsComponent from './components/no-films';


let filmsRenderArray = [];
let topRatedFilmsArray = [];
let mostCommentedFilmsArray = [];


let filmsCount = filmObjectsArray.length;
let lastRenderedFilm = filmsCount > FILMS_PER_PAGE ? FILMS_PER_PAGE : filmsCount;

const getFilmsRanderArray = (delta) => {
  lastRenderedFilm = lastRenderedFilm + delta > filmsCount ? filmsCount : lastRenderedFilm + delta;
  let films = filmObjectsArray.slice(0, lastRenderedFilm);
  return films;
};

const getTopRatedFilmsArray = (count) => {
  let topFilms = filmObjectsArray.slice(0, filmsCount).sort((film1, film2) => {
    if (film1.rating < film2.rating) {
      return 1;
    }
    return -1;
  }).slice(0, count);
  return topFilms;
};

const getMostCommentedFilmsArray = (count) => {
  let mostCommentedFilms = filmObjectsArray.slice(0, filmsCount).sort((film1, film2) => {
    if (film1.comments.size < film2.comments.size) {
      return 1;
    }
    return -1;
  }).slice(0, count);
  return mostCommentedFilms;
};

const removeMoreButton = () => {
  moreButton.getElement().remove();
  moreButton.removeElement();
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

const renderFilm = (film) => {
  const filmComponent = new FilmCardComponent(film);
  const popupComponent = new FilmPopupComponent(film);
  renderElement(filmsListContainer, filmComponent.getElement(), RenderPosition.BEFOREEND);

  const renderPopupClickHandle = () => {
    if (popupComponent.getElement()) {
      renderElement(siteFooterElement, popupComponent.getElement(), RenderPosition.AFTEREND);
      document.addEventListener(`keydown`, escKeyDownHandler);
    }
  };

  const poster = filmComponent.getElement().querySelector(`.film-card__poster`);
  poster.addEventListener(`click`, renderPopupClickHandle);

  const comments = filmComponent.getElement().querySelector(`.film-card__comments`);
  comments.addEventListener(`click`, renderPopupClickHandle);

  const title = filmComponent.getElement().querySelector(`.film-card__title`);
  title.addEventListener(`click`, renderPopupClickHandle);

  const closeButton = popupComponent.getElement().querySelector(`.film-details__close-btn`);
  closeButton.addEventListener(`click`, () => {
    document.body.removeChild(document.body.querySelector(`.film-details__inner`));
  });
  const escKeyDownHandler = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      document.body.removeChild(document.body.querySelector(`.film-details__inner`));
      document.removeEventListener(`keydown`, escKeyDownHandler);
    }
  };
};

const renderFilmElements = (delta = 0) => {
  removeFilmElements();
  filmsRenderArray = getFilmsRanderArray(delta);
  for (let film of filmsRenderArray) {
    renderFilm(film);
  }
  if (lastRenderedFilm && (lastRenderedFilm === filmsCount)) {
    moreButton.getElement().removeEventListener(`click`, () => {
      renderFilmElements(FILMS_PER_PAGE);
    });
    removeMoreButton();
  }
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

renderElement(siteHeaderElement, new ProfileComponent(profile).getElement(), RenderPosition.BEFOREEND);

renderElement(siteMainElement, new FilterComponent(filmObjectsArray).getElement(), RenderPosition.BEFOREEND);

const filmListComponent = new FilmListComponent();
renderElement(siteMainElement, filmListComponent.getElement(), RenderPosition.BEFOREEND);

const filmsBlock = siteMainElement.querySelector(`.films`);
const filmsListContainer = filmsBlock.querySelector(`.films-list__container`);

const moreButton = new ShowMoreComponent();

if (filmsCount === 0) {
  const filmsList = filmListComponent.getElement().querySelector(`.films-list`);
  renderElement(filmsList, new NoFilmsComponent().getElement(), RenderPosition.AFTERBEGIN);
} else {
  renderFilmElements();

  renderElement(filmsListContainer, moreButton.getElement(), RenderPosition.AFTEREND);

  renderElement(filmsBlock, new TopRatedComponent().getElement(), RenderPosition.BEFOREEND);

  renderElement(filmsBlock, new MostCommentsComponent().getElement(), RenderPosition.BEFOREEND);

  const filmsListExtraBlocks = filmsBlock.querySelectorAll(`.films-list--extra`);

  const topRatedFilmsListContainer = filmsListExtraBlocks[0].querySelector(`.films-list__container`);
  topRatedFilmsArray = getTopRatedFilmsArray(TOP_RATED_COUNT);
  for (let film of topRatedFilmsArray) {
    renderElement(topRatedFilmsListContainer, new FilmCardComponent(film).getElement(), RenderPosition.BEFOREEND);
  }

  const mostCommentedFilmsListContainer = filmsListExtraBlocks[1].querySelector(`.films-list__container`);
  mostCommentedFilmsArray = getMostCommentedFilmsArray(MOST_COMMENTED_COUNT);
  for (let film of mostCommentedFilmsArray) {
    renderElement(mostCommentedFilmsListContainer, new FilmCardComponent(film).getElement(), RenderPosition.BEFOREEND);
  }
}

const siteFooterElement = document.querySelector(`.footer`);
const statisticsElement = siteFooterElement.querySelector(`.footer__statistics p`);
statisticsElement.textContent = `${filmsCount} movies inside`;

// renderElement(siteFooterElement, new FilmPopupComponent(filmsRenderArray[0]).getElement(), RenderPosition.AFTEREND);

if (filmsCount < FILMS_PER_PAGE) {
  removeMoreButton();
}

moreButton.getElement().addEventListener(`click`, () => {
  renderFilmElements(FILMS_PER_PAGE);
});
