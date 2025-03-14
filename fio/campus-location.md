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
  archive: {type: Boolean, default: false},
},
```

### campus-location api

```js
// 获取国家列表
await App.service('campus-location').get('country');

// 获取国家下城市
await App.service('campus-location').get('cityByCountry', { query: { country: '' } });

// 获取所有城市
await App.service('campus-location').get('city');

// 统计该国家下,每个城市的老师数量
await App.service('campus-location').get('cityTeacherStatistics', { query: { country: 'NZ', mentoringType: 'academic/steam', subject: ['subjects._id'] } });

// 距离某地址半径内的老师数量,按学科统计 Academic
await App.service('campus-location').get('cityTeacherStatisticsRadius', {
    query: {
        country: 'NZ',
        city: 'Ashburton',
        place_id: 'ChIJfUvHmvcEJmsRInIqgBaIUaM', // 从google接口获取的
        mentoringType: 'academic/steam',
        subject: ['subjects._id'],
    },
});
```
