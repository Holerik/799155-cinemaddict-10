// page-controller.js

import {renderElement, RenderPosition} from '../utils.js';
import {HIDDEN_CLASS} from '../components/abstract.js';
import {SortType} from '../components/sort.js';
import ShowMoreComponent from '../components/show-more.js';
import NoFilmsComponent from '../components/no-films';
import MostCommentsComponent from '../components/most-comments.js';
import TopRatedComponent from '../components/top-rated.js';
import MovieController, {Mode, Block, BlockOperation} from '../controllers/movie-controller.js';
import {errorHandle} from '../api.js';
import {profile} from '../data.js';

const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;
const FILMS_PER_PAGE = 5;

export default class PageController {
  constructor(api, model, container, profileComponent, sortComponent, naviComponent) {
    this._api = api;
    this._model = model;
    this._container = container;
    this._topRatedFilmsListContainer = null;
    this._mostCommentedFilmsListContainer = null;
    this._showMoreComponent = new ShowMoreComponent();
    this._topRatedComponent = new TopRatedComponent();
    this._mostCommentsComponent = new MostCommentsComponent();
    this._lastRenderedFilm = FILMS_PER_PAGE;
    this._currentLastRenderedFilm = 0;
    this._filmsListElement = this._container.getElement().querySelector(`.films-list`);
    this._filmsContainerElement = this._filmsListElement.querySelector(`.films-list__container`);
    this._siteFooterElement = document.querySelector(`.footer`);
    this._naviComponent = naviComponent;
    this._sortComponent = sortComponent;
    this._profileComponent = profileComponent;
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
    const films = this._model.getFilmsAll().filter((film) => film.rating > 0);
    let topFilms = films.sort((film1, film2) => {
      if (film1.rating < film2.rating) {
        return 1;
      }
      return -1;
    }).slice(0, count);
    return topFilms;
  }

  _getMostCommentedFilmsArray(count) {
    const films = this._model.getFilmsAll().filter((film) => film.commentIds.length > 0);
    let mostCommentedFilms = films.sort((film1, film2) => {
      if (film1.commentIds.length < film2.commentIds.length) {
        return 1;
      }
      return -1;
    }).slice(0, count);
    return mostCommentedFilms;
  }

