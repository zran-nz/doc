## point-setting

### point-setting model

```js
tab: {type: String, enum: ['earn', 'claim'], default: 'earn'}, //类目1 earn:获取积分 claim:使用积分
category: {
  type: String,
  required: true,
  enum: [
    'invite', // 邀请用户注册
    'verify', // 邀请用户认证
    'unit', // Teaching resources
    'service',
    'session',
    'self_study', // 自学习
    'service_premium', // Lecture service
    'cloud_20g',
    'cloud_40g',
    'points_purchase', // 所发布的内容（公开课，library 课件，self study）被平台上其他用户用积分兑换后,原作者获得积分/佣金奖励
    'task', // Associate task
    'saas_tool_paid', // SAAS tools-paid
    'saas_tool_trail', // SAAS tools-trail
    'service_substitute',
    'service_correct',
  ],
}, //类目2
categoryType: {type: String}, //类目3
mode: {type: String, required: true, default: 'percentage', enum: ['fixed', 'percentage']}, //奖励模式 固定数值/按比例
value: {type: Number, required: true}, //固定数值;按比例
```

### point-setting api

### POST:/point-setting
```js
//创建
await App.service('point-setting').create({
    tab: 'earn',
    category: 'invite',
    categoryType: 'test',
    mode: 'percentage',
    value: 10,
});
```

### DELETE:/point-setting/:id
```js
// 删除
await App.service('point-setting').remove(_id);
```

### point-log model

```js
uid: {type: String, required: true},
tab: {type: String, enum: ['earn', 'claim']}, //类目1 earn:增加 claim:减少
source: {type: String, required: true}, //order refund reward(分享奖励)
category: {type: String, required: true}, //类目2
categoryType: {type: String}, //类目3
value: {type: Number, required: true}, //本次结算的积分
total: {type: Number, required: true}, //本次结算后的总积分
businessId: {type: String}, //业务相关id,比如order._id user._id
snapshot: {type: Object}, //业务快照
status: {type: Number, enum: [0, 1], default: 1}, //状态 0: 预期 1: 实际
isSchool: {type: Boolean, default: false}, //是否是学校
```
