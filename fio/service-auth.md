### service-auth model

```js
uid: {type: String, required: true},
type: {type: String, required: true, enum: Agl.ServiceType}, // 服务类型
mentoringType: {type: String, enum: Agl.MentoringType}, // 辅导类型
enable: {type: Boolean, default: true}, // 是否启用
serviceRoles: {type: [String], enum: Agl.ServiceRoles, default: Agl.ServiceRoles}, // 可以服务的项目 #4586
serviceRolesUser: {type: [String], enum: Agl.ServiceRoles, default: Agl.ServiceRoles}, // 用户选择的
countryCode: {type: [String], trim: true}, // 国家代码
curriculum: {type: String, trim: true}, // 大纲代码 or 自定义的大纲_id
subject: {type: String, trim: true}, // 学科_id
gradeGroup: {type: [String], trim: true}, // 年级组
grades: {type: [String], trim: true}, // 实际年级
tags: {type: [String], trim: true}, // 标签
unit: { // 认证课件
  _id: {type: String, trim: true}, // unit._id
  name: {type: String, trim: true}, // 课件名称
  price: {type: Number}, // 课件价格, 单位 分 = 互动题数量*20
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
approval: { // 审批信息
  submitted: {type: Date}, // 提交时间
  approved: {type: Date}, // 审核时间
  approver: {type: String}, // 审核人uid
},
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
feedback: { // 留言反馈
  message: {type: String}, // 用户留言内容
  date: {type: Date}, // 留言时间
  read: {type: Boolean, default: false}, // read status
  reply: {type: String}, // 后台回复内容
  replyDate: {type: Date},
  replyRead: {type: Boolean, default: false}, // read status
},
follower: {type: String}, // 跟进人 user._id
followedAt: {type: Date}, // 开始跟进时间
releasedAt: {type: Date}, // 上次释放时间
schoolOfFollower: {type: String}, // school-plan._id 学校管理员所属学校
importUsers: {type: [String]}, // 老师预约排课购买的自动排课被取消后，需要加入，可以重复
interviewInvited: {type: Boolean, default: false}, // 面试邀请是否发送
interviewPack: {type: String}, // 面试服务包id
interviewApply: {type: Boolean, default: false}, // 面试已预约
takeaway: {type: String}, // takeaway
takeawayCreatedAt: {type: Date},
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

### import classcipe cloud

> 导入认证精品课列表

```js
// 课件数据列表
await App.service("service-auth").get("cloudList", { query: {} });
```

### 统计被多少服务包关联

```js
await App.service("service-auth").get("countPackUse", { query: { _id } });
```

### 认证留言

```js
// 创建留言
await App.service('service-auth').patch('message', {_id, message})
// 后台回复
await App.service('service-auth').patch('reply', {_id, reply})
// 标记为已读
await App.service('service-auth').patch(_id, {'feedback.read': true})
await App.service('service-auth').patch(_id, {'feedback.replyRead': true})
// 已读未读过滤条件
await App.service('service-auth').find({query: {
  ...,
  'feedback.read': true/false // 未读
}})
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
await App.service("service-auth").get("listByUid", {
  query: { uid: "user._id" },
});
```

### 服务认证日期范围查询

```js
await App.service("service-auth").find({
  query: { dateRange: [start, end, zone?] },
});

```

### 服务认证协同审批

```js
// claim
await App.service("service-auth").patch("service-auth._id", {
  follower: "uid",
  followedAt: new Date(),
});

// unclaim stop
await App.service("service-auth").patch("service-auth._id", {
  $unset: { follower: "", followedAt: "" },
  releasedAt: new Date(),
});

// 获取follower列表 按项目数排序 字段count为项目数
await App.service("service-auth").get("groupByFollower");

// by me
await App.service("service-auth").find({ query: { follower: user._id } });
// by others
await App.service("service-auth").find({
  query: { follower: { $ne: user._id, $exists: true } },
});
// unclaimed
await App.service("service-auth").find({
  query: { follower: { $exists: false } },
});
// by me + by others
await App.service("service-auth").find({
  query: { follower: { $exists: true } },
});
// by me + unclaimed
await App.service("service-auth").find({
  query: {
    $or: [{ follower: user._id }, { follower: { $exists: false } }],
  },
});
// by others + unclaimed
await App.service("service-auth").find({
  query: {
    $or: [
      { follower: { $ne: user._id, $exists: true } },
      { follower: { $exists: false } },
    ],
  },
});
```

### 服务认证协同审批

```js
// 发送面试邀请
await App.service("service-auth").patch("service-auth._id", {
  interviewInvited: true,
  interviewPack: "service-pack._id",
});

// 面试手动return
await App.service("service-auth").get("interviewReturn", {
  query: { id: "service-auth._id" },
});
```

### 统计认证老师数量

```js
const {
  countryCode: { 'AU': [{...}], ...},
  curriculum: { 'au': [{...}], ...},
  subject: { '64d99bcc0476f7faf45ef0d8': [{...}], ...},
  gradeGroup: { 'Intermediate': [{...}], ...},
  topic: {'topic._id': [{...}], ...}
  serviceRoles: {'mentoring|substitute|...': [{...}], ...}
} = await App.service("service-auth").get("groups", { query: { type, mentoringType?, curriculum?, countryCode?, subject?, gradeGroup?, 'topic._id'? } });

// const {
//   curriculum: { 'au': {-1: 0, 0: 1, 1: 1, 2: 1}, ...},
//   gradeGroup: { 'Intermediate': {-1: 0, 0: 1, 1: 1, 2: 1}, ...},
//   subject: { '64d99bcc0476f7faf45ef0d8': {-1: 0, 0: 1, 1: 1, 2: 1}, ...},
//   countryCode: { 'AU': {-1: 0, 0: 1, 1: 1, 2: 1}, ...},
// } = await App.service("service-auth").get("stats", { query: { type, mentoringType? } });
```

### 认证的课件按 topic.\_id 统计数量

```js
const {
  $topic._id: $count,
  '66506185267ada5104400226': 2,
  ...
} = await App.service("service-auth").get("groupTopic", { query: {type, mentoringType, curriculum, subject}});
```
