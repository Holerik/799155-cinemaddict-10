// comment.js
import {getMinutes, emojies} from '../data.js';
import {createElement} from '../utils.js';

const getDate = (date) => {
  let dateStr = `${date.getYear()}\\${date.getMonth()}\\${date.getDay()} ${date.getHours()}:${getMinutes(date)}`;
  return dateStr;
};

const createCommentTemplate = (comment) => {
  return `          <li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${comment.emoji}" width="55" height="55" alt="emoji">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${getDate(comment.date)}\\</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
};

const createEmojiListTemplate = () => {
  let element =
`          <div class="film-details__emoji-list">`;
  for (let emoji of emojies) {
    element +=
`            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
             <label class="film-details__emoji-label" for="emoji-${emoji}">
               <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
             </label>`;
  }
  element +=
`           </div>`;
  return element;
};

const createCommentsTemplate = (film) => {
  let element =
`      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.comments.size}</span></h3>

        <ul class="film-details__comments-list">`;
  for (let comment of film.comments) {
    element += createCommentTemplate(comment);
  }
  element +=
`        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>`;
  element += createEmojiListTemplate();
  element +=
`        </div>
      </section>`;
  return element;
};

export default class Comments {
  constructor(film) {
    this._element = null;
    this._film = film;
  }

  getTemplate() {
    return createCommentsTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
