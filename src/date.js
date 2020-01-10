// date.js
import moment from "moment";

export const formatTime = (date) => {
  const time = moment(date).utc().format(`h:mm`);
  const ftime = time.slice(0, 1) + `h ` + time.slice(2) + `m`;
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
