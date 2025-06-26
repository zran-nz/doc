## income-setting

### income-setting model

```js
tab: {type: String, enum: ['earn', 'claim'], default: 'earn'}, //类目1 earn:获取 claim:使用
category: {
  type: String,
  required: true,
  enum: [
    'prompt', // prompt
    'self-study', // 非视频类课件
    'self-study-video', // 视频课件
  ],
},
mode: {type: String, required: true, default: 'percentage', enum: ['fixed', 'percentage']}, //奖励模式 固定数值/按比例
value: {type: Number, required: true}, //固定数值;按比例
```

### income-setting api

### POST:/income-setting

```js
//创建
await App.service('income-setting').create({
    tab: 'earn',
    category: 'prompt',
    mode: 'percentage',
    value: 10,
});
```

### DELETE:/income-setting/:id

```js
// 删除
await App.service('income-setting').remove(_id);
```
