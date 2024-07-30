## Service

### 服务整体关系

```mermaid
graph LR
  T(系统后台) --> SConf(服务设置) --选择可申请数据--> SConf2(可用服务设置)
  T --可用服务--> SAuth(服务认证管理)
  T --> SP(服务包管理)
  SP -- 添加服务包 --> SPack{服务包}
  SPack -- 发布 --> Pack{商品<br>Featured}
	Pack2(商品) --学生购买--> StuPack(我的服务包)
StuPack --BookNow--> StuPackD(服务包使用情况<br>预约列表)
StuPackD --开始预约--> Teacher(老师列表)
StuPackD --捆绑精品课--> PTask(精品课列表)
PTask --> Teacher
Teacher --确认预约--> Booking(我的预约)

```

### 服务认证申请

```mermaid
graph LR
    T(个人服务认证) --> P(个人介绍)
    T --> S(服务时间)
    S --> S1(一周的可用时段)
    S1 --> S2(接单日期范围)
    S1 --> S3(假日日期范围)
    T --> C(服务认证列表)
    C --> W(公开课)
    W --> W1[curriculum...]
    W1 --> W11(认证申请)
    W --> W2[Service]
    W2 --> W3[Overseas study<br>Essay<br>Teacher training]
    W3 --> W11(认证申请)
    C --> C2(批改作业<br>Correcting)
    C --> C3(代课服务<br>Substitute)
    C3 --> C20(大纲)
    C2 --> C20(大纲)
    C20 --> C21(学科...)
    C21 --> C212(年级选择)
    C21 --> C211(认证申请)
    C20 --> C22(添加学科)
    C --> C4(辅导服务<br>Mentoring)
    C4 --> C41(Overseas study)
    C4 --> C42(Teacher training)
    C4 --> C43(Academic)
    C4 --> C44(Essay)
    C42 --> C421(大纲一级数据)
    C44 --> C441(大纲二级数据)
```

## 服务设置

### 服务设置接口

```js
// 批量获取
const [...] = await App.service('conf').get(`Service:${type}:.*`)

// 获取
await App.service("conf").get(`Service:${type}:${mentoringType}`).catch(e => {
  if (e.code === 404) return await App.service("conf").create({_id: `Service:${type}:${mentoringType}`, val: {}})
})
// 更新
await App.service("conf").patch(`Service:${type}:${mentoringType}`, {
  val: {
    desc: '', // 申请描述
    countryCode: [], // 国家代码
    curriculum: [{
      code: '', // 大纲代码
      subject: [], // 学科
    }],
    topic: [{
      _id: '',
      label: ['level 1', 'level 2', ...]
    }, ...],
    attachmentType: ['', ...], // 前端固定，附件类型, 用于 service-auth.attachments.type
    hourRate: [{ // 小时工资
      price: '1500',
      value: ['xxx', ...], // 二级数据（学科/topic）
      default: true, // 是否默认
      qualification: '', // 资质
      curriculum?: '', // 大纲
      topic?: ''
    }]
  }
});
// 精品课认证设置更新
await App.service("conf").patch(`Service:${type}`, {
  val: {
    '服务类型': {
      desc: '', // 申请描述
    }
  }
}
```

## 服务认证

### Enum

```js
ServiceRoles: ['mentoring', 'substitute', 'correcting', 'consultant', 'mentorSystem'],
ServiceType: ['workshop', 'content', 'teaching', 'mentoring', 'correcting', 'substituteAcademic', 'substituteService'],
MentoringType: [
  'essay',
  'academic',
  'overseasStudy',
  'teacherTraining',
  'teacherTrainingSubject',
  'steam',
  'academicPlanning',
  'personalStatement',
  'interest',
],
ConsultantType: ['carer', 'interview'],
ServicePackUserType: ['order', 'booking', 'cancel', 'timeout', 'expired', 'refund', 'teachingAccident', 'gift', 'point', 'cash'],
ServicePackVideoType: ['AcademicValue', 'Features', 'QA'],
ServiceSalesTarget: ['personal', 'school'],

```

