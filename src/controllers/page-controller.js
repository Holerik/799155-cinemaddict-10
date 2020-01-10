// page-controller.js

import {renderElement, RenderPosition} from '../utils.js';
import {SortType} from '../components/sort.js';
import ShowMoreComponent from '../components/show-more.js';
import NoFilmsComponent from '../components/no-films';
import MostCommentsComponent from '../components/most-comments.js';
import TopRatedComponent from '../components/top-rated.js';
import MovieController, {Mode} from '../controllers/movie-controller.js';

const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;
const FILMS_PER_PAGE = 5;

export default class PageController {
  constructor(model, container, sortComponent, naviComponent) {
    this._model = model;
    this._container = container;
    this._showMoreComponent = new ShowMoreComponent();
    this._lastRenderedFilm = FILMS_PER_PAGE;
    this._currentLastRenderedFilm = 0;
    this._filmsListElement = this._container.getElement().querySelector(`.films-list`);
    this._filmsContainerElement = this._filmsListElement.querySelector(`.films-list__container`);
    this._siteFooterElement = document.querySelector(`.footer`);
    this._naviComponent = naviComponent;
    this._sortComponent = sortComponent;
    this._sortComponent.setSortTypeChangeHandler(this._renderFilmElements.bind(this));
    this._showedMovieControllers = [];
    this._changeData = this._changeData.bind(this);
    this._changeView = this._changeView.bind(this);
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._model.setFilterChangeHandler(this._filterTypeChangeHandler);
    this._model.setDataChangeHandler(this._dataChangeHandler);
    this._showedTopRatedMovieControllers = [];
    this._showedMostCommentedMovieControllers = [];
  }

  _filterTypeChangeHandler() {
    this._lastRenderedFilm = FILMS_PER_PAGE;
    renderElement(this._filmsContainerElement, this._showMoreComponent, RenderPosition.AFTEREND);
    this._showMoreComponent.setClickHandler(this._showMoreButtonClickHandler);
    this._renderFilmElements();
  }

  _dataChangeHandler() {
    this.render();
    this._naviComponent.rerender();
  }

  _showMoreButtonClickHandler() {
    this._renderFilmElements(FILMS_PER_PAGE);
  }

  _removeShowMoreButton() {
    this._showMoreComponent.removeClickHandler();
    this._showMoreComponent.getElement().remove();
    this._showMoreComponent.removeElement();
  }

  _removeFilmElements() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
  }

  _getFilmsRanderArray() {
    let sortedFilms = [];
    switch (this._sortComponent.currentSortType) {
      case SortType.BY_DEFAULT:
        sortedFilms = this._model.getFilms().slice();
        break;
      case SortType.BY_RATING:
        sortedFilms = this._model.getFilms().slice().
        sort((left, right) => left.rating - right.rating);
        break;
      case SortType.BY_DATE:
        sortedFilms = this._model.getFilms().slice().
        sort((left, right) => left.year - right.year);
        break;
    }
    return sortedFilms;
  }

  _getTopRatedFilmsArray(count) {
    const films = this._model.getFilmsAll();
    let topFilms = films.slice().sort((film1, film2) => {
      if (film1.rating < film2.rating) {
        return 1;
      }
      return -1;
    }).slice(0, count);
    return topFilms;
  }

  _getMostCommentedFilmsArray(count) {
    const films = this._model.getFilmsAll();
    let mostCommentedFilms = films.slice().sort((film1, film2) => {
      if (film1.comments.size < film2.comments.size) {
        return 1;
      }
      return -1;
    }).slice(0, count);
    return mostCommentedFilms;
  }

  _changeData(movieController, oldFilm, newFilm) {
    this._model.updateFilm(oldFilm, newFilm);
    if (newFilm !== null) {
      movieController.render(newFilm, movieController.mode);
    }
  }

  _changeView() {
    this._showedMovieControllers.forEach((movieController) => movieController.setDefaultView());
  }

  _renderFilmElements(filmsPerPage = 0) {
    this._removeFilmElements();

    let filmsRenderArray = this._getFilmsRanderArray();
    this._lastRenderedFilm += filmsPerPage;
    this._currentLastRenderedFilm = this._lastRenderedFilm;
    if (this._currentLastRenderedFilm > filmsRenderArray.length) {
      this._currentLastRenderedFilm = filmsRenderArray.length;
    }

    filmsRenderArray.slice(0, this._currentLastRenderedFilm).forEach((film) => {
      const movieController = new MovieController(this._filmsContainerElement,
          this._siteFooterElement, this._changeData, this._changeView);
      movieController.render(film, Mode.DEFAULT);
      this._showedMovieControllers.push(movieController);
    });

    if (this._currentLastRenderedFilm === filmsRenderArray.length) {
      this._removeShowMoreButton();
    }
  }

  render() {
    const films = this._model.getFilms();
    if (films.length === 0) {
      renderElement(this._filmsListElement, new NoFilmsComponent(), RenderPosition.AFTERBEGIN);
    } else {
      this._renderFilmElements();
      renderElement(this._filmsContainerElement, this._showMoreComponent, RenderPosition.AFTEREND);

      this._showMoreComponent.setClickHandler(this._showMoreButtonClickHandler);

      renderElement(this._container.getElement(), new TopRatedComponent(), RenderPosition.BEFOREEND);
      renderElement(this._container.getElement(), new MostCommentsComponent(), RenderPosition.BEFOREEND);
      const filmsListExtraBlocks = this._container.getElement().querySelectorAll(`.films-list--extra`);

      const topRatedFilmsListContainer = filmsListExtraBlocks[0].querySelector(`.films-list__container`);
      const topRatedFilmsArray = this._getTopRatedFilmsArray(TOP_RATED_COUNT);

      topRatedFilmsArray.forEach((film) => {
        const movieController = new MovieController(topRatedFilmsListContainer,
            this._siteFooterElement, this._changeData, this._changeView);
        movieController.render(film, Mode.DEFAULT);
        this._showedTopRatedMovieControllers.push(movieController);
      });

      const mostCommentedFilmsListContainer = filmsListExtraBlocks[1].querySelector(`.films-list__container`);
      const mostCommentedFilmsArray = this._getMostCommentedFilmsArray(MOST_COMMENTED_COUNT);

      mostCommentedFilmsArray.forEach((film) => {
        const movieController = new MovieController(mostCommentedFilmsListContainer,
            this._siteFooterElement, this._changeData, this._changeView);
        movieController.render(film, Mode.DEFAULT);
        this._showedMostCommentedMovieControllers.push(movieController);
      });
    }

    const statisticsElement = this._siteFooterElement.querySelector(`.footer__statistics p`);
    statisticsElement.textContent = `${films.length} movies inside`;
  }
}
