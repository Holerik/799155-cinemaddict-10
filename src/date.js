// date.js
import moment from "moment";
import {StatFilter} from './components/statistics.js';

export const getTime = (date) => {
  return moment(date).utc().format(`hh:mm`);
};

export const formatTime = (date) => {
  const time = getTime(date);
  const index = time.indexOf(`:`);
  const hours = parseInt(time.slice(0, index), 10).toString();
  const ftime = hours + `h ` + time.slice(index + 1) + `m`;
  return ftime;
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatDateForComment = (date) => {
  const formattedDate = moment(date).format(`YYYY/MMMM/DD`);
  const formattedTime = moment(date).utc().format(`hh:mm`);
  return formattedDate + ` ` + formattedTime;
};

const MSEC_IN_MIN = 60 * 1000;
const MSEC_IN_HOUR = MSEC_IN_MIN * 60;
const MSEC_IN_DAY = MSEC_IN_HOUR * 24;
const MSEC_IN_WEEK = MSEC_IN_DAY * 7;
const MSEC_IN_MONTH = MSEC_IN_WEEK * 4;
const MSEC_IN_YEAR = MSEC_IN_DAY * 365;

export const formatTimeForComment = (date) => {
  const nowDate = new Date();
  const diffTime = nowDate.getTime() - date;
  if (diffTime < MSEC_IN_MIN) {
    return `now`;
  } else if (diffTime < 4 * MSEC_IN_MIN) {
    return `a minute ago`;
  } else if (diffTime < MSEC_IN_HOUR) {
    return `a few minutes ago`;
  } else if (diffTime < 2 * MSEC_IN_HOUR) {
    return `a hour ago`;
  } else if (diffTime < MSEC_IN_DAY) {
    return `a few hours ago`;
  } else if (diffTime < 2 * MSEC_IN_DAY) {
    return `a day ago`;
  } else if (diffTime < MSEC_IN_WEEK) {
    return `a few days ago`;
  } else if (diffTime < 2 * MSEC_IN_WEEK) {
    return `a week ago`;
  } else if (diffTime < MSEC_IN_MONTH) {
    return `a few week ago`;
  } else if (diffTime < 2 * MSEC_IN_MONTH) {
    return `a month ago`;
  } else if (diffTime < MSEC_IN_YEAR) {
    return `a few month ago`;
  } else if (diffTime < 2 * MSEC_IN_YEAR) {
    return `a year ago`;
  }
  return `a few year ago`;
};

export const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};


export const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(date, dueDate);
};

export const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};

export const checkDate = (testDate, filter) => {
  const nowDate = new Date();
  if ((filter === StatFilter.TODAY) && isOneDay(nowDate, testDate)) {
    return true;
  }
  if (filter === StatFilter.ALLTIME) {
    return true;
  }
  const nowTime = nowDate.getTime();
  const prevWeekDate = nowTime - MSEC_IN_WEEK;
  const prevMonthDate = nowTime - MSEC_IN_MONTH;
  const prevYearDate = nowTime - MSEC_IN_YEAR;
  const testTime = testDate.getTime();

  if (testTime > prevWeekDate) {
    switch (filter) {
      case StatFilter.WEEK:
      case StatFilter.MONTH:
      case StatFilter.YEAR:
        return true;
      default:
        return false;
    }
  } else if (testTime > prevMonthDate) {
    switch (filter) {
      case StatFilter.MONTH:
      case StatFilter.YEAR:
        return true;
      default:
        return false;
    }
  } else if (testTime > prevYearDate) {
    switch (filter) {
      case StatFilter.YEAR:
        return true;
      default:
        return false;
    }
  }
  return false;
};
