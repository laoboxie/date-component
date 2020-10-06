import { genDates, genDateObj, template, formatDate } from "./util";
import {
  HEADER_CLASS,
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
    try {
      let val = this.options.value;
      if (val) {
        let date = new Date(val);
        this.value = formatDate(
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate()
        );
      } else {
        this.value = "";
      }
    } catch (err) {
      throw new Error("value参数错误：", err);
    }

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

    // 挂载
    this._mount();
  }

  destroy() {
    if (!this.ref) {
      return false;
    }
    this._deleteEventListener();
    this.parentNode.removeChild(this.ref);
    this.ref = null;
    this.parentNode = null;
    this.value = null;
    this.year = null;
    this.month = null;
    this.dates = null;
    this.options = null;
    this._clickHandler = null;
    return true;
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

  switchToMonth(year, month) {
    this._validateMonth(month);
    if (this.year === year && this.month === month) {
      return true;
    }
    if (!this.ref) {
      return false;
    }
    this.year = year;
    this.month = month;
    this.dates = this._genDates(year, month);
    this._render();
  }

  _selectDate(target) {
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
      this._switchToPrevMonth();
    } else if (date[DATE_TYPE] === NEXT_MONTH) {
      this._switchToNextMonth();
    }

    // 处理回调
    this._emitOnChange(this.value);
  }

  _mount() {
    if (!this.ref || !this.parentNode) {
      return false;
    }
    this._render(true);
    this.parentNode.appendChild(this.ref);
    this.show();
    this._initEventListener();
  }

  _render(isFirst = false) {
    let res = this._compileTemplate();
    this.ref.innerHTML = res;

    // this._initEventListener();

    this._handleActiveClass();

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
      prevYear: this._switchToPrevYear,
      nextYear: this._switchToNextYear,
      prevMonth: this._switchToPrevMonth,
      nextMonth: this._switchToNextMonth,
      selectDate: this._selectDate,
    };
    // 点击监听
    this._clickHandler = function (e) {
      let path = e.path;
      let event = null;
      let target = null;
      for (let node of path) {
        let clickEvent = node.dataset && node.dataset.clickEvent;
        if (clickEventMap[clickEvent]) {
          event = clickEventMap[clickEvent];
          target = node;
          break;
        }
      }
      event && event.call(that, target);
    };

    this.ref.addEventListener("click", this._clickHandler);
  }

  _deleteEventListener() {
    this.ref.removeEventListener("click", this._clickHandler);
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

  _switchToNextYear() {
    this.switchToMonth(this.year + 1, this.month);
  }

  _switchToPrevYear() {
    this.switchToMonth(this.year - 1, this.month);
  }

  _switchToNextMonth() {
    if (this.month < 12) {
      this.switchToMonth(this.year, this.month + 1);
    } else {
      this.switchToMonth(this.year + 1, 1);
    }
  }

  _switchToPrevMonth() {
    if (this.month > 1) {
      this.switchToMonth(this.year, this.month - 1);
    } else {
      this.switchToMonth(this.year - 1, 12);
    }
  }
}

export default UixCalendar;
