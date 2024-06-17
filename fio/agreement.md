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
      'premium_content',
      'agents',
      'consultation',
      'pipeline',
      'content_provider',
    ],
  },
  content: {type: String},
  status: {type: Number, default: 1}, // 0: archived, 1: current
}
```

### agreement api

```js
// 创建/更新
await App.service('agreement').get('update', { query: { type: 'type', mode: 'mode', content: 'content' } });
```
