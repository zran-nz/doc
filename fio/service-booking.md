## service-booking
### service-booking model
```js
packUser: {type: String, required: true}, // service-pack-user._id 用户购买的服务包
packUserData: {type: [String]}, // 关联的次数id列表 service-pack-user-data._id
packUserTasks: {type: [String]}, // 关联的课件id列表
booker: {type: String, required: true}, // user._id 预订人
servicer: {type: String, required: true}, // user._id 服务人
type: {type: String, required: true, enum: Agl.ServiceType}, // 服务类型
mentoringType: {type: String, enum: Agl.MentoringType}, // 辅导类型
oldSession: { // 历史课程
  _id: {type: String}, // session._id
  name: {type: String}, // session.name
  image: {type: String, trim: true},
},
session: {
  // 服务人新排的课程
  _id: {type: String}, // session._id
  name: {type: String}, // session.name
  image: {type: String, trim: true},
  status: {type: String},
},
carer: {
  subject: {type: String}, // 管家服务包预订的时候选择
  hasView: {type: Boolean, default: false}, // 管家服务包排课的时候是否查看过
  used: {type: Boolean, default: false}, // 是否已经用过管家服务
},
start: {type: Date},
end: {type: Date},
duration: {type: Date}, // 服务包对应的时长 service-pack-user.snapshot.duration
times: {type: Number, default: 1}, // 本次预约消耗次数 = (end-start)/duration
// 预约的留言变化：https://github.com/zran-nz/bug/issues/5123
message: {type: String}, // 留言
slides: {
  packUserTask: {type: String}, // 主题lecture包取课件快照service-pack-user.taskSnapshot[x].pages 下的数据
  pages: {type: [Schema.Types.Mixed]}, // 学校所选的ppt对象，公开课捆绑服务包取课堂快照 用oldSession._id 查询session
},
// 留言附件，老师import的时候需要插入到课堂
attachments: [{
  filename: {type: String, trim: true}, // 文件名
  mime: {type: String, trim: true}, // 文件 MIME
  hash: {type: String, trim: true}, // 文件SHA1, files._id
}],
cancel: {type: String, sparse: true, enum: ['servicer', 'booker', 'timeout']}, // 取消身份
canceledAt: {type: Date}, // 取消时间
reminder: {type: Number, default: 0}, // 未排课提醒,0: 待提醒，1: 开课12小时内已提醒
reminderBooked: {type: Number, default: 0}, // 开课前12小时提醒,0: 待提醒，1: 已提醒
accident: {
  id: {type: String}, //teaching-accident._id
  status: {type: String, enum: ['pending', 'approved', 'rejected']}, // 教学事故状态
  tags: {type: [String]}, // 标签
},
servicePackApply: {type: String}, // 主题服务包报名id
serviceAuthId: {type: String}, // service-auth._id from import classcipe cloud, 精品认证课购买后一次性排课
topic: {type: [String]}, // 匹配老师时选择的 topic service-pack-user.snapshot.topic

```



### GET:/service-booking
```js
// 预约列表（预订人看）
await App.service("service-booking").find({query: {tab: 'booker', session: null}})
// 预约列表（服务者看）
await App.service("service-booking").find({query: {tab: 'servicer', session: null}})
```

### service-booking.lag
```js
// 滞后逻辑处理
// 取消对象为servicer和超时的预定数量 / 服务者为自己的所有预定数量 > 1/3 将该服务者拉黑一周
// 在排课超时，服务者取消的时候调用
```

### GET:/service-booking/myHours
```js
// 查看自己的不可用时间
const {
  booking: [[start, end], ...], // 已经被预约的时间段
  session: [[start, end], ...], // 已经排课的时间段
} = await App.service("service-booking").get('myHours')
```

### POST:/service-booking
```js
// 创建预约，扣除服务包次数 service-pack-user.used += service-booking.times
const doc = await App.service("service-booking").create({
  packUser,
  servicer,
  oldSession?: { _id, name, image },
  start, end,
  duration,
  times,
  message,
  attachments: [{
    filename,
    mime,
    hash
  }],
  topic?
});
```

#### 老师/学生 取消预约逻辑

```js
await App.service('service-booking').patch('cancel', {
    _id: serviceBooking._id,
});
```

#### 认证精品课快照 自动排课

```js
await App.service('service-booking').get('importByBooking', { query: { serviceAuthId, bookingId, order: 'order._id' } });
```

#### 替代 find userQuery,可按邮箱/手机/classcipeId 查询

```js
// 查询参数与find一致
// fieldType: {type: String, enum: ['email', 'mobile', 'classcipeId']}
await App.service('service-booking').get('find', { query: { userField: 'email@gmail.com', userFieldType: 'email' } });
```

### 通过 bookingId 批量获取服务包数据

```js
const {bookingId: {topic, packInfo:{}}} = await App.service('service-booking').get('packListByBookingIds',{query:{_id:[...]}})
```


### 获取 booking 中的 lecture 对应的 task 快照

```js
await App.service('service-booking').get('lectureTaskSnapshot', { query: { _id: 'booking._id', packUser: 'booking.packUser' } });
```

### 通过新的预订获取 Lecture 服务包的最后一节结束的预订详情

```js
await App.service('service-booking').get('lectureLastEnd', { query: { _id: 'booking._id' } });
```

### 通过预订 ID 获取辅导课 ID

```js
await App.service('service-booking').get('tutorialPackId', { query: { _id: 'booking._id' } });
```

### 管家服务 import

```js
// 通过管家服务的预订ID 获取关联已经结束的课堂预订数据
const bookingList = await App.service('service-booking').get('byCarer', {query: {_id: bookingId}});
// 点击查看takeaway的时候标记为已经看过
await App.service('service-booking').patch(_id, { 'carer.hasView': true });
// 管家服务import
await App.service('service-booking').get('importCarer', {query: {_id: bookingId, bookings: ['关联的预订_id数组', ...] }});
```

### 认证精品课快照购买支付成功后 自动排课

```js
// 内部接口调用
await this.app.service('service-booking').importByBooking({ serviceAuthId, bookingId }, params);
```