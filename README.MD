# 日期组件

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
- [ ] 发布 npm 包

- [ ] 支持 vue
- [ ] 支持多选