  _changeData(movieController, oldFilm, newFilm) {
    if (movieController.mode === Mode.ADDING) {
      const comment = newFilm.comments.pop();
      // пробуем создать на сервере новый комментарий
      // заблокируем элемент с текстом комментария
      movieController.disableElement(Block.COMMENT_AREA, BlockOperation.BLOCK);
      this._api.createComment(oldFilm.id, comment)
      .then((film) => {
        this._api.getComments(film.id)
        .then((comments) => {
          newFilm.comments = comments;
          profile.author = comments[comments.length - 1].author;
          this._model.updateFilm(oldFilm, newFilm);
          // разблокируем элемент
          movieController.disableElement(Block.COMMENT_AREA, BlockOperation.UNBLOCK);
          movieController.render(newFilm, movieController.mode);
        });
      })
      .catch((error) => {
        errorHandle(error, movieController.shakeElement);
      });
    } else if (movieController.mode === Mode.DELETE) {
      const comment = newFilm.comments.pop();
      this._api.deleteComment(comment.id)
       .then(() => {
         const index = oldFilm.comments.findIndex((item) => {
           return item.id === comment.id;
         });
         newFilm.comments = [].concat(oldFilm.comments.slice(0, index), oldFilm.comments.slice(index + 1));
         this._model.updateFilm(oldFilm, newFilm);
         movieController.render(newFilm, movieController.mode);
       })
       .catch(errorHandle);
      movieController.setDeleteButtonCaption(`Delete`);
    } else if (movieController.mode === Mode.RATING) {
      // заблокируем элемент с рейтингами
      movieController.disableElement(Block.RATING_BLOCK, BlockOperation.BLOCK);
      // попытка обновить рейтинг на сервере
      this._api.updateFilm(oldFilm.id, newFilm)
        .then((film) => {
          this._model.updateFilm(oldFilm, film);
          profile.reset(this._model);
          this._profileComponent.rerender();
          // разблокируем элемент
          movieController.disableElement(Block.RATING_BLOCK, BlockOperation.UNBLOCK);
          movieController.render(film, Mode.POPUP);
        })
       .catch((error) => {
         errorHandle(error, movieController.shakeElement);
       });

    } else if (newFilm === null) {
      movieController.render(oldFilm, movieController.mode);
    } else {
      this._api.updateFilm(oldFilm.id, newFilm)
        .then((film) => {
          this._model.updateFilm(oldFilm, film);
          profile.reset(this._model);
          this._profileComponent.rerender();
          movieController.render(film, movieController.mode);
        })
       .catch(errorHandle);
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

  _removeExtraBlocks() {
    this._showedTopRatedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedTopRatedMovieControllers = [];
    this._showedMostCommentedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMostCommentedMovieControllers = [];
  }

  _renderFilmExtraBlocks() {
    this._removeExtraBlocks();
    const filmsListExtraBlocks = this._container.getElement().querySelectorAll(`.films-list--extra`);

    this._topRatedFilmsListContainer = filmsListExtraBlocks[0].querySelector(`.films-list__container`);
    const topRatedFilmsArray = this._getTopRatedFilmsArray(TOP_RATED_COUNT);

    topRatedFilmsArray.forEach((film) => {
      const movieController = new MovieController(this._topRatedFilmsListContainer,
          this._siteFooterElement, this._changeData, this._changeView);
      movieController.render(film, Mode.DEFAULT);
      this._showedTopRatedMovieControllers.push(movieController);
    });

    this._mostCommentedFilmsListContainer = filmsListExtraBlocks[1].querySelector(`.films-list__container`);
    const mostCommentedFilmsArray = this._getMostCommentedFilmsArray(MOST_COMMENTED_COUNT);

    mostCommentedFilmsArray.forEach((film) => {
      const movieController = new MovieController(this._mostCommentedFilmsListContainer,
          this._siteFooterElement, this._changeData, this._changeView);
      movieController.render(film, Mode.DEFAULT);
      this._showedMostCommentedMovieControllers.push(movieController);
    });
  }

  render() {
    const films = this._model.getFilms();
    if (films.length === 0) {
      renderElement(this._filmsListElement, new NoFilmsComponent(), RenderPosition.AFTERBEGIN);
    } else {
      this._renderFilmElements();
      renderElement(this._filmsContainerElement, this._showMoreComponent, RenderPosition.AFTEREND);

      this._showMoreComponent.setClickHandler(this._showMoreButtonClickHandler);

      renderElement(this._container.getElement(), this._topRatedComponent, RenderPosition.BEFOREEND);
      renderElement(this._container.getElement(), this._mostCommentsComponent, RenderPosition.BEFOREEND);
      this._renderFilmExtraBlocks();
    }

    const statisticsElement = this._siteFooterElement.querySelector(`.footer__statistics p`);
    statisticsElement.textContent = `${films.length} movies inside`;
  }

  show() {
    this._container.show();
    this._topRatedFilmsListContainer.classList.remove(HIDDEN_CLASS);
    this._mostCommentedFilmsListContainer.classList.remove(HIDDEN_CLASS);
    this._sortComponent.getElement().classList.remove(HIDDEN_CLASS);
    this._topRatedComponent.getElement().classList.remove(HIDDEN_CLASS);
    this._mostCommentsComponent.getElement().classList.remove(HIDDEN_CLASS);
    this._changeView();
    this._renderFilmElements();
  }

  hide() {
    this._container.hide();
    this._topRatedFilmsListContainer.classList.add(HIDDEN_CLASS);
    this._mostCommentedFilmsListContainer.classList.add(HIDDEN_CLASS);
    this._sortComponent.getElement().classList.add(HIDDEN_CLASS);
    this._topRatedComponent.getElement().classList.add(HIDDEN_CLASS);
    this._mostCommentsComponent.getElement().classList.add(HIDDEN_CLASS);
  }

  rerender(film) {
    const showedControllers = [
      this._showedMovieControllers,
      this._showedMostCommentedMovieControllers,
      this._showedTopRatedMovieControllers
    ];
    showedControllers.forEach((controllers) => {
      const controller = controllers.find((item) => item.filmId === film.id);
      if (controller !== undefined) {
        controller.render(film, controller.mode);
      }
    });
  }
}
