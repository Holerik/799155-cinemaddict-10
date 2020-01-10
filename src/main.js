// main.js

import {profile, filmObjectsArray, Model} from './data.js';
import PageController from './controllers/page-controller.js';
import {renderElement, RenderPosition} from './utils.js';
import SortComponent from './components/sort.js';
import NavigationComponent from './components/navigation.js';
import ProfileComponent from './components/profile.js';
import FilmListComponent from './components/film-list.js';

export const filmsModel = new Model();
filmsModel.setFilms(filmObjectsArray);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

renderElement(siteHeaderElement, new ProfileComponent(profile), RenderPosition.BEFOREEND);
const naviComponent = new NavigationComponent(filmsModel);
const sortComponent = new SortComponent();
renderElement(siteMainElement, naviComponent, RenderPosition.BEFOREEND);
renderElement(siteMainElement, sortComponent, RenderPosition.BEFOREEND);

const container = new FilmListComponent();
renderElement(siteMainElement, container, RenderPosition.BEFOREEND);
const pageController = new PageController(filmsModel, container, sortComponent, naviComponent); // ,filmsModel.getFilmsAll());
pageController.render();
