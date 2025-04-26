## commission-setting

### commission-setting model

```js
tab: {type: String, enum: ['earn', 'claim'], default: 'earn'}, //类目1 earn:获取 claim:使用/提现
role: {type: String, required: true, enum: ['agency', 'organization', 'education_consultant', 'classcipe_staff']},
category: {
  type: String,
  required: true,
  enum: [
    'task', // Associate task
    'service',
    'service_premium', // Lecture service
    'session',
    'saas_tool_paid',
    'unit', // Teaching resources
    'verify', // Invite user to verify- commission
    'service_substitute',
    'service_correct',
    'self_study', // 自学习
  ],
}, //类目2
categoryType: {type: String}, //类目3
mode: {type: String, required: true, default: 'percentage', enum: ['fixed', 'percentage']}, //奖励模式 固定数值/按比例
value: {type: Number, required: true}, //固定数值;按比例
```

### commission-setting api

```js
//创建
await App.service('commission-setting').create({
    role: 'agency',
    category: 'workshop',
    mode: 'percentage',
    value: 10,
});

// 删除
await App.service('commission-setting').remove(_id);
```

### commission-log model

```js
uid: {type: String, required: true},
tab: {type: String, enum: ['earn', 'claim'], default: 'earn'}, //类目1 earn:增加 claim:减少
role: {type: String, required: true, enum: ['agency', 'organization', 'education_consultant', 'classcipe_staff']},
source: {type: String, required: true}, //order refund reward(分享奖励) category
category: {type: String, required: true}, //类目2
categoryType: {type: String}, //类目3
value: {type: Number, required: true}, //本次结算的积分
total: {type: Number, required: true}, //本次结算后的总积分
businessId: {type: String}, //业务相关id,比如order._id user._id
snapshot: {type: Object}, //业务快照
status: {type: Number, enum: [0, 1], default: 1}, //状态 0: 预期 1: 实际
isSchool: {type: Boolean, default: false}, //是否是学校
```
