## reward-setting

### reward-setting model

```js
{
  type: {type: String, required: true, enum: ['point', 'commission']}, //积分/佣金
  tab: {type: String, enum: ['Agency', 'Organization', 'Education']}, //类目1 积分无此项
  category: {
    type: String,
    required: true,
    enum: [
      'Premium content packages',
      'Premium workshops',
      'SAAS tools',
      'Mentor service package',
      'Invite new user',
      'Service packages',
      'Teaching resources',
    ],
  }, //类目2
  categoryType: {type: String}, //类目3
  userType: {type: String, enum: ['Teacher', 'Student']}, //Invite new user有此设置
  mode: {type: String, required: true, default: 'percentage', enum: ['fixed', 'percentage']}, //积分/佣金奖励模式 固定数值/按比例
  value: {type: Number, required: true}, //数值/比例0-100
}
```

### reward-setting api

```js
//创建
await App.service('reward-setting').create({
    type: 'point',
    tab: 'Agency',
    category: 'Premium content packages',
    categoryType: 'test',
    mode: 'percentage',
    value: 10,
});

// 删除
await App.service('reward-setting').remove(_id);
```
