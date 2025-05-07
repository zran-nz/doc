## service-conf


### GET:/service-conf/:id
```js
// 查看老师的可用时间，与不可用时间
const {
  _id: '', // users._id
  introduction: '', // 介绍
  rating: 4.5, // 评分
  hours: [[start, end], ...], // 一周可以预约的时间段
  holiday: [[start, end], ...], // 假日日期范围
  booking: [[start, end], ...], // 已经被预约的时间段
  session: [[start, end], ...], // 已经排课的时间段
} = await App.service("service-conf").get('user._id', {query: {booking: 1, session: 1}})
```