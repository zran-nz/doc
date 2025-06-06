## service-pack-user-data

### service-pack-user-data model

```js
packUser: {type: String, required: true}, // 关联购买的服务包 service-pack-user._id
expired: {type: Date}, // 过期列表
status: {type: Number, default: 0}, // 状态 0: 可用，-1: 过期, 1: 被使用
gift: {type: Boolean, default: false}, // 是否赠品
order: {type: String, trim: true}, // 关联 order
serviceTicket: {type: String, trim: true}, // 关联 service-pack-ticket._id
payMethod: {type: String, trim: true}, // 支付方式
```

### service-pack-user-data:add
```js
// 批量增加次数数据
this.app.service('service-pack-user-data').add({
  packUser,
  packUserData,
  packUserTasks, // Lecture包复购的课件id数组
  isNew = false,
  order,
  payMethod,
  type = 'order',
  times = 1,
  servicer,
  oldSession,
  start,
  isPromotion = false,
  serviceTicket,
  isClaim = false,
})
```

### service-pack-user-data:used
```js
// 扣取次数, 同时更新最近过期的卡
this.app.service('service-pack-user-data').used({booking, packUser, order, times = 1, type, servicer, oldSession, start, serviceTicket, isClaim = false})
```

