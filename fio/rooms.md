

## Rooms

### Rooms model
```js
sid: String, // class_id
members: [{
  _id: String, // user._id
  nickname: String,
  avatar: String,
  email: String,
  group: String, // rooms.groups._id
  feel: String, // After class feeling, on room closed
  last: Date
}],
groups: [{
  name: String, // 组名
}],
groupMax: Number, // 最大组员
attend: [String], // 出勤
block: [String], // 黑名单
```

### Rooms API
```js
// get rooms
const doc = await App.service('rooms').get('rooms._id or session id')


```