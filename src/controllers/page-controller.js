// page-controller.js

import {renderElement, RenderPosition} from '../utils.js';
import ShowMoreComponent from '../components/show-more.js';
import FilmCardComponent from '../components/film-card.js';
import FilmPopupComponent from '../components/film-popup.js';
import NoFilmsComponent from '../components/no-films';
import MostCommentsComponent from '../components/most-comments.js';
import TopRatedComponent from '../components/top-rated.js';

const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;
const FILMS_PER_PAGE = 5;

export default class PageController {
  constructor(container, films) {
    this._container = container;
    this._films = films;
    this._showMoreComponent = new ShowMoreComponent();
    this._lastRenderedFilm = 0;
    this._filmsListElement = this._container.getElement().querySelector(`.films-list`);
    this._filmsContainerElement = this._filmsListElement.querySelector(`.films-list__container`);
    this._siteFooterElement = document.querySelector(`.footer`);
  }

  removeShowMoreButton() {
    this._showMoreComponent.removeClickHandler();
    this._showMoreComponent.getElement().remove();
    this._showMoreComponent.removeElement();
  }

  removeFilmElements() {
    while (this._filmsContainerElement) {
      let filmElement = this._filmsContainerElement.querySelector(`.film-card`);
      if (filmElement) {
        this._filmsContainerElement.removeChild(filmElement);
      } else {
        break;
      }
    }
  }

  getFilmsRanderArray() {
    this._lastRenderedFilm = this._lastRenderedFilm + FILMS_PER_PAGE > this._films.length ?
      this._films.length : this._lastRenderedFilm + FILMS_PER_PAGE;
    let films = this._films.slice(0, this._lastRenderedFilm);
    return films;
  }

  getTopRatedFilmsArray(count) {
    let topFilms = this._films.slice(0, this._films.length).sort((film1, film2) => {
      if (film1.rating < film2.rating) {
        return 1;
      }
      return -1;
    }).slice(0, count);
    return topFilms;
  }

  getMostCommentedFilmsArray(count) {
    let mostCommentedFilms = this._films.slice(0, this._films.length).sort((film1, film2) => {
      if (film1.comments.size < film2.comments.size) {
        return 1;
      }
      return -1;
    }).slice(0, count);
    return mostCommentedFilms;
  }

  renderFilm(film) {
    const filmComponent = new FilmCardComponent(film);
    const popupComponent = new FilmPopupComponent(film);
    renderElement(this._filmsContainerElement, filmComponent, RenderPosition.BEFOREEND);

    const renderPopupClickHandle = () => {
      if (popupComponent.getElement()) {
        renderElement(this._siteFooterElement, popupComponent, RenderPosition.AFTEREND);
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
  }

  renderFilmElements() {
    this.removeFilmElements();
    let filmsRenderArray = this.getFilmsRanderArray();
    for (let film of filmsRenderArray) {
      this.renderFilm(film);
    }
    if (this._lastRenderedFilm === this._films.length) {
      this.removeShowMoreButton();
    }
  }

  render() {
    if (this._films.length === 0) {
      renderElement(this._filmsListElement, new NoFilmsComponent(), RenderPosition.AFTERBEGIN);
    } else {
      this.renderFilmElements();
      renderElement(this._filmsContainerElement, this._showMoreComponent, RenderPosition.AFTEREND);

      const showMoreButtonClickHandler = () => {
        this.renderFilmElements();
      };

      this._showMoreComponent.setClickHandler(showMoreButtonClickHandler);

      renderElement(this._container.getElement(), new TopRatedComponent(), RenderPosition.BEFOREEND);
      renderElement(this._container.getElement(), new MostCommentsComponent(), RenderPosition.BEFOREEND);
      const filmsListExtraBlocks = this._container.getElement().querySelectorAll(`.films-list--extra`);

      const topRatedFilmsListContainer = filmsListExtraBlocks[0].querySelector(`.films-list__container`);
      const topRatedFilmsArray = this.getTopRatedFilmsArray(TOP_RATED_COUNT);
      for (let film of topRatedFilmsArray) {
        renderElement(topRatedFilmsListContainer, new FilmCardComponent(film), RenderPosition.BEFOREEND);
      }

      const mostCommentedFilmsListContainer = filmsListExtraBlocks[1].querySelector(`.films-list__container`);
      const mostCommentedFilmsArray = this.getMostCommentedFilmsArray(MOST_COMMENTED_COUNT);
      for (let film of mostCommentedFilmsArray) {
        renderElement(mostCommentedFilmsListContainer, new FilmCardComponent(film), RenderPosition.BEFOREEND);
      }
    }

    const statisticsElement = this._siteFooterElement.querySelector(`.footer__statistics p`);
    statisticsElement.textContent = `${this._films.length} movies inside`;
  }
}
