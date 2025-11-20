## service-conf

## 用户服务配置

### service-conf model

```js
rating: {type: Number}, // 好评
introduction: {type: String, trim: true}, // 自我介绍
audio: {type: String, trim: true}, // 音频文件 hash files._id
audioTime: {type: Number}, // 音频时长（秒）
hours: {type: [[Date]]}, // 一周服务可用时间段 [[start, end], ...]
// validDate: {type: [[Date]]}, // 有效日期, 当前用户的一天的开始时间, 格式: [[start, end], ...]
holiday: {type: [[Date]]}, // 假日日期,  格式: [[start, end], ...]
enable: {type: Schema.Types.Mixed}, // 服务启用状态, {[`${type}${mentoringType}`]: true, ...}
serviceRoles: {type: [String], enum: Agl.ServiceRoles, default: Agl.ServiceRoles}, // 可以服务的项目 #4586
fans: {type: Number, default: 0}, // 收藏的数量
// 以下字段用于索引，数据在更新的时候自动生成
// hoursIndex: {type: [[String]]}, // 自动生成，用于时间段匹配查询
/**
 * Array of time indexes storing availability for a week.
 * Each index represents a 5-minute slot (range: 0–2016).
 *
 * Calculation:
 *   Total minutes in a week = 24 * 60 * 7 = 10080
 *   Number of 5-minute slots = 10080 / 5 = 2016
 *
 * Example:
 *   0   → Sunday 00:00
 *   1   → Sunday 00:05
 *   ...
 *   2015 → Saturday 23:55
 *
 */
hoursIndex: {type: Array},
hoursMax: {type: Number}, // 取最大时间段的分钟数，用于查询老师
/*
按服务包的认证项 认证通过时间来排序 #4455
认证项: 认证通过时间
*/
sort: {type: Schema.Types.Mixed},
// 滞后显示：若老师terminate/cancel了超过1/3的被预约辅导课
lag: {type: Boolean, default: false}, // (cancel+terminate)/booking > 1/3
lastAuth: {type: Date}, // 最新认证的时间 service-auth 下认证通过后关联更新，只用于排序
count: {
  rate: {type: Number, default: 0}, // 好评，比率 ＝ 1-(count.accident/count.rating)
  rating: {type: Number, default: 0}, // 总的评价次数
  accident: {type: Number, default: 0}, // 教学事故次数
  booking: {type: Number, default: 0}, // 每收到预约 +1
  cancel: {type: Number, default: 0}, // 取消一次 +1
  terminate: {type: Number, default: 0}, //
},
// -- for campus verification
country: {type: String, trim: true},
city: {type: String, trim: true},
address: {type: String, trim: true}, //地址
place_id: {type: String, trim: true}, // google地点id
location: {
  type: {
    type: String,
    enum: ['Point'],
  },
  coordinates: {
    type: [Number],
  },
},
serviceRadius: {type: Number}, // in meters
// physical address
attachmentsAddress: {
  filename: {type: String, trim: true}, // 文件名
  mime: {type: String, trim: true}, // 文件 MIME
  hash: {type: String, trim: true}, // 文件SHA1, files._id
},
// Police vetting
attachmentsVetting: {
  filename: {type: String, trim: true}, // 文件名
  mime: {type: String, trim: true}, // 文件 MIME
  hash: {type: String, trim: true}, // 文件SHA1, files._id
},
vettingDate: {type: Date},
vettingReminder: {type: Boolean, default: false}, // 审批过期时间少于30天提醒
vettingExpiredReminder: {type: Boolean, default: false}, // 审批已过期提醒
// campus verification end

status: {type: Number, default: 0}, // 0: 未申请/Apply verification, 1:申请中/Under processing, 2: 通过/Verified, -1: 拒绝/Under processing
feedback: {
  // 留言反馈
  message: {type: String}, // 用户留言内容
  date: {type: Date}, // 留言时间
  read: {type: Boolean, default: false}, // read status
  reply: {type: String}, // 后台回复内容
  replyDate: {type: Date},
  replyRead: {type: Boolean, default: false}, // read status
},
reason: {type: String, trim: true},
inviter: {type: String, trim: true}, //分享人
inviterUpdatedAt: {type: Date}, // 分享人更新时间
```

### 用户服务配置接口

```js
// 获取用户的服务配置
const doc = await App.service("service-conf").get(pub.user._id).catch(async (e) => {
  if(e.code === 404) return await App.service("service-conf").create({_id: pub.user._id, hours: []})
})
// 设置一周服务可用时间, 格式
await App.service("service-conf").patch(pub.user._id, {hours: [[start, end], ['2024-01-18T05:00:00.000Z', '2024-01-18T12:00:00.000Z'], ...]})
// 设置假日日期, 当前用户的一天的开始时间
await App.service("service-conf").patch(pub.user._id, {holiday:  [[start, end], ['2024-01-18T05:00:00.000Z', '2024-01-18T12:00:00.000Z'], ...]})

```

### 启用/禁用服务

```js
// 启用服务
await App.service("service-conf").patch(pub.user._id, {[`enable.${type}:${mentoringType}`]: true]})
// 禁用服务
await App.service("service-conf").patch(pub.user._id, {[`enable.${type}:${mentoringType}`]: false]})
```

### 查找可预约的老师列表

```js
// 可预约的老师列表 通过服务包查找
const {
  total, limit, skip,
  data: [{
    rating,
    introduction,
    audio,
    audioTime,
    hours,
    holiday,
    enable,
    owner: {_id, name, avatar, email},
    auths: [{ // 已认证的服务项目
      type, mentoringType, countryCode, curriculum, subject, gradeGroup
    }, ...]
  }, ...]
} = await App.service('service-conf').get('teachersByPack', {query: {
  search: 'xxx', // users.name 老师名称
  packUserId: 'servive-pack-user._id',
  subject?: [],
  topic?: [],
  hours?: [start, end], // 按指定时间段查询老师
  gradeGroup?: ['', ...], // 按年级段过滤老师，不传则以服务包限制为准
  $sort: { // 排序, 值为 1 或 -1
    fans?, // 按粉丝
    'count.rate'? // 按好评比率
  }
}})
```

### 批量查询多个老师最近几天，每日可预约的次数

```js
// 批量查询多个老师最近几天的冲突时间段
const {
  booking: [{
    servicer, start, end
  }],
  session: [{
    uid, start, end
  }]
} = await App.service('service-conf').get('recentDaysHours', query: {uid: ['xxx', ...], days: 14})

// 批量计算多个老师的最近几日可预约次数
confStore.getRecentDays(data: 找老师接口列表的数据, days: 天数, blockTime: 预订多少分钟的课)
data: [{_id, hoursIndex, ...}, ...]

// 这里是例子，实际需要通过找老师接口获取老师列表
const rs = await App.service('service-conf').find({query: {$sort: {_id: -1}}})
// 批量计算可用次数
const list = await confStore.getRecentDays(rs.data, 10, 60)
console.log(list)
list: {[uid]: {[day]: count, ...}, ...}
```

### 线下助教 个体用户线下服务认证

```js
service-conf._id=uid
// 地址必须是从google接口搜索出来的,且必须要带该地址的place_id
// google地址获取接口:/fio/maps/address/${country}?q=${query} 参考web-PubSelect-find的city获取
await App.service('service-conf').patch('_id', {
    address: 'desc',
    place_id: 'place_id',
});
```

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
