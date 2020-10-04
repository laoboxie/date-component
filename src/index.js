import { genDates } from "./util";
import tmpl from "./template.html";
import tmplEngine from "dot";

const defaultOptions = {
  value: "",
  renderMonth: [],
  renderFunction: null,
  disableDateFunction: null,
  weeksList: ["日", "一", "二", "三", "四", "五", "六"],
};

const PREV_YEAR_CLASS = "js-year-prev";
const NEXT_YEAR_CLASS = "js-year-next";
const PREV_MONTH_CLASS = "js-month-prev";
const NEXT_MONTH_CLASS = "js-month-next";

class UixCalendar {
  constructor(parentNode, options) {
    // 处理节点
    this.parentNode = parentNode;
    this.ref = document.createElement("div");
    this.ref.className = "uix-calendar";

    // 处理配置
    let opts = Object.assign({}, defaultOptions, options);
    this.options = opts;

    // 处理渲染月份数据
    let { renderMonth } = opts;
    if (!Array.isArray(renderMonth) || renderMonth.length !== 2) {
      let now = new Date();
      renderMonth = [now.getFullYear(), now.getMonth() + 1];
    } else {
      this._validateMonth(renderMonth[1]);
    }
    this.year = renderMonth[0];
    this.month = renderMonth[1];

    // 生成日历数据
    this.dates = this._genDates(this.year, this.month);
  }

  _genDates(year, month) {
    return genDates(year, month);
  }

  _validateMonth(month) {
    if (month <= 0 || month >= 13) {
      throw new Error("渲染月份参数校验失败");
    }
  }

  _compileTemplate() {
    let data = {
      weeksList: this.options.weeksList,
      dates: this.dates,
      year: this.year,
      month: this.month,
    };
    let res = tmplEngine.template(tmpl)(data);
    return res;
  }

  _initEventListener() {
    const clickEventMap = {
      prevYear: this.switchToPrevYear,
      nextYear: this.switchToNextYear,
      prevMonth: this.switchToPrevMonth,
      nextMonth: this.switchToNextMonth,
    };
    // 年按钮监听
    let handler = function (e) {
      let target = e.target;
      let classList = Array.from(target.classList);
      let event = target.dataset.clickEvent;
      if (clickEventMap[event]) {
        clickEventMap[event].apply(this);
      }
    };
    this.ref.addEventListener("click", handler.bind(this));
  }

  render() {
    let res = this._compileTemplate();
    this.ref.innerHTML = res;
  }

  mount() {
    // let res = this._genHtml(this.options.weeksList, this.dates);
    this.render();
    this.parentNode.appendChild(this.ref);
    this._initEventListener();
  }

  show() {}

  getDates() {
    return this.dates;
  }

  switchToNextYear() {
    this.year++;
    this.switchToMonth(this.year, this.month);
  }

  switchToPrevYear() {
    this.year--;
    this.switchToMonth(this.year, this.month);
  }

  switchToNextMonth() {
    if (this.month < 12) {
      this.month++;
    } else {
      this.month = 1;
      this.year++;
    }
    this.switchToMonth(this.year, this.month);
  }

  switchToPrevMonth() {
    if (this.month > 1) {
      this.month--;
    } else {
      this.month = 12;
      this.year--;
    }
    this.switchToMonth(this.year, this.month);
  }

  switchToMonth(year, month) {
    this._validateMonth(month);
    this.year = year;
    this.month = month;
    this.dates = this._genDates(year, month);
    this.render();
  }

  _genHtml(weeksList, dates) {
    let row = 0;
    let tbodyHtml = "";
    let rowDates = dates.slice(row * 7, row * 7 + 7);
    while (rowDates.length) {
      tbodyHtml += `
        <tr>
          ${rowDates
            .map((item, index) => {
              return `
                <td class="uix-calendar__date" data-row=${row} data-index=${index}
                  data-year=${item.year} data-month=${item.month}
                  data-date=${item.date} data-month-type=>${
                item.html || item.date
              }</td>
              `;
            })
            .join("\n")}
        </tr>\n
      `;
      row++;
      rowDates = dates.slice(row * 7, row * 7 + 7);
    }
    let html = `
      <div class="uix-calendar">
        <div class="uix-calendar__header">
          <div class="uix-calendar__selector">
            <a href="javascript: 0;" class="uix-calendar__select-btn"><</a>
            <span>2020</span>
            <a href="javascript: 0;" class="uix-calendar__select-btn">></a>
          </div>
          <div class="uix-calendar__selector">
            <a href="javascript: 0;" class="uix-calendar__select-btn"><</a>
            <span>09</span>
            <a href="javascript: 0;" class="uix-calendar__select-btn">></a>
          </div>
        </div>
        <div class="uix-calendar__body">
          <table class="uix-calendar__table">
            <thead>
              <tr>
              ${weeksList
                .map((item) => {
                  return "<th>" + item + "</th>";
                })
                .join("\n")}
              </tr>
            </thead>
            <tbody>
              ${tbodyHtml}
            </tbody>
          </table>
        </div>
      </div>
    
    `;
    return html;
  }
}

if (window) {
  window.UixCalendar = UixCalendar;
}
export default UixCalendar;
