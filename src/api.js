// api.js

import {FilmObject as Film, CommentObject as Comment} from './data.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const errorHandle = (error) => {
  const node = document.createElement(`div`);
  node.style = `width: 180px; margin: 0 auto; text-align: center; background-color: red;`;
  node.textContent = error;
  document.body.insertAdjacentElement(`afterbegin`, node);
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  checkStatus(response) {
    const status = response.status;
    if (status >= 200 && status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  getFilms() {
    return this._load({
      url: `movies`,
      method: Method.GET,
      body: null,
      headers: new Headers()
    })
      .then((response) => response.json())
      .then((data) => data.map(Film.parse))
      .catch(errorHandle);
  }

  getComments(id) {
    return this._load({
      url: `comments/${id}`,
      method: Method.GET,
      body: null,
      headers: new Headers()
    })
      .then((response) => response.json())
      .then((data) => data.map(Comment.parse))
      .catch(errorHandle);
  }

  updateFilm(id, film) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(film.raw()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then((data) => Film.parse(data))
      .catch(errorHandle);
  }

  createComment(id, comment) {
    return this._load({
      url: `comments/${id}`,
      method: Method.POST,
      body: JSON.stringify(comment.raw()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then((data) => Film.parse(data.movie))
      .catch(errorHandle);
  }

  deleteComment(id) {
    return this._load({url: `comments/${id}`, method: Method.DELETE});
  }

  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .catch(errorHandle);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(this.checkStatus)
      .catch((error) => {
        throw error;
      });
  }
}
