// movies.js
import AbstractComponent from './abstract.js';

export default class Movies extends AbstractComponent {
  constructor(model) {
    super();
    this._model = model;
  }

  getFilms() {

  }

  setFilms() {

  }

  updateFilm(oldFilm, newFilm) {
    this._model.updateFilm(oldFilm, newFilm);
  }
}
