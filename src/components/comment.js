// comment.js

import he from 'he';
import {emojies} from '../data.js';
import {formatTimeForComment} from '../date.js';
import AbstractComponent from './abstract.js';

export const MIN_COMMENT_LENGTH = 1;
export const MAX_COMMENT_LENGTH = 140;

export const isAllowableCommentLength = (comment) => {
  const length = comment.length;
  return length >= MIN_COMMENT_LENGTH &&
    length <= MAX_COMMENT_LENGTH;
};

const createCommentTemplate = (comment, deleteText) => {
  let text = he.encode(comment.text);
  if (text.length > MAX_COMMENT_LENGTH) {
    text = comment.text.slice(0, MAX_COMMENT_LENGTH - 2) + `&hellip;`;
  }
  let disable = true;
  if (deleteText.indexOf(`Delete`) > -1) {
    disable = false;
  }
  return `          <li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji">
            </span>
            <div>
              <p class="film-details__comment-text">${text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${formatTimeForComment(comment.date)}</span>
                <button class="film-details__comment-delete" ${disable ? `disabled` : ``}>${deleteText}</button>
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

const createCommentsTemplate = (film, disable, deleteText) => {
  let element =
`      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments: <span class="film-details__comments-count">${film.comments.length}</span></h3>

        <ul class="film-details__comments-list">`;
  film.comments.forEach((comment) => {
    element += createCommentTemplate(comment, deleteText);
  });
  element +=
`        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${disable ? `disabled` : ``}></textarea>
          </label>
          <button class="film-details__comment-add visually-hidden">&nbsp;Add</button>`;
  element += createEmojiListTemplate();
  element +=
`        </div>
      </section>`;
  return element;
};

export default class Comments extends AbstractComponent {
  constructor(film, disable, deleteText) {
    super();
    this._film = film;
    this._deleteClickHandle = null;
    this._disable = disable;
    this._deleteText = deleteText;
  }

  getTemplate() {
    return createCommentsTemplate(this._film, this._disable, this._deleteText);
  }
}
