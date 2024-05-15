## commission-setting

### commission-setting model

```js
{
  tab: {type: String, required: true, enum: ['agency', 'organization', 'education']}, //类目1
  category: {type: String, required: true, enum: ['workshop', 'service_package', 'content_package']}, //类目2
  categoryType: {type: String}, //类目3
  mode: {type: String, required: true, default: 'percentage', enum: ['fixed', 'percentage']}, //奖励模式 固定数值/按比例
  value: {type: Number, required: true}, //固定数值;按比例
}
```

### commission-setting api

```js
//创建
await App.service('commission-setting').create({
    tab: 'agency',
    category: 'workshop',
    categoryType: 'test',
    mode: 'percentage',
    value: 10,
});

// 删除
await App.service('commission-setting').remove(_id);
```