### service-auth model

```js
uid: {type: String, required: true},
type: {type: String, required: true, enum: Agl.ServiceType}, // 服务类型
mentoringType: {type: String, enum: Agl.MentoringType}, // 辅导类型
enable: {type: Boolean, default: true}, // 是否启用
countryCode: {type: String, trim: true}, // 国家代码
curriculum: {type: String, trim: true}, // 大纲代码 or 自定义的大纲_id
subject: {type: String, trim: true}, // 学科_id
gradeGroup: {type: [String], trim: true}, // 年级组
grades: {type: [String], trim: true}, // 实际年级
tags: {type: [String], trim: true}, // 标签
unit: { // 认证课件
  _id: {type: String, trim: true}, // unit._id
  name: {type: String, trim: true}, // 课件名称
},
ability: {type: String, trim: true}, // 学习能力 https://github.com/zran-nz/bug/issues/5030
styles: {type: [String], trim: true}, // 认知风格
otherStyles: {type: [String], trim: true}, // 其他风格
unitSnapshot: {type: Schema.Types.Mixed}, // 认证unit快照 https://github.com/zran-nz/bug/issues/4861
linkSnapshot: {type: Schema.Types.Mixed}, // unitl link 的课件快照列表
topic: [{ // 用于 essay, teacherTraining等大纲层级 认证项
  _id: {type: String, trim: true}, // subjects.topic..._id
  label: {type: [String], trim: true}, // subjects.topic...name
}],
desc: {type: String, trim: true}, // 描述
status: {type: Number, default: 0}, // 0: 未申请, 1:申请中, 2: 通过, -1: 拒绝
attachments: [{ // 附件
  filename: {type: String, trim: true}, // 文件名
  mime: {type: String, trim: true}, // 文件 MIME
  hash: {type: String, trim: true}, // 文件SHA1, files._id
  date: {type: Date}, // 上传时间
  type: {type: String, trim: true}, // 认证类型, conf.val.attachmentType
  size: {type: Number}, // 文件大小
}],
versionId: {type: String, trim: true}, // 版本 #4846
reason: {type: String, trim: true}, // 原因
inviter: {type: String, trim: true}, //分享人
qualification: {type: String, trim: true}, // 审核时候选的资质 #4864
```

### 服务认证接口（仅限当前用户）

```js
// 系统后台 服务认证类型数量统计
const [{
  _id: {type, mentoringType, status}, count: 1
}, ...] = await App.service("service-auth").get("countType");

// 服务认证列表（系统后台）
await App.service("service-auth").find({query: {$sys: 1, ...}});

// 服务认证列表（用户查看自己的）
await App.service("service-auth").find({query: {}});
// 已认证列表
await App.service("service-auth").find({ query: { status: 2 } });
// 生成课件快照，在选择课件之后，申请之前请求
await App.service("service-auth").get('unitSnapshot', {query: {_id: 'service-auth._id', unit: 'unit._id'}})
// 提交申请
await App.service("service-auth").patch(doc._id, { status: 1 });
// 审批申请
await App.service("service-auth").patch(doc._id, {
  status: 2 / -1,
  reason: "",
});
```

### 精品课认证数据查询

```js
// 查询参数参考 service-auth model
await App.service('service-auth').get('unit', query: {
  countryCode?, // 国家代码
  curriculum?, // 大纲代码 or 自定义的大纲_id
  subject?, // 学科_id
  gradeGroup?, // 年级组
  ...
})

```

### 服务认证接口（任何人）

```js
// 查询某个老师的已认证列表
await App.service('service-auth').get('listByUid', {
    query: { uid: 'user._id' },
});
```

### 服务认证日期范围查询

```js
await App.service("service-auth").find({
  query: { dateRange: [start, end, zone?] },
});
```

## 用户服务配置

### service-conf model

