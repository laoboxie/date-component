import UixCalendar from "../dist/index";

let instance = new UixCalendar(document.body, {
  value: "2020-10-15",
  renderMonth: [2020, 10],
  onChange: function (value) {},
  onViewChange: function (data, isFirst) {},
  disableDateFunction: function (data) {
    let now = new Date("2020/10/6");
    if (data.fullDate < now) {
      return true;
    } else {
      return false;
    }
  },
  renderFunction: function (data) {
    return `<div><div>${data.date}</div><div>自定义</div></div>`;
  },
});

let calendar = document.body.children[0];

test("测试UI：年份", () => {
  let year = calendar.querySelector(".uix-calendar__curr-year").innerHTML;
  expect(year).toEqual("2020");
});

test("测试UI：月份", () => {
  let month = calendar.querySelector(".uix-calendar__curr-month").innerHTML;
  expect(month).toEqual("10");
});

test("测试UI：选中日期", () => {
  let activeEle = calendar.querySelector(".uix-calendar__date--active");
  let index = activeEle.dataset["dateIndex"];
  let dateObj = instance.getDates()[index];
  expect(dateObj.date).toEqual(15);
});

test("测试UI：禁用日期-disableDateFunction", () => {
  let disabledList = calendar.querySelectorAll(".uix-calendar__date--disabled");
  expect(disabledList.length).toEqual(9);
});

test("测试UI：renderFunction", () => {
  let activeEle = calendar.querySelector(".uix-calendar__date--active");
  expect(activeEle.innerHTML.trim()).toEqual(
    `<div><div>15</div><div>自定义</div></div>`
  );
});
