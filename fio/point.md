## point-setting

### point-setting model

```js
tab: {type: String, enum: ['earn', 'claim']}, //类目1 earn:获取积分 claim:兑换积分
category: {
  type: String,
  required: true,
  enum: ['invite', 'verify', 'unit', 'service', 'session', 'self_study', 'saas_tool', 'service_premium', 'correcting_service', 'cloud_20g', 'cloud_40g', 'points_purchase', 'prompt'],
}, //类目2
categoryType: {type: String}, //类目3
mode: {type: String, required: true, default: 'percentage', enum: ['fixed', 'percentage']}, //奖励模式 固定数值/按比例
value: {type: Number, required: true}, //固定数值;按比例
```

### point-setting api

```js
//创建
await App.service('point-setting').create({
    tab: 'earn',
    category: 'invite',
    categoryType: 'test',
    mode: 'percentage',
    value: 10,
});

// 删除
await App.service('point-setting').remove(_id);
```

### point-log model

```js
uid: {type: String, required: true},
tab: {type: String, enum: ['earn', 'claim']}, //类目1 earn:增加 claim:减少
category: {type: String, required: true}, //类目2
categoryType: {type: String}, //类目3
value: {type: Number, required: true}, //本次结算的积分
total: {type: Number, required: true}, //本次结算后的总积分
businessId: {type: String}, //业务相关id,比如order._id user._id
snapshot: {type: Object}, //业务快照
```
