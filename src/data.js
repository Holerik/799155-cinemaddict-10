// data.js

export const FILMS_PER_PAGE = 5;

export const getMinutes = (date) => {
  const min = date.getMinutes();
  const minutes = `${min > 9 ? `` : `0`}` + min;
  return minutes;
};

const profileRating = [`Movie Junior`, `Movie Senior`, `Movie Master`];

const filmDescriptors = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const filmTitles = [
  `Они сражались за Родину`,
  `Старики-разбойники`,
  `Щит и меч`,
  `17 мгновений весны`,
  `Бриллиантовая рука`,
  `Любовь и голуби`,
  `Люди в черном`,
  `Кавказская пленница`,
  `Живи и дай умереть другим`,
  `Из России с любовью`,
  `Джокер`,
  `Терминатор`,
  `Человек-паук`,
  `Тихий Дон`,
  `Полет над гнездом кукушки`,
  `Берегись автомобиля`,
  `Служебный роман`
];

const filmPosters = [
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`,
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`
];

export const emojies = [`angry`, `puke`, `sleeping`, `smile`, `trophy`];

const filmYears = [
  `1964`, `1972`, `2012`, `1988`, `1956`, `2001`, `1998`];

const months = [`Января`, `Февраля`, `Марта`, `Апреля`, `Мая`, `Июня`, `Июля`, `Августа`,
  `Сентября`, `Октября`, `Ноября`, `Декабря`];

const filmGenres = [`Comedy`, `Musical`, `Western`, `Drama`, `Cartoon`, `Mystery`, `Film-Noir`];

const filmActors = [`Anne Wigton`, `Heinz Herald`, `Richard Weil`, `Dan Duryea`, `Mary Beth Hughes`,
  `Erich von Stroheim`, `Arnold Shwarzneger`, `Matt Daymon`, `Tom Cruise`, `Brad Pitt`];

const filmCountry = [`USA`, `Italy`, `Russia`, `Germany`, `France`, `Brasilia`, `China`];

const filmDirectors = [`Anthony Mann`, `Timur Beckmambetov`, `Martin Scorceze`, `Stiven Spilberg`, `Savva Morozov`];

const filmWriters = [`Anne Wigton`, `Heinz Herald`, `Richard Weil`, `Harvy Vainshtain`];

const commentTexts = [`Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`];

const commentAuthors = [`A. Pushkin`, `John Doe`, `S. Stallone`, `A. Merkel`];

const getRandomArrayItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const MAX_SENTENCES_COUNT = 3;

const getRandomFilmDescriptor = () => {
  let sentencesCount = Math.floor(Math.random() * MAX_SENTENCES_COUNT);
  sentencesCount++;
  let descriptor = ``;
  while (sentencesCount > 0) {
    let index = Math.floor(Math.random() * filmDescriptors.length);
    if (descriptor.indexOf(filmDescriptors[index]) < 0) {
      descriptor += filmDescriptors[index];
      sentencesCount--;
      descriptor += sentencesCount > 0 ? ` ` : ``;
    }
  }
  return descriptor;
};

const getRandomFilmPoster = () => {
  return getRandomArrayItem(filmPosters);
};

const getRandomFilmYear = () => {
  return getRandomArrayItem(filmYears);
};

const getRandomFilmRelease = (year) => {
  let release = `${Math.floor(Math.random() * 29) + 1} ` + `${getRandomArrayItem(months)} ` + year;
  return release;
};

const getRandomFilmGenre = () => {
  return getRandomArrayItem(filmGenres);
};

const getRandomFilmCountry = () => {
  return getRandomArrayItem(filmCountry);
};

const MAX_FILM_RATING = 9;

const getRandomFilmRating = () => {
  let part1 = 0;
  while (part1 === 0) {
    part1 = Math.floor(Math.random() * MAX_FILM_RATING);
  }
  let part2 = 0;
  while (part2 === 0) {
    part2 = Math.floor(Math.random() * MAX_FILM_RATING);
  }
  return `${part1}.${part2}`;
};

const MAX_AUTORS_COUNT = 4;

const getRandomArctorsList = () => {
  let actorsCount = Math.floor(Math.random() * MAX_AUTORS_COUNT);
  actorsCount++;
  let actorsList = ``;
  while (actorsCount > 0) {
    let index = Math.floor(Math.random() * filmActors.length);
    if (actorsList.indexOf(filmActors[index]) < 0) {
      actorsList += filmActors[index];
      actorsCount--;
      actorsList += actorsCount > 0 ? `, ` : ``;
    }
  }
  return actorsList;
};

