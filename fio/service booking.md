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