## campus-location

### campus-location model

```js
{
  country: {type: String, trim: true},
  city: {type: String, trim: true},
  experienceRate: {type: Object}, // {grade: Rate}
  tutorRate: {type: Object}, // {grade: Rate}
  compensationHour: {type: Number},
  attachmentsCity: [
    {
      filename: {type: String, trim: true}, // 文件名
      mime: {type: String, trim: true}, // 文件 MIME
      hash: {type: String, trim: true}, // 文件SHA1, files._id
    },
  ],
},
```

### campus-location api

```js
// 获取国家列表
await App.service('campus-location').get('country');

// 获取国家下城市
await App.service('campus-location').get('city', { query: { country: '' } });
```
