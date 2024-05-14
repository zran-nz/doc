## commission-setting

### commission-setting model

```js
{
  tab: {type: String, required: true, enum: ['Agency', 'Organization', 'Education']}, //类目1
  category: {type: String, required: true, enum: ['Premium content packages', 'Premium workshops', 'SAAS tools', 'Mentor service package']}, //类目2
  type: {type: String, required: true}, //类目3
  rate: {type: Number, required: true}, //比例 0-100
}
```

### commission-setting api

```js
//创建
await App.service('commission-setting').create({
    tab: 'Agency',
    category: 'Premium content packages',
    type: 'test',
    rate: 10,
});

// 删除
await App.service('commission-setting').remove(_id);
```
