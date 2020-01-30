// data.js

import he from 'he';
import {FilterType} from './components/navigation.js';

const profileRating = [`novice`, `fan`, `movie buff`];

export const emojies = [`angry`, `puke`, `sleeping`, `smile`];

export const getProfileRating = (count) => {
  if (count < 1) {
    return ``;
  } else if (count < 11) {
    return profileRating[0];
  } else if (count < 21) {
    return profileRating[1];
  }
  return profileRating[2];
};

class FilmRating {
  constructor(id, rating) {
    this.id = id;
    this.rating = rating;
  }
}

class ProfileObject {
  constructor(count) {
    this.avatar = `bitmap@2x.png`;
    this.rating = getProfileRating(count);
    this.filmsCount = count;
    this.author = ``;
    this._filmRatings = [];
  }

  setRating(film, rating) {
    film.personalRating = parseInt(rating, 10);
    const index = this._filmRatings.findIndex((filmRating) => filmRating.id === film.id);
    if (index > -1) {
      this._filmRatings[index].rating = rating;
    } else {
      const privateRating = new FilmRating(film.id, rating);
      this._filmRatings.push(privateRating);
    }
  }

  getRating(film) {
    const index = this._filmRatings.findIndex((filmRating) => filmRating.id === film.id);
    if (index > -1) {
      return this._filmRatings[index].rating;
    }
    return 0;
  }

  removeRating(film) {
    const index = this._filmRatings.findIndex((filmRating) => filmRating.id === film.id);
    if (index > -1) {
      this._filmRatings = [].concat(this._filmRatings.slice(0, index), this._filmRatings.slice(index + 1));
    }
  }

  reset(model) {
    this.filmsCount = model.getFilmsAll().filter((film) => film.isWatched).length;
    this.rating = getProfileRating(this.filmsCount);
  }
}

export const profile = new ProfileObject(0);

const EmptyComment = {
  text: ``,
  author: ``,
  emotion: ``
};

export class CommentObject {
  constructor(data) {
    if (data[`id`] !== undefined) {
      this.id = data[`id`];
    }
    this.text = data[`comment`];
    this.author = data[`author`];
    this.date = new Date(data[`date`]);
    this.emotion = data[`emotion`];
  }

  static clone(data) {
    const comment = Object.assign(new CommentObject(), data);
    return comment;
  }

  static parse(data) {
    return new CommentObject(data);
  }

  static empty() {
    return this.clone(EmptyComment);
  }

  raw() {
    return {
      'comment': this.text,
      'date': this.date.toISOString(),
      'emotion': this.emotion
    };
  }
}

const EmptyFilm = {
  // eslint-disable-next-line camelcase
  [`film_info`]: {
    [`title`]: ``,
    [`alternative_title`]: ``,
    [`description`]: ``,
    [`poster`]: ``,
    [`genre`]: [],
    [`runtime`]: 0,
    [`total_rating`]: ``,
    [`director`]: ``,
    [`writers`]: ``,
    [`actors`]: ``,
    [`age_rating`]: 0,
    release: {
      [`date`]: 0,
      [`release_country`]: ``,
    },
  },
  [`comments`]: [],
  // eslint-disable-next-line camelcase
  [`user_details`]: {
    [`personal_rating`]: 0,
    [`favorite`]: false,
    [`watchlist`]: false,
    [`already_watched`]: false,
    [`watching_date`]: null
  }
};

export class FilmObject {
  constructor(data) {
    if (data.id !== undefined) {
      this.id = data[`id`];
    }
    this.title = data[`film_info`][`title`];
    this.altTitle = data[`film_info`][`alternative_title`];
    this.description = data[`film_info`][`description`];
    this.poster = data[`film_info`][`poster`];
    this.genres = data[`film_info`][`genre`];
    this.duration = data[`film_info`][`runtime`];
    this.rating = data[`film_info`][`total_rating`];
    this.director = data[`film_info`][`director`];
    this.writers = data[`film_info`][`writers`];
    this.actors = data[`film_info`][`actors`];
    this.release = new Date(data[`film_info`][`release`][`date`]);
    this.country = data[`film_info`][`release`][`release_country`];
    this.age = data[`film_info`][`age_rating`];
    this.commentIds = data[`comments`];
    this.comments = [];
    if (data[`comments_text`] !== undefined) {
      this.comments = data[`comments_text`];
    }
    this.personalRating = data[`user_details`][`personal_rating`];
    this.isFavorite = Boolean(data[`user_details`][`favorite`]);
    this.inWatchList = Boolean(data[`user_details`][`watchlist`]);
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.watchDate = (new Date(data[`user_details`][`watching_date`]));
  }

