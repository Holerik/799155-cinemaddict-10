// main.js

import {filmObjectsArray, profile} from './data.js';
import PageController from './controllers/page-controller.js';
import {renderElement, RenderPosition} from './utils.js';
import FilterComponent from './components/filter.js';
import ProfileComponent from './components/profile.js';
import FilmListComponent from './components/film-list.js';

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

renderElement(siteHeaderElement, new ProfileComponent(profile), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new FilterComponent(filmObjectsArray), RenderPosition.BEFOREEND);

const container = new FilmListComponent();
renderElement(siteMainElement, container, RenderPosition.BEFOREEND);
const pageController = new PageController(container, filmObjectsArray);
pageController.render();
