import { genDates } from "./util";
import tpl from "../dist/template.js";

const defaultOptions = {
  value: "",
  renderMonth: [],
  renderFunction: null,
  disableDateFunction: null,
  weeksList: ["日", "一", "二", "三", "四", "五", "六"],
};

class UixCalendar {
  constructor(container, options) {
    this.container = container;
    let opts = Object.assign({}, defaultOptions, options);
    this.options = opts;

    let { renderMonth } = opts;
    if (!Array.isArray(renderMonth) || renderMonth.length !== 2) {
      let now = new Date();
      renderMonth = [now.getFullYear(), now.getMonth() + 1];
    } else {
      this._validateMonth(renderMonth[1]);
    }
    this.renderMonth = renderMonth;
    this.dates = this._genDates(renderMonth[0], renderMonth[1]);
    // this._compileTemplate();
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
    console.log(this.dates);
    tpl({
      weeksList: this.options.weeksList,
      dates: this.dates,
    });
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

  mount() {
    let res = this._genHtml(this.options.weeksList, this.dates);
    this.container.innerHTML = res;
  }

  show() {}

  getDates() {
    return this.dates;
  }

  switchViewToMonth(year, month) {
    this._validateMonth(month);
    this.renderMonth = [year, month];
    this.dates = this._genDates(renderMonth[0], renderMonth[1]);
  }
}

if (window) {
  window.UixCalendar = UixCalendar;
}
export default UixCalendar;
