# 日历组件

一款简单的日历组件，原生 JS/CSS 开发，适用与移动端和 PC 端，支持自定义渲染日期 HTML。

## 使用方式

### npm

```shell
npm i uix-calendar --save
```

```javascript
import Calendar from "uix-calendar";
import "uix-calendar/dist/index.css"; // 提供默认样式，可以自定义开发所需样式

var c = new Calendar(document.body);
```

### script

```javascript
<script src="/dist/index.js"></script>

<script>
var c = new UixCalendar(document.body)
</script>
```

### 创建实例

```javascript
/**
 * parentEle: 必填，组件挂载在parentEle下面
 * options: 选填，具体配置看配置选项
 * 具体使用方式可以看 /example/index.html
 **/
new UixCalendar(parentEle, options);
```

```javascript
let instance = new UixCalendar(documnt.body, {
  value: "2020-10-15",
  // renderMonth: [2021, 10],
  weeksList: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  onChange: function (value) {
    console.log("onChange", value);
  },
  onViewChange: function (data, isFirst) {
    console.log("onViewChange", data, isFirst);
  },
  disableDateFunction: function (data) {
    console.log("disableDateFunction");
    let now = new Date() - 24 * 60 * 60 * 1000;
    if (data.fullDate < now) {
      return true;
    } else {
      return false;
    }
  },
  renderFunction: function (data) {
    return `
            <div class="my-date-box">
              <div class="my-date">${data.date}</div>
              <div class="my-price">￥${100 + data.date}</div>
            </div>
          `;
  },
});

instance.getDates();
instance.switchToMonth(2030, 1);
instance.show();
instance.hide();
instance.destroy();
```

## 配置选项

| 属性名              | 类型               | 默认值            | 默认值                                 |
| :------------------ | :----------------- | :---------------- | :------------------------------------- |
| value               | string             |                   | 当前选中日期，格式"YYYY/MM/DD"         |
| renderMonth         | array              |                   | 指定渲染日期，如 [2018, 8]             |
| renderFunction      | function(日期属性) |                   | 自定义日期的 html 内容，返回 innerHTML |
| disableDateFunction | function(日期属性) |                   | 自定义日期是否禁用，返回 true/false    |
| weeksList           | array              | ["日", "一", ...] | 星期列表，从周日开始                   |

## 事件

| 名字         | 参数            | 说明                                                  |
| :----------- | :-------------- | :---------------------------------------------------- |
| onChange     |                 | 值变化时触发                                          |
| onViewChange | (data, isFirst) | 渲染月份变化时触发。初始化会触发一次，isFirst 为 true |

## 方法

| 名字          | 参数          | 说明                  |
| :------------ | :------------ | :-------------------- |
| getDates      |               | 获取当前日期列表      |
| switchToMonth | (year, month) | 渲染特定年月日期      |
| show          |               | 显示，display: block; |
| hide          |               | 隐藏，display: node;  |
| destroy       |               | 销毁                  |

# TODO

- [x] 搭建本地开发环境
- [x] 完善功能，包括属性、事件、方法
- [x] 抽离 css 样式
- [x] 抽离 html
- [x] jest 测试
- [x] 发布 npm 包
- [ ] 支持 vue
- [ ] 支持多选日期