```js
rating: {type: Number}, // 好评
count: {
  rate: {type: Number}, // 好评，比率 ＝ 1-(count.accident/count.rating)
  rating: {type: Number}, // 总的评价次数
  accident: {type: Number}, // 教学事故次数
},
introduction: {type: String, trim: true}, // 自我介绍
audio: {type: String, trim: true}, // 音频文件 hash files._id
audioTime: {type: Number}, // 音频时长（秒）
hours: {type: [[Date, Date], ...], required: true}, // 一周服务可用时间段, [[start, end], [Date, Date], ...]
holiday: {type: [[Date, Date], ...], required: true}, // 假日日期, 格式: [[start, end], [Date, Date], ...]
enable: {type: Schema.Types.Mixed}, // 服务启用状态, {[`${type}:${mentoringType}`]: true, ...}
serviceRoles: {type: [String], enum: Agl.ServiceRoles}, // 可以服务的项目 #4586
fans: {type: Number, default: 0}, // 收藏的数量
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
  hours?: [start, end], // 按指定时间段查询老师
  gradeGroup?: ['', ...], // 按年级段过滤老师，不传则以服务包限制为准
  $sort: { // 排序, 值为 1 或 -1
    fans?, // 按粉丝
    'count.rate'? // 按好评比率
  }
}})
```

## 服务包

### service-pack model

```js
name: {type: String, trim: true}, // 服务包名称
cover: {type: String, trim: true}, // files._id
coverName: {type: String, trim: true}, // 图片名称
points: {type: [String], trim: true}, // selling points
type: {type: String, required: true, enum: Agl.ServiceType}, // 服务类型
serviceRoles: {type: String, enum: Agl.ServiceRoles}, // 服务角色
mentoringType: {type: String, enum: Agl.MentoringType}, // 辅导类型
countryCode: {type: [String], trim: true}, // 国家代码
curriculum: {type: String, trim: true}, // curriculum.code
subject: {type: [String], trim: true}, // subjects._id
gradeGroup: {type: [String], trim: true}, // 年级组
qualification: {type: String, trim: true}, // 服务包需要的资质
consultant: { // 顾问配置
  type: {type: String, enum: Agl.ConsultantType}, // 顾问类型
  servicePack: {type: String}, // 捆绑的服务包, service-pack._id 服务包id
},
// 主题服务包
contentOrientatedEnable: {type: Boolean, default: false}, // type === 'mentoring' 专用
contentOrientated: [{
  premium: {type: String}, // contentOrientated === true 才有，取认证过的精品课
  times: {type: Number}, // 最少授课次数，必须大于0
  price: {type: Number, trim: true}, // 单次价格 *100，cc，美分
  schoolPrice: {type: Number, trim: true}, // 给机构的价格 单次价格 *100，cc，美分
  servicePack: {type: String}, // 捆绑的服务包, service-pack._id 服务包id
}],
interviewPack: {type: String}, // 面试捆绑的服务包, service-pack._id 服务包id
carerPack: {type: String}, // 管家捆绑的服务包, service-pack._id 服务包id
price: {type: Number, trim: true}, // 单次价格 *100，cc，美分
discount: [{
  count: {type: Number}, // 数量
  discount: {type: Number}, // 折扣 %
  gifts: {type: Number, default: 0}, // 免费赠送的次数
}],
discountConfig: { // 折扣配置
  enable: {type: Boolean, default: false}, // 是否启用折扣
  end: {type: Date} // 折扣截止时间
  discount: {type: Number}, // 主题服务包 统一折扣 %
},
freq: {type: Number, enum: [7, 14, 30, 120]}, // 每张的可用多少天
duration: {type: Number}, // session duration min
break: {type: Number}, // session break min
status: {type: Boolean, default: false}, // 发布状态
lastPublished: {type: Date}, // 上次发布时间
count: { // 统计
  sold: {type: Number}, // 已售
  valid: {type: Number}, // 有效数量
},
attachments: [{ // 图片/视频，附件，推广素材, 插入到课堂的时候，显示在素材中
  filename: {type: String, trim: true}, // 文件名
  mime: {type: String, trim: true}, // 文件 MIME
  hash: {type: String, trim: true}, // 文件SHA1, files._id
  videoType: {type: String, Agl.ServicePackVideoType}, // 视频的类型
}],
income: {type: Number, default: 0}, //收入总计,单位分
statistic: [
  {
    count: {type: Number}, // 数量 服务包次数
    orderCount: {type: Number, default: 0}, // 订单购买次数
  },
],
salesTarget: {type: [String], enum: Agl.ServiceSalesTarget}, // 销售目标
backgroundCheck: {type: Boolean, default: false}, // academic 是否启用背景审查
requirements: {type: String, default: false}, // academic 是否启用背景审查描述
requirementsItems: {type: [String]}, // academic requirements 二级数据
interview: {type: Boolean, default: false}, // 是否启用面试
splitSale: {type: Boolean, default: false}, // 是否可以分拆卖
filled: {type: Boolean, default: false}, // All forms have been filled
reason: {type: String}, // 下架原因
keywords: {type: [String]}, // 关键词搜索用，[subject, topic, ...]
```

