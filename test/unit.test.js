import { genDates, formatDate, template } from "../src/util";

test("测试方法：genDates", () => {
  let dates = genDates(2020, 10);
  expect(dates[0]).toEqual({
    year: 2020,
    month: 9,
    date: 27,
    day: 0,
    fullDate: new Date(2020, 8, 27),
    dateType: 1,
  });
  expect(dates[4]).toEqual({
    year: 2020,
    month: 10,
    date: 1,
    day: 4,
    fullDate: new Date(2020, 9, 1),
    dateType: 2,
  });
  expect(dates[41]).toEqual({
    year: 2020,
    month: 11,
    date: 7,
    day: 6,
    fullDate: new Date(2020, 10, 7),
    dateType: 3,
  });
});

test("测试方法：formatDate", () => {
  expect(formatDate(2020, 1, 5)).toEqual("2020/01/05");
  expect(formatDate(2020, 10, 5)).toEqual("2020/10/05");
  expect(formatDate(2020, 12, 25)).toEqual("2020/12/25");
  expect(formatDate(2020, 12, 25, "-")).toEqual("2020-12-25");
});

test("测试方法：template", () => {
  expect(
    template(`<span>{{=it.year}}</span>`, {
      year: 2020,
    })
  ).toEqual("<span>2020</span>");
});
