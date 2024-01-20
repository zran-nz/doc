## Service

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
```

## 服务认证

### Enum

```js
ServiceType: ['workshop', 'teaching', 'mentoring', 'substitute', 'correcting'],
MentoringType: ['essay', 'academic', 'overseasStudy', 'teacherTraining'], // professionalDevelopment, subject
```

### service-auth model

```js
uid: {type: String, required: true},
type: {type: String, required: true, enum: Agl.ServiceType}, // 服务类型
mentoringType: {type: String, enum: Agl.MentoringType}, // 辅导类型
countryCode: {type: String, trim: true}, // 国家代码
curriculum: {type: String, trim: true},
subject: {type: String, trim: true},
gradeGroup: {type: [String], trim: true}, // 年级组
grades: {type: [String], trim: true}, // 实际年级
status: {type: Number, default: 0}, // 0: 未申请, 1:申请中, 2: 通过, -1: 拒绝
attachments: [{ // 附件
  filename: {type: String, trim: true}, // 文件名
  mime: {type: String, trim: true}, // 文件 MIME
  hash: {type: String, trim: true}, // 文件SHA1, files._id
}],
reason: {type: String, trim: true}, // 原因
```

### 服务认证接口

```js
// 服务认证列表
await App.service("service-auth").find({});
// 已认证列表
await App.service("service-auth").find({ query: { status: 2 } });
// 提交申请
await App.service("service-auth").patch(doc._id, { status: 1 });
// 审批申请
await App.service("service-auth").patch(doc._id, {
  status: 2 / -1,
  reason: "",
});
```

### service-conf model

```js
introduction: {type: String, trim: true}, // 自我介绍
audio: {type: String, trim: true}, // 音频文件 hash files._id
audioTime: {type: Number, trim: true}, // 音频时长（秒）
hours: {type: [[Date, Date], ...], required: true}, // 一周服务可用时间段, [[start, end], [Date, Date], ...]
validDate: {type: [[Date, Date], ...], required: true}, // 有效日期, 当前用户的一天的开始时间, 格式: [[start, end], [Date, Date], ...]
holiday: {type: [[Date, Date], ...], required: true}, // 假日日期, 格式: [[start, end], [Date, Date], ...]
enable: {type: Schema.Types.Mixed}, // 服务启用状态, {[`${type}${mentoringType}`]: true, ...}
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
// 设置有效日期
await App.service("service-conf").patch(pub.user._id, {validDate:  [[start, end], ['2024-01-18T05:00:00.000Z', '2024-01-18T12:00:00.000Z'], ...]})

// 启用服务
await App.service("service-conf").patch(pub.user._id, {[`enable.${type}${mentoringType}`]: true]})
// 禁用服务
await App.service("service-conf").patch(pub.user._id, {[`enable.${type}${mentoringType}`]: false]})
```