### 服务包接口

```js
// 发布服务
await App.service('service-pack').patch(doc._id, { status: true });
// 下架服务
await App.service('service-pack').patch(doc._id, { sta.tus: false });
// 服务包列表（后台）
await App.service('service-pack').find({ query: {} });

// 服务包列表（featured）
await App.service('service-pack').find({ query: { status: true } });
```

### 服务包统计

```js
const {
  mentoringType: {
    'mentoringType': 3, ....
  }
  curriculum: {
    'curriculum': 2, ...
  },
  subject: {
    'subject._id': 4, ...
  }
} = await App.service('service-pack').get('groups')
```

### 服务包视频

```js
// 单个添加
await App.service('service-pack').patch(doc._id, {
    $addToSet: { attachments: { filename, mime, hash, videoType } },
});

// 单个删除
await App.service('service-pack').patch(doc._id, {
    $pull: { attachments: { _id: doc.attachments[x]._id } },
});
```

### 服务包推荐

```js
// 老师取 "teacherTraining"的数据, 学生取非"teacherTraining"的数据
await App.service('service-pack').get('index');
```

### 统计认证老师数量

```js
const {
  countryCode: { 'AU': [{...}], ...},
  curriculum: { 'au': [{...}], ...},
  subject: { '64d99bcc0476f7faf45ef0d8': [{...}], ...},
  gradeGroup: { 'Intermediate': [{...}], ...},
  topic: {'topic._id': [{...}], ...}
} = await App.service("service-auth").get("groups", { query: { type, mentoringType?, curriculum?, countryCode?, subject?, gradeGroup?, 'topic._id'? } });

// const {
//   curriculum: { 'au': {-1: 0, 0: 1, 1: 1, 2: 1}, ...},
//   gradeGroup: { 'Intermediate': {-1: 0, 0: 1, 1: 1, 2: 1}, ...},
//   subject: { '64d99bcc0476f7faf45ef0d8': {-1: 0, 0: 1, 1: 1, 2: 1}, ...},
//   countryCode: { 'AU': {-1: 0, 0: 1, 1: 1, 2: 1}, ...},
// } = await App.service("service-auth").get("stats", { query: { type, mentoringType? } });
```

### 老师发布公开课捆绑服务包

```js
await App.service("serssion").create({
  ...,
  premium: true/false, // 是否为精品公开课
  promotion: true/false, // 是否为推广课
  servicePack: {
    _id: '', // service-pack._id 服务包的id
    times, // live直播课的数量
    price, // 美分，服务包价格 = service-pack.discount 折扣 * live直播课的数量
  },
});
```

## 用户购买的服务包

### service-pack-user model

