import { genDates, genDateObj, template, formatDate } from "./util";
import {
  DATE_CLASS,
  DATE_ACTIVE_CLASS,
  DATE_TYPE,
  PREV_MONTH,
  NEXT_MONTH,
} from "./const";
import tmpl from "./template.html";

const defaultOptions = {
  value: "",
  renderMonth: [],
  renderFunction: null,
  disableDateFunction: null,
  weeksList: ["日", "一", "二", "三", "四", "五", "六"],
};

class UixCalendar {
  constructor(parentNode, options) {
    // 处理节点
    this.parentNode = parentNode;
    this.ref = document.createElement("div");
    this.ref.className = "uix-calendar";

    // 处理配置
    let opts = Object.assign({}, defaultOptions, options);
    this.options = opts;
    this.value = this.options.value || "";

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
    ``;
    // 生成日历数据
    this.dates = this._genDates(this.year, this.month);
  }

  _genDates(year, month) {
    let dates = genDates(year, month);
    // 处理 isToday
    let today = genDateObj(new Date());
    for (let item of dates) {
      if (
        item.year === today.year &&
        item.month === today.month &&
        item.date === today.date
      ) {
        item.isToday = true;
        break;
      }
    }
    // 处理 disable-date-function
    let disabledCb = this.options.disableDateFunction;
    if (disabledCb) {
      for (let item of dates) {
        let res = disabledCb(item);
        if (res === true) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      }
    }
    // 处理 render-function
    let renderCb = this.options.renderFunction;
    if (renderCb) {
      for (let item of dates) {
        let res = renderCb(item);
        if (typeof res === "string") {
          item.innerHTML = res;
        }
      }
    }
    console.log(dates);
    return dates;
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
    let res = template(tmpl, data);
    return res;
  }

  _initEventListener() {
    let that = this;
    const clickEventMap = {
      prevYear: this.switchToPrevYear,
      nextYear: this.switchToNextYear,
      prevMonth: this.switchToPrevMonth,
      nextMonth: this.switchToNextMonth,
      selectDate: this.selectDate,
    };
    // 点击监听
    this._clickHandler = function (e) {
      let target = e.target;
      let event = target.dataset.clickEvent;
      if (clickEventMap[event]) {
        clickEventMap[event].call(that, target);
      }
    };
    this.ref.addEventListener("click", this._clickHandler);
  }

  render(isFirst = false) {
    let res = this._compileTemplate();
    this.ref.innerHTML = res;

    // viewChange 回调
    let viewChangeCb = this.options.onViewChange;
    viewChangeCb &&
      viewChangeCb(
        {
          year: this.year,
          month: this.month,
        },
        isFirst
      );
  }

  mount() {
    if (!this.ref || !this.parentNode) {
      return false;
    }
    this.render(true);
    this.parentNode.appendChild(this.ref);
    this._initEventListener();
    this.show();
  }

  destroy() {
    this.ref.removeEventListener("click", this._clickHandler);
    this.parentNode.removeChild(this.ref);
    this.ref = null;
    this.parentNode = null;
    this.value = null;
    this.year = null;
    this.month = null;
    this.dates = null;
    this.options = null;
    this._clickHandler = null;
  }

  show() {
    this.ref && (this.ref.style.display = "block");
  }

  hide() {
    this.ref && (this.ref.style.display = "none");
  }

  getDates() {
    return this.dates;
  }

  selectDate(target) {
    let dataset = target.dataset;
    let classList = target.classList;
    let classListArr = Array.from(classList);
    let date = this.dates[dataset.dateIndex];

    if (date.disabled) {
      return false;
    }

    // 处理 value
    if (classListArr.includes(DATE_ACTIVE_CLASS)) {
      this.value = "";
    } else {
      this.value = formatDate(date.year, date.month, date.date);
    }

    // 处理激活/失活样式
    this._handleActiveClass();

    if (date[DATE_TYPE] === PREV_MONTH) {
      this.switchToPrevMonth();
    } else if (date[DATE_TYPE] === NEXT_MONTH) {
      this.switchToNextMonth();
    }

    // 处理回调
    this._emitOnChange(this.value);
  }

  _emitOnChange(value) {
    let onChangeCb = this.options.onChange;
    onChangeCb && onChangeCb(value);
  }

  _handleActiveClass() {
    let dateList = this.ref.querySelectorAll("." + DATE_CLASS);
    Array.from(dateList).forEach((item) => {
      let currDate = this.dates[item.dataset.dateIndex];
      let currVal = formatDate(currDate.year, currDate.month, currDate.date);
      if (this.value === currVal) {
        item.classList.add(DATE_ACTIVE_CLASS);
      } else {
        item.classList.remove(DATE_ACTIVE_CLASS);
      }
    });
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
    this._handleActiveClass();
  }
}

if (window) {
  window.UixCalendar = UixCalendar;
}
export default UixCalendar;
