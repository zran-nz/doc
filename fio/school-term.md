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

// 获取year列表
await App.service('school-year').find({query: {school: 'school-plan._id'}})
// 获取term列表
await App.service('school-term').find({query: {school: 'school-plan._id'}})

// 创建year
const yearDoc = await App.service('school-year').create({school, title, start, end})
// 创建term
const doc = await App.service('school-term').create({school, year: yearDoc._id, title, start, end})

// 一次性修改所有block的数据
await App.service('school-term').patch(doc._id, {block: [{week, start, end}, ...]})

// 增加单个block
await App.service('school-term').patch(doc._id, {$addToSet: {block: {week, start, end}}})
// 删除单个block
await App.service('school-term').patch(doc._id, {$pull: {block: {_id: block._id}}})

```
