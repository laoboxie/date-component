# 日期组件

## 属性

| 属性名                | 类型         | 默认值 | 默认值                                                                        |
| :-------------------- | :----------- | :----- | :---------------------------------------------------------------------------- |
| value                 | string/array |        | 当前选中日期，使用 v-model 绑定。值为字符串时表示单选日期，为数组时表示多选。 |
| render-month          | array        |        | 指定渲染日期，如 [2018, 8]                                                    |
| render-function       | function     |        | 用于为特定日期添加额外的 html 内容，参数为(行 index,列 index,日期详细属性)    |
| disable-date-function | function     |        | 自定义标记特定日期是否应该禁用，返回 true 表示禁用，false 表示不禁用          |
| weeks-list            | array        |        | 星期列表，从周日开始                                                          |
| return-six-rows       | boolean      | true   | 是否总是渲染 6 行日期                                                         |

## 事件

| 名字            | 参数          | 说明                                                                                             |
| :-------------- | :------------ | :----------------------------------------------------------------------------------------------- |
| @on-change      |               | 值变化时触发                                                                                     |
| @on-view-change | (data, index) | 渲染月份变化时触发。初始化时会触发一次，如果不希望处理初始化时的触发，可以检查第二个参数是否为 0 |

## 方法

| 名字              | 参数          | 说明             |
| :---------------- | :------------ | :--------------- |
| getDates          |               | 获取当前日期列表 |
| switchViewToMonth | (year, month) | 渲染特定年月日期 |

# TODO

- [x] 生成日期列表
- [x] 搭建本地开发环境

- [ ] 完善功能，包括属性、事件、方法
- [ ] 抽离 css 样式
- [ ] 抽离 html
- [ ] jest 测试
- [ ] 发布 npm 包

- [ ] 支持 vue
- [ ] 支持多选