  static parse(data) {
    return new FilmObject(data);
  }

  static empty() {
    return new FilmObject(EmptyFilm);
  }

  static clone(film) {
    return new FilmObject(film.raw());
  }

  raw() {
    const film = {
      [`id`]: this.id,
      [`comments`]: this.commentIds,
      // eslint-disable-next-line camelcase
      [`film_info`]: {
        [`title`]: this.title,
        [`alternative_title`]: this.altTitle,
        [`total_rating`]: this.rating,
        [`poster`]: this.poster,
        [`age_rating`]: this.age,
        [`director`]: this.director,
        [`writers`]: this.writers,
        [`actors`]: this.actors,
        release: {
          [`date`]: this.release.toISOString(),
          [`release_country`]: this.country,
        },
        [`runtime`]: this.duration,
        [`genre`]: this.genres,
        [`description`]: this.description,
      },
      // eslint-disable-next-line camelcase
      [`user_details`]: {
        [`personal_rating`]: this.personalRating,
        [`favorite`]: this.isFavorite,
        [`watchlist`]: this.inWatchList,
        [`already_watched`]: this.isWatched,
        [`watching_date`]: this.watchDate.toISOString()
      },
      [`comments_text`]: this.comments,
    };
    return film;
  }
}

export const parseFormData = (formData) => {
  const emoji = formData.get(`new-comment-emoji`);
  const data = {
    [`comment`]: he.encode(formData.get(`comment`)),
    [`emotion`]: emoji.slice(emoji.lastIndexOf(`/`) + 1, emoji.lastIndexOf(`.`)),
    [`author`]: profile.author,
    [`date`]: (new Date()).getTime()
  };
  const comment = new CommentObject(data);
  return {
    [`in_watchList`]: Boolean(formData.get(`watchlist`)),
    [`is_favorite`]: Boolean(formData.get(`favorite`)),
    [`is_watched`]: Boolean(formData.get(`watched`)),
    [`personal_rating`]: formData.get(`score`),
    [`local_comment`]: comment
  };
};

const getFilmsByFilter = (films, filterType) => {
  let filteredFilms = [];
  switch (filterType) {
    case FilterType.DEFAULT:
      filteredFilms = films;
      break;
    case FilterType.WATCHLIST:
      filteredFilms = films.filter((film) => {
        return film.inWatchList;
      });
      break;
    case FilterType.HISTORY:
      filteredFilms = films.filter((film) => {
        return film.isWatched;
      });
      break;
    case FilterType.FAVORITES:
      filteredFilms = films.filter((film) => {
        return film.isFavorite;
      });
      break;
  }
  return filteredFilms;
};

export class Model {
  constructor() {
    this._films = [];
    this._currentFilterType = FilterType.DEFAULT;
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  static parse(data) {
    return new FilmObject(data);
  }

  static clone(film) {
    return new FilmObject(film.raw());
  }

  static empty() {
    return this.clone(EmptyFilm);
  }

  getFilmsAll() {
    return this._films;
  }

  getFilms() {
    return getFilmsByFilter(this._films, this._currentFilterType);
  }

  setFilms(films) {
    this._films = Array.from(films);
  }

  setFilterType(filterType) {
    this._currentFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateFilm(oldFilm, newFilm) {
    if (newFilm === null) {
      return false;
    }
    const index = this._films.findIndex((film) => film.id === oldFilm.id);
    if (index === -1) {
      return false;
    }
    this._films = [].concat(this._films.slice(0, index), newFilm, this._films.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  removeFilm(id) {
    const index = this._films.findIndex((film) => film.id === id);
    if (index === -1) {
      return false;
    }
    this._films = [].concat(this._films.slice(0, index), this._films.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  addFilm(newFilm) {
    this._films = [].concat(newFilm, this._films);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }
}
