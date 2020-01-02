// page-controller.js

import {renderElement, RenderPosition} from '../utils.js';
import {SortType} from '../components/sort.js';
import ShowMoreComponent from '../components/show-more.js';
import NoFilmsComponent from '../components/no-films';
import MostCommentsComponent from '../components/most-comments.js';
import TopRatedComponent from '../components/top-rated.js';
import MovieController, {Mode} from '../controllers/movie-controller.js';
import {filmsModel} from '../data.js';

const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;
const FILMS_PER_PAGE = 5;

export default class PageController {
  constructor(container, sortComponent, naviComponent, films) {
    this._container = container;
    this._films = films;
    this._showMoreComponent = new ShowMoreComponent();
    this._lastRenderedFilm = 0;
    this._filmsListElement = this._container.getElement().querySelector(`.films-list`);
    this._filmsContainerElement = this._filmsListElement.querySelector(`.films-list__container`);
    this._siteFooterElement = document.querySelector(`.footer`);
    this._naviComponent = naviComponent;
    this._sortComponent = sortComponent;
    this._sortComponent.setSortTypeChangeHandler(this._renderFilmElements.bind(this));
    this._showedMovieControllers = [];
    this._changeData = this._changeData.bind(this);
    this._changeView = this._changeView.bind(this);
    this._naviComponent.setFilterTypeChangeHandler(this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler() {
    filmsModel.setFilterType(this._naviComponent.currentFiterType);
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
        sortedFilms = filmsModel.getFilms().slice(0, this._lastRenderedFilm);
        break;
      case SortType.BY_RATING:
        sortedFilms = filmsModel.getFilms().slice().
        sort((left, right) => left.rating - right.rating).slice(0, this._lastRenderedFilm);
        break;
      case SortType.BY_DATE:
        sortedFilms = filmsModel.getFilms().slice().
        sort((left, right) => left.year - right.year).slice(0, this._lastRenderedFilm);
        break;
    }
    return sortedFilms;
  }

  _getTopRatedFilmsArray(count) {
    let topFilms = filmsModel.getFilms().slice(0, this._films.length).sort((film1, film2) => {
      if (film1.rating < film2.rating) {
        return 1;
      }
      return -1;
    }).slice(0, count);
    return topFilms;
  }

  _getMostCommentedFilmsArray(count) {
    let mostCommentedFilms = filmsModel.getFilms().slice(0, this._films.length).sort((film1, film2) => {
      if (film1.comments.size < film2.comments.size) {
        return 1;
      }
      return -1;
    }).slice(0, count);
    return mostCommentedFilms;
  }

  _changeData(movieController, oldFilm, newFilm) {
    filmsModel.updateFilm(oldFilm, newFilm);
    movieController.render(newFilm, movieController.mode);
    this._naviComponent.rerender();
  }

  _changeView() {
    this._showedMovieControllers.forEach((movieController) => movieController.setDefaultView());
  }

  _renderFilmElements(filmsPerPage = 0) {
    this._removeFilmElements();

    this._lastRenderedFilm += filmsPerPage;
    if (this._lastRenderedFilm > this._films.length) {
      this._lastRenderedFilm = this._films.length;
    }

    let filmsRenderArray = this._getFilmsRanderArray();
    filmsRenderArray.slice(0, this._lastRenderedFilm).forEach((film) => {
      const movieController = new MovieController(this._filmsContainerElement,
          this._siteFooterElement, this._changeData, this._changeView);
      movieController.render(film, Mode.DEFAULT);
      this._showedMovieControllers.push(movieController);
    });

    if (this._lastRenderedFilm === this._films.length) {
      this._removeShowMoreButton();
    }
  }

  render() {
    if (this._films.length === 0) {
      renderElement(this._filmsListElement, new NoFilmsComponent(), RenderPosition.AFTERBEGIN);
    } else {
      this._renderFilmElements(FILMS_PER_PAGE);
      renderElement(this._filmsContainerElement, this._showMoreComponent, RenderPosition.AFTEREND);

      const showMoreButtonClickHandler = () => {
        this._renderFilmElements(FILMS_PER_PAGE);
      };

      this._showMoreComponent.setClickHandler(showMoreButtonClickHandler);

      renderElement(this._container.getElement(), new TopRatedComponent(), RenderPosition.BEFOREEND);
      renderElement(this._container.getElement(), new MostCommentsComponent(), RenderPosition.BEFOREEND);
      const filmsListExtraBlocks = this._container.getElement().querySelectorAll(`.films-list--extra`);

      const topRatedFilmsListContainer = filmsListExtraBlocks[0].querySelector(`.films-list__container`);
      const topRatedFilmsArray = this._getTopRatedFilmsArray(TOP_RATED_COUNT);

      topRatedFilmsArray.forEach((film) => {
        const movieController = new MovieController(topRatedFilmsListContainer,
            this._siteFooterElement, this._changeData, this._changeView);
        movieController.render(film, Mode.DEFAULT);
        this._showedMovieControllers.push(movieController);
      });

      const mostCommentedFilmsListContainer = filmsListExtraBlocks[1].querySelector(`.films-list__container`);
      const mostCommentedFilmsArray = this._getMostCommentedFilmsArray(MOST_COMMENTED_COUNT);

      mostCommentedFilmsArray.forEach((film) => {
        const movieController = new MovieController(mostCommentedFilmsListContainer,
            this._siteFooterElement, this._changeData, this._changeView);
        movieController.render(film, Mode.DEFAULT);
        this._showedMovieControllers.push(movieController);
      });
    }

    const statisticsElement = this._siteFooterElement.querySelector(`.footer__statistics p`);
    statisticsElement.textContent = `${this._films.length} movies inside`;
  }
}
