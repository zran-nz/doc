## agreement

### agreement model

```js
{
  name: {type: String, required: true},
  type: {type: String, required: true, enum: ['all_users', 'service_provider', 'agents', 'education_consultants', 'schools']},
  contract: [
    {
      content: {type: String},
      createdAt: {type: Date},
    },
  ],
}
```

### agreement api

```js
// 创建
await App.service('agreement').create({ content: '合同内容', type: type, name: name });

// 更新
await App.service('agreement').patch(_id, { content: '合同内容' });
```