```js
uid: {type: String}, // users._id
price: {type: Number, default: 0}, // 订单金额
payCount: {type: Number, default: 0}, // 购买可退次数，不可修改
gift: {type: Boolean, default: false}, // 是否赠品, 只要服务包付了钱的都不是赠品
giftCount: {type: Number, default: 0}, // 赠送次数
total: {type: Number, default: 0}, // 总次数
used: {type: Number, default: 0}, // 已经使用
expireSoon: {type: Date}, // 即将过期的时间
order: {type: String, required: true}, // 关联 order._id
session: {
  _id: {type: String}, // 关联session._id
  name: {type: String}, // session.name
  start: {type: String}, // session.start
  end: {type: String}, // session.end
},
snapshot: {type: Schema.Types.Mixed, required: true}, // service-pack 快照
status: {type: Boolean, default: true},
point: {type: Number}, // 订单支付积分
isPoint: {type: Boolean, default: false}, // 现金购买/积分购买
payMethod: {type: String}, // 默认为空, 现金支付过就会更新为 cash， https://github.com/zran-nz/bug/issues/5020
```

### service-pack-user-data model

```js
packUser: {type: String, required: true}, // 关联购买的服务包 service-pack-user._id
expired: {type: Date}, // 过期列表
status: {type: Number, default: 0}, // 状态 0: 可用，-1: 过期, 1: 被使用
gift: {type: Boolean, default: false}, // 是否赠品
order: {type: String, trim: true}, // 关联 order
payMethod: {type: String, trim: true}, // 支付方式
```

### service-pack-user-logs model

```js
packUser: {type: String, required: true}, // 关联购买的服务包 service-pack-user._id
times: {type: Number, required: true}, // 增减次数
type: {type: String, enum: Agl.ServicePackUserType}, // 变化类型
remaining: {type: Number}, // 剩余次数
expireSoon: {type: Date}, // 新的有效期
start: {type: Date}, // booking start
name: {type: String}, // session.name
servicer: {
  uid: {type: String}, // users._id
  avatar: {type: String}, // users.avatar
  name: {type: [String]}, // users.name
},
packUserData: [{
  _id: {type: String, required: true}, // 关联购买的服务包次数 service-pack-user-data._id
  payMethod: {type: String, trim: true}, // 支付方式
  order: {type: String, trim: true}, // order
  expired: {type: Date}, // 过期
}]
```

### 用户已购买的服务包接口

```js
// 服务包列表（purchased）
await this.service('service-pack-user').find({ query: {} });

/**
 * 按用户查询
 * fieldType: {type: String, enum: ['email', 'mobile', 'classcipeId']}
 */
await App.service('service-pack-user').find({
    userField: '',
    userFieldType: 'email/mobile/classcipeId',
});
```

### 支付完成创建用户的服务包

> 后端接口内部调用

```js
// 首次创建购买的服务包
await this.service("service-pack-user").buyByOrder({
  packId, // service-pack._id
  order, // order._id
  session?, // session._id 捆绑购买的session
  total: 10, // 购买的次数
  price, // 服务包支付的实际价格
  gift, // 是否赠送的服务包
});

// 对已经购买的服务包 消耗次数
await this.service("service-pack-user-data").used({
  packUser, // service-pack-user._id
  type, // 日志类型
  times, // 次数
  order?, // 关联 order 消耗
  servicer?, oldSession?, start?
});
// 对已经购买的服务包 增加次数
await this.service("service-pack-user-data").add({
  packUser, // service-pack-user._id
  type, // 日志类型
  times, // 次数
  gift?, // 是否赠送的服务包
  isNew?, // 首次创建服务包的时候增加次数
  order?, // 关联 order
  servicer?, oldSession?, start?
});
```

### 服务包使用记录

```js
// 根据服务包id, 查询使用记录
await App.service('service-pack-user-logs').find({ query: { packUser: packUser._id } });
```

## 用户预约数据

### service-booking model

```js
packUser: {type: String, required: true}, // service-pack-user._id 用户购买的服务包
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
start: {type: Date},
end: {type: Date},
duration: {type: Date}, // 服务包对应的时长 service-pack-user.snapshot.duration
times: {type: Number, default: 1}, // 本次预约消耗次数 = (end-start)/duration
message: {type: String}, // 留言
attachments: [{ // 留言附件
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
}
```

