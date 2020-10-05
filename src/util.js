import { DATE_TYPE, PREV_MONTH, CURR_MONTH, NEXT_MONTH } from "./const";

import dot from "dot";
dot.templateSettings = {
  evaluate: /\{\{([\s\S]+?)\}\}/g,
  interpolate: /\{\{=([\s\S]+?)\}\}/g,
  encode: /\{\{!([\s\S]+?)\}\}/g,
  use: /\{\{#([\s\S]+?)\}\}/g,
  define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
  conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
  iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
  varname: "it",
  strip: true,
  append: true,
  selfcontained: false,
};

export function genDates(year, month) {
  let res = [];
  let currMonthFirstDate = newDate(year, month, 1);
  let currMonthLastDate = newDate(year, month + 1, 0);
  let prevMonthLastDate = newDate(year, month, 0);
  let nextMonthFirstDate = newDate(year, month + 1, 1);

  let obj_currMonthFirstDate = genDateObj(currMonthFirstDate);
  let obj_currMonthLastDate = genDateObj(currMonthLastDate);
  let obj_prevMonthLastDate = genDateObj(prevMonthLastDate);
  let obj_nextMonthFirstDate = genDateObj(nextMonthFirstDate);

  // 生成上个月的日期
  let count = obj_currMonthFirstDate.day;
  for (let i = 0; i < count; i++) {
    let date = newDate(
      obj_prevMonthLastDate.year,
      obj_prevMonthLastDate.month,
      obj_prevMonthLastDate.date - count + i + 1
    );
    date = genDateObj(date);
    date[DATE_TYPE] = PREV_MONTH;
    res.push(date);
  }
  // 生成当前月的日期
  for (
    let i = obj_currMonthFirstDate.date;
    i <= obj_currMonthLastDate.date;
    i++
  ) {
    let date = newDate(
      obj_currMonthFirstDate.year,
      obj_currMonthFirstDate.month,
      i
    );
    date = genDateObj(date);
    date[DATE_TYPE] = CURR_MONTH;
    res.push(date);
  }
  // 生成下个月的日期
  let count1 = 6 * 7 - res.length;
  for (let i = obj_nextMonthFirstDate.date; i <= count1; i++) {
    let date = newDate(
      obj_nextMonthFirstDate.year,
      obj_nextMonthFirstDate.month,
      i
    );
    date = genDateObj(date);
    date[DATE_TYPE] = NEXT_MONTH;
    res.push(date);
  }
  return res;
}

function newDate(year, month, date) {
  return new Date(year, month - 1, date);
}

export function genDateObj(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    day: date.getDay(),
    fullDate: date,
  };
}

export function formatDate(year, month, date, joinSym = "/") {
  return (
    String(year) +
    joinSym +
    String(month).padStart(2, "00") +
    joinSym +
    String(date).padStart(2, "00")
  );
}

export function template(tmpl, data) {
  return dot.template(tmpl)(data);
}
