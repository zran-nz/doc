## agreement

### agreement model

```js
{
  name: {type: String},
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
      'service_premium',
      'agents',
      'consultation',
      'pipeline',
      'content_provider',
      'on_campus',
    ],
  },
  content: {type: String},
  status: {type: Number, default: 1}, // 0: archived, 1: current
}
```

### agreement api

```js
// 创建
await App.service('agreement').create({ type: 'type', mode: 'mode', content: 'content' });

// find current
await App.service('agreement').find({ query: { type: 'type', mode: 'mode', $sort: { createdAt: -1 }, $limit: 1 } });
```
