## school year

### school-year model
```js
{
  school: String, // school-plan._id
  title: String,
  start: Date,
  end: Date,
}
```

## school term

### school-term model
```js
{
  school: String, // school-plan._id
  year: String, // school-year._id
  title: String,
  start: Date,
  end: Date,
  time: Number, // default: 2700, session time, unit sec
  break: Number, // default: 600, break time, unit sec
  block: [{
    week: Number, // day of the week, 0-6, new Date().getDay(): Sunday - Saturday : 0 - 6
    start: String, // 00:00, hour:min
    end: String, // 00:00, hour:min
  }],
}
```

### school-term API
```js

// 列表获取
await App.service('school-term').find({query: {school: 'school-plan._id'}})

```