const MAX_WRITERS_COUNT = 4;

const getRandomFimWriters = () => {
  let writersCount = Math.floor(Math.random() * MAX_WRITERS_COUNT);
  writersCount++;
  let writersList = ``;
  while (writersCount > 0) {
    let index = Math.floor(Math.random() * filmWriters.length);
    if (writersList.indexOf(filmWriters[index]) < 0) {
      writersList += filmActors[index];
      writersCount--;
      writersList += writersCount > 0 ? `, ` : ``;
    }
  }
  return writersList;
};

const getRandomFimDirector = () => {
  return getRandomArrayItem(filmDirectors);
};

const getRandomEmoji = () => {
  return getRandomArrayItem(emojies);
};

const getRandomCommentText = () => {
  return getRandomArrayItem(commentTexts);
};

const getRandomCommentAuthor = () => {
  return getRandomArrayItem(commentAuthors);
};

const MAX_HOURS_DURATION = 2;
const MAX_MINUTES_DURATION = 59;
const MIN_MINUTES_DURATION = 25;

const getRandomFilmDuration = () => {
  let hours = Math.floor(Math.random() * MAX_HOURS_DURATION);
  let minutes = 0;
  while (minutes < MIN_MINUTES_DURATION) {
    minutes = Math.floor(Math.random() * MAX_MINUTES_DURATION);
  }
  return `${hours}h ${minutes}m`;
};

class CommentObject {
  constructor() {
    this.text = getRandomCommentText();
    this.author = getRandomCommentAuthor();
    this.date = new Date();
    this.emoji = getRandomEmoji() + `.png`;
  }
}

const MAX_COMMENTS_COUNT = 2;

const getRandomComments = () => {
  let comments = new Set();
  let commentsCount = Math.floor(Math.random() * MAX_COMMENTS_COUNT);
  while (comments.size < commentsCount) {
    comments.add(new CommentObject());
  }
  return comments;
};

const getRandomBolean = () => {
  return Math.floor(Math.random() * 2) > 0;
};

class FilmObject {
  constructor(title) {
    this.title = title;
    this.description = getRandomFilmDescriptor();
    this.poster = getRandomFilmPoster();
    this.genre = getRandomFilmGenre();
    this.duration = getRandomFilmDuration();
    this.year = getRandomFilmYear();
    this.rating = getRandomFilmRating();
    this.director = getRandomFimDirector();
    this.writers = getRandomFimWriters();
    this.actors = getRandomArctorsList();
    this.release = getRandomFilmRelease(this.year);
    this.country = getRandomFilmCountry();
    this.age = `16+`;
    this.comments = getRandomComments();
    this.isFavorite = getRandomBolean();
    this.inWatchList = getRandomBolean();
    this.isWatched = getRandomBolean();
  }
}

export const filmObjectsArray = [];

filmTitles.forEach((title) => {
  let film = new FilmObject(title);
  filmObjectsArray.push(film);
});

const getProfileRating = (count) => {
  if (count < 5) {
    return profileRating[0];
  } else if (count < 10) {
    return profileRating[1];
  }
  return profileRating[2];
};

class ProfileObject {
  constructor(count) {
    this.avatar = `bitmap@2x.png`;
    this.rating = getProfileRating(count);
    this.filmsCount = count;
  }
}

export const profile = new ProfileObject(Math.floor(Math.random() * filmObjectsArray.length));

const filters = [`all`, `watchlist`, `history`, `favorites`];

const getCount = (fn) => {
  let count = 0;
  for (let film of filmObjectsArray) {
    if (fn(film)) {
      count++;
    }
  }
  return count;
};

const getCountOfFilmsByFilter = (title) => {
  let count = 0;
  switch (title) {
    case filters[0]:
      count = filmObjectsArray.length;
      break;
    case filters[1]:
      count = getCount((film) => {
        return film.isWatchList;
      });
      break;
    case filters[2]:
      count = getCount((film) => {
        return film.isWatched;
      });
      break;
    case filters[3]:
      count = getCount((film) => {
        return film.isFavorite;
      });
      break;
  }
  return count;
};

class FilterObject {
  constructor(title) {
    this.title = title;
    this.count = getCountOfFilmsByFilter(title);
  }
}

export const filterObjectsArray = [];
filters.forEach((title) => {
  const filter = new FilterObject(title);
  filterObjectsArray.push(filter);
});
