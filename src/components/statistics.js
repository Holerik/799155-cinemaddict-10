// statistics.js

import AbsractSmartComponent from './abstract-smart.js';
import {createElement} from '../utils.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {checkDate} from '../date.js';

export const StatFilter = {
  ALLTIME: `all time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const getGenreStatistics = (model) => {
  const genreStat = {};
  const films = model.getFilmsAll().filter((film) => {
    return film.isWatched;
  });
  films.forEach((film) => {
    film.genres.forEach((genre) => {
      if (genre in genreStat) {
        genreStat[genre]++;
      } else {
        genreStat[genre] = 1;
      }
    });
  });
  return genreStat;
};

const getTopGenre = (model) => {
  const statistics = getGenreStatistics(model);
  const genres = Object.keys(statistics);
  let genreIndex = 0;
  genres.forEach((genre, index) => {
    if (statistics[genre] > statistics[genres[genreIndex]]) {
      genreIndex = index;
    }
  });
  return genres[genreIndex];
};

const renderBarChart = (tagsCtx, model) => {
  const statistics = getGenreStatistics(model);
  const chartData = {
    label: ``,
    data: Object.values(statistics).concat([0]),
    backgroundColor: Object.values(statistics).concat([0]).map(() => `yellow`),
    borderColor: Object.values(statistics).concat([0]).map(() => `black`),
    borderWidth: 1,
    hoverBorderWidth: 0,
    minBarLength: 0,
    barPercentage: 0.8,
    datalabels: {
      display: false,
    }
  };
  const chartOptions = {
    scales: {
      yAxes: [{
        ticks: {

        }
      }],
      xAxes: [{
        display: false,
        tics: {
          beginAtZero: true,
        }
      }],
    },
    elements: {
      rectangle: {
        borderSkipped: `left`,
      }
    },
    plugins: {
      legend: false,
      title: false,
    },
    layout: {
      padding: {
        left: 40
      }
    },
  };
  Chart.defaults.global.defaultFontSize = 20;
  Chart.defaults.global.defaultFontColor = `#ffffff`;

  const barChart = new Chart(tagsCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(statistics).concat([``]),
      datasets: [chartData]
    },
    options: chartOptions
  });
  return barChart;
};

const getFilteredFilms = (model, filter) => {
  return model.getFilmsAll().filter((film) => {
    if (film.isWatched === false) {
      return false;
    }
    if (filter === StatFilter.ALLTIME) {
      return true;
    }

    return checkDate(film.watchDate, filter);
  });
};

const getAllFilteredFilms = (model) => {
  return {
    [StatFilter.ALLTIME]: getFilteredFilms(model, StatFilter.ALLTIME),
    [StatFilter.YEAR]: getFilteredFilms(model, StatFilter.YEAR),
    [StatFilter.MONTH]: getFilteredFilms(model, StatFilter.MONTH),
    [StatFilter.WEEK]: getFilteredFilms(model, StatFilter.WEEK),
    [StatFilter.TODAY]: getFilteredFilms(model, StatFilter.TODAY)
  };
};

const createStatisticsTemplate = (model, profile, menuItem, statistics) => {

  const getFilteredFilmsCount = (filter) => {
    return statistics[filter].length;
  };

  const MSEC_PER_HOUR = 3600000;
  const MSEC_PER_MINUTE = 60000;

  const getDuration = (filter) => {
    return statistics[filter].reduce((_duration, film) => {
      return _duration + film.duration * MSEC_PER_MINUTE;

    }, 0);
  };

  const getFilteredFilmsDuration = (filter) => {
    return getDuration(filter);
  };

  const getFormattedDuration = (filter) => {
    const duration = getFilteredFilmsDuration(filter);
    const _hours = Math.floor(duration / MSEC_PER_HOUR);
    const _min = Math.floor((duration - _hours * MSEC_PER_HOUR) / MSEC_PER_MINUTE);
    return {
      hours: _hours.toString(),
      min: (_min < 10 ? `0` : ``) + _min.toString()
    };
  };

  return (
    `  <section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/${profile.avatar}" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${profile.rating}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${getFilteredFilmsCount(menuItem)} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${getFormattedDuration(menuItem).hours} <span class="statistic__item-description">h</span> ${getFormattedDuration(menuItem).min} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${getTopGenre(model)}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>
  `);
};

export default class Statistics extends AbsractSmartComponent {
  constructor(model, profile) {
    super();
    this._model = model;
    this._profile = profile;
    this._curentStatMenuItem = StatFilter.ALLTIME;
    this._statMenuClickHandle = this._statMenuClickHandle.bind(this);
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._model.setDataChangeHandler(this._dataChangeHandler);
    this._chart = null;
    this._statistics = null;
  }

  getTemplate() {
    this._statistics = getAllFilteredFilms(this._model);
    return createStatisticsTemplate(this._model, this._profile,
        this._curentStatMenuItem, this._statistics);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._element.addEventListener(`click`, this._statMenuClickHandle);
    }
    return this._element;
  }

  rerender() {
    super.rerender();
    if (this._statistics[this._curentStatMenuItem].length > 0) {
      this._renderChart();
    }
  }

  _statMenuClickHandle(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    const menuItem = evt.target.firstChild.nodeValue;
    const items = Object.values(StatFilter);
    const statMenuItem = items[items.findIndex((item) => menuItem.toLowerCase().indexOf(item) > -1)];
    if (statMenuItem !== this._curentStatMenuItem) {
      this._curentStatMenuItem = statMenuItem;
      this.rerender();
      this._setActiveMenuItem(statMenuItem);
    }
  }

  _setActiveMenuItem(menuItem) {
    const menuMap = {
      [StatFilter.ALLTIME]: `all-time`,
      [StatFilter.TODAY]: `today`,
      [StatFilter.WEEK]: `week`,
      [StatFilter.MONTH]: `month`,
      [StatFilter.YEAR]: `year`
    };
    const item = this.getElement().querySelector(`#statistic-${menuMap[menuItem]}`);
    if (item) {
      item.checked = true;
    }
  }

  _dataChangeHandler() {
    this.rerender();
    this.hide();
  }

  show() {
    this.rerender();
    super.show();
    if (this._statistics[this._curentStatMenuItem].length > 0) {
      this._renderChart();
    }
  }

  recoveryListeners() {}

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  _renderChart() {
    const element = this.getElement();
    const ctx = element.querySelector(`.statistic__chart`);
    this._resetChart();
    this._chart = renderBarChart(ctx, this._model);
  }
}