### 预约接口

```js
// 预约列表（预订人看）
await App.service("service-booking").find({query: {tab: 'booker', session: null}})
// 预约列表（服务者看）
await App.service("service-booking").find({query: {tab: 'servicer', session: null}})

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

// 查看自己的不可用时间
const {
  booking: [[start, end], ...], // 已经被预约的时间段
  session: [[start, end], ...], // 已经排课的时间段
} = await App.service("service-booking").get('myHours')

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
  }]
});
```

#### 老师对预约进行排课

```js
// 走创建课程流程, 带上预订的 service-booking._id
await App.service("session").create({
  ...,
  booking, // service-booking._id 学生预订的id
});
```

#### 老师取消课程

```js
// - 从 session 中点击取消，删除 session 本身
await App.service('session').remove(sessionId);
```

#### 老师/学生 取消预约逻辑

```js
await App.service('service-booking').patch('cancel', {
    _id: serviceBooking._id,
});
```

## 用户评价数据

### service-rating model

```js
session: {type: String}, // session._id
booking: {type: String}, // service-booking._id
servicer: {type: String, required: true}, // 老师
booker: {type: String, required: true}, // 学生
feel: {type: Boolean, required: true}, // 是否满意
tags: {type: [String], trim: true}, // 标签
message: {type: String, required: true}, // 留言
```

### 评价接口

```js
// 创建评价
await App.service("service-rating").create({
  session: "session._id",
  booking: "service-booking._id",
  servicer: "servicer._id",
  feel: true/false,
  tags: [...],
  message: '...',
});

// 更新评价
await App.service("service-rating").patch({
  tags: [...],
  message: '...',
});

// 老师的标签统计数据
await App.service("service-rating").get("tagsCount", {
  query: { servicer: users._id },
});
// 老师的所有评价数据
await App.service("service-rating").find({
  query: { servicer: users._id },
});
// 通过预订id获取评价数据
await App.service("service-rating").find({
  query: { booking: "service-booking._id" },
});
// 通过session获取评价数据
await App.service("service-rating").find({
  query: { session: "session._id" },
});
```

## 服务者粉丝

### service-fans model

```js
_id: {type: ObjectID}, // 用户 user._id
servicer: {type: [String], required: true}, // 服务者
```

### 粉丝接口

```js
// 我关注的老师数据
await App.service('service-fans').get(pub.user._id);
// 关注老师
await App.service('service-fans').patch(pub.user._id, {
    $addToSet: { servicer: 'user._id' },
});
// 取消关注
await App.service('service-fans').patch(pub.user._id, {
    $pull: { servicer: 'user._id' },
});
```

## Example

```js
// service-pack create > publish > buy
var doc = await App.service('service-pack').create({
    name: Date.now().toString(32),
    points: ['test points', 'test points2'],
    type: 'mentoring',
    mentoringType: 'academic',
    curriculum: 'au',
    subject: ['64d99bcc0476f7faf45ef0d8'],
    gradeGroup: ['Intermediate'],
    price: 1000,
    discount: [{ count: 10, discount: 90 }],
    freq: 7,
    duration: 30,
    break: 10,
});
await App.service('service-pack').patch(doc._id, { status: true });
// buy in api
var packUser = await App.service('service-pack-user').get('buyByOrder', {
    query: {
        packId: '65b47af5a70318050560dc25',
        order: '65b45c361e0529e3d990cc19',
        total: 10,
    },
});

// teacher auth, create > apply
var confDoc = await App.service('service-conf')
    .get(pub.user._id)
    .catch(async (e) => {
        if (e.code === 404)
            return await App.service('service-conf').create({
                _id: pub.user._id,
                hours: [],
            });
    });
confDoc = await App.service('service-conf').patch(confDoc._id, {
    introduction: 'test introduction',
});
var doc = await App.service('service-auth').create({
    type: 'mentoring',
    mentoringType: 'academic',
    curriculum: 'au',
    subject: '64d99bcc0476f7faf45ef0d8',
    gradeGroup: ['Intermediate'],
    grades: ['Grade 1', 'Grade 2'],
});
// 提交申请
await App.service('service-auth').patch(doc._id, { status: 1 });
// 通过申请
await App.service('service-auth').patch(doc._id, { status: 2 });

// 老师列表通过服务包查找
await App.service('service-conf').get('teachersByPack', {
    query: { packUserId: packUser._id, subject: ['64d99bcc0476f7faf45ef0d8'] },
});
// 创建预约
var nt = Date.now();
await App.service('service-booking').create({
    packUser: '65b9c284b5d0b55bf51037de',
    servicer: '634b275c15c7439ecd28d610',
    start: new Date(nt + 3600000).toISOString(),
    end: new Date(nt + 3600000 * 2).toISOString(),
    duration: 30,
    times: 2,
    message: 'test message',
});
```

