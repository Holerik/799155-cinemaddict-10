// profile.js

import AbstractSmartComponent from './abstract-smart';

const createProfileTemplate = (profile) => {
  return (
    `  <section class="header__profile profile">
    <p class="profile__rating">${profile.rating}</p>
    <img class="profile__avatar" src="images/${profile.avatar}" alt="Avatar" width="35" height="35">
  </section>`
  );
};

export default class Profile extends AbstractSmartComponent {
  constructor(profile) {
    super();
    this._element = null;
    this._profile = profile;
  }

  getTemplate() {
    return createProfileTemplate(this._profile);
  }

  recoveryListeners() {}
}
