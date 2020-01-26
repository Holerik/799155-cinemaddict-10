// main.js

import Api, {errorHandle} from './api.js';
import {profile, Model} from './data.js';
import PageController from './controllers/page-controller.js';
import {renderElement, RenderPosition} from './utils.js';
import SortComponent from './components/sort.js';
import NavigationComponent, {FilterType} from './components/navigation.js';
import ProfileComponent from './components/profile.js';
import FilmListComponent from './components/film-list.js';
import Statistics from './components/statistics.js';

export const filmsModel = new Model();

const AUTHORIZATION = `Basic aE419YE24051979`;

const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;

const api = new Api(END_POINT, AUTHORIZATION);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const profileComponent = new ProfileComponent(profile);
renderElement(siteHeaderElement, profileComponent, RenderPosition.BEFOREEND);


const statistics = new Statistics(filmsModel, profile);
const naviComponent = new NavigationComponent(filmsModel);
const sortComponent = new SortComponent();
renderElement(siteMainElement, naviComponent, RenderPosition.BEFOREEND);
renderElement(siteMainElement, sortComponent, RenderPosition.BEFOREEND);
renderElement(siteMainElement, statistics, RenderPosition.BEFOREEND);

const container = new FilmListComponent();
renderElement(siteMainElement, container, RenderPosition.BEFOREEND);
const pageController = new PageController(api, filmsModel, container, sortComponent, naviComponent); // ,filmsModel.getFilmsAll());
statistics.hide();

export const rerenderComponents = () => {
  naviComponent.rerender();
  profileComponent.rerender();
  statistics.rerender();
  statistics.hide();
};

const navigationHandler = (menuItem) => {
  switch (menuItem) {
    case FilterType.DEFAULT:
    case FilterType.WATCHLIST:
    case FilterType.HISTORY:
    case FilterType.FAVORITES:
      statistics.hide();
      pageController.show();
      break;
    case FilterType.STATS:
      pageController.hide();
      statistics.show();
  }
};

api.getFilms()
.then((films) => {
  filmsModel.setFilms(films);
  profile.reset(filmsModel);
  filmsModel.getFilmsAll().forEach((film) => {
    api.getComments(film.id)
          .then((comments) => {
            film.comments = comments;
            pageController.rerender(film);
            rerenderComponents();
          })
          .catch(errorHandle);
  });
  pageController.render();
  profileComponent.rerender();
})
.catch(errorHandle);

naviComponent.setNavigationHandler(navigationHandler);
