## agreement

### agreement model

```js
{
  name: {type: String, required: true},
  type: {type: String, required: true, enum: ['all_users', 'service_provider', 'agents', 'education_consultants', 'schools']},
  mode: {
    type: String,
    required: true,
    enum: [
      'privacy',
      'terms_and_conditions',
      'cancellation',
      'points_redemption',
      'verification',
      'premium_content',
      'agents',
      'consultation',
      'pipeline',
      'content_provider',
    ],
},
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
