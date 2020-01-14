// date.js
import moment from "moment";
import {StatFilter} from './components/statistics.js';

export const getTime = (date) => {
  return moment(date).utc().format(`hh:mm`);
};

export const formatTime = (date) => {
  const time = getTime(date);
  const ftime = time.slice(2, 3) + `h ` + time.slice(4) + `m`;
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

const MSEC_IN_WEEK = 7 * 24 * 60 * 1000;
const MSEC_IN_MONTH = 31 * 24 * 60 * 1000;
const MSEC_IN_YEAR = 365 * 24 * 60 * 1000;

export const checkDate = (testDate) => {
  const nowDate = new Date();
  if (isOneDay(nowDate, testDate)) {
    return StatFilter.TODAY;
  }
  const prevWeekDate = new Date(nowDate.getTime() - MSEC_IN_WEEK);
  const prevMonthDate = new Date(nowDate.getTime() - MSEC_IN_MONTH);
  const prevYearDate = new Date(nowDate.getTime() - MSEC_IN_YEAR);

  if (testDate > prevYearDate.getTime()) {
    return StatFilter.ALLTIME;
  } else {
    if (testDate > prevMonthDate.getTime()) {
      return StatFilter.YEAR;
    } else {
      if (testDate > prevWeekDate.getTime()) {
        return StatFilter.MONTH;
      }
    }
  }
  return StatFilter.WEEK;
};
