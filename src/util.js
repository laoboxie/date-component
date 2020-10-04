const PREV_MONTH = "prev";
const CURR_MONTH = "curr";
const NEXT_MONTH = "next";

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
    date.monthType = res.push(genDateObj(date));
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
    res.push(genDateObj(date));
  }
  // 生成下个月的日期
  let count1 = 6 * 7 - res.length;
  for (let i = obj_nextMonthFirstDate.date; i <= count1; i++) {
    let date = newDate(
      obj_nextMonthFirstDate.year,
      obj_nextMonthFirstDate.month,
      i
    );
    res.push(genDateObj(date));
  }

  return res;
}

function newDate(year, month, date) {
  return new Date(year, month - 1, date);
}

function genDateObj(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    day: date.getDay(),
  };
}