### 主题服务报名

### service-pack-apply model

```js
  uid: {type: String, required: true},
  servicePack: {type: String, required: true}, // service-pack._id
  sharedSchool: {type: String}, // school-plan._id 从学校分享购买的,分享的学校id
  name: [{type: String, sparse: true, trim: true}], // [ firstname, lastname ]
  gender: {type: String, sparse: true, trim: true}, // gender
  mobile: {type: String, trim: true, sparse: true, unique: true}, // E.164 format, maximum of 15 digits, +1001XXX5550100, +440201234567 => +44201234567
  email: {type: String, lowercase: true, trim: true, sparse: true, unique: true},
  emailType: {type: String, enum: ['student', 'parent']},
  attachments: [
    // 附件Classcipe1
    {
      filename: {type: String, trim: true},
      mime: {type: String, trim: true},
      hash: {type: String, trim: true},
      date: {type: Date}, // 上传时间
      type: {type: String, trim: true}, // 认证类型, conf.val.attachmentType
      size: {type: Number}, // 文件大小
    },
  ],
  needAcademic: {type: Boolean, default: false}, // 是否需要学术审核
  interviewStatus: {type: Number, default: 0}, // 面试审核 0:pending, 1:completed
  needInterview: {type: Boolean, default: false}, // 是否需要面试审核
  status: {type: Number, default: 1}, // 0: 未申请, 1:申请中/pending, 2: 通过/approved, -1: 拒绝/rejected
```

### 机构售卖分享设置

### service-pack-school-price model

```js
  school: {type: String}, // school-plan._id
  servicePack: {type: String, required: true}, // service-pack._id
  priceEnable: {type: Boolean, default: false}, // 价格设置
  contentOrientated: [
    {
      premium: {type: String}, // contentOrientated === true 才有，取认证过的精品课
      times: {type: Number}, // 最少授课次数，必须大于0
      price: {type: Number, trim: true}, // 单次价格 *100，cc，美分
      schoolPrice: {type: Number, trim: true}, // 给机构的价格 单次价格 *100，cc，美分
      servicePack: {type: String}, // 捆绑的服务包, service-pack._id 服务包id
    },
  ],
  deadline: {type: Date}, // 截止时间
  withinSchool: {type: Boolean, default: false}, // 校内/校外
  students: {type: [String]}, // 分享的学生
```

### 机构售卖分享设置接口

```js
// 创建
await App.service('service-pack-school-price').create({ school: 'school-plan._id', servicePack: 'service-pack._id' });

// 更新
await App.service('service-pack-school-price').patch('_id', { priceEnable: false });

// find
await App.service('service-pack-school-price').find({ query: { school: 'school-plan._id', servicePack: 'service-pack._id' } });
```

### 机构购买代金券信息

### service-pack-ticket model

```js
  school: {type: String}, // school-plan._id
  uid: {type: String},
  servicePack: {type: String, required: true}, // service-pack._id
  order: {type: String, trim: true}, // 关联 order
  cashCount: {type: Number, default: 0}, // 现金购买数量
  pointCount: {type: Number, default: 0}, // 积分购买数量
  giftCount: {type: Number, default: 0}, // 赠送数量
```
