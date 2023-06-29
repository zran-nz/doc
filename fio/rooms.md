

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

#### students join room only once
```js
const doc = await App.service('rooms').patch('joinRoom', {_id: 'rooms._id'})
```

#### block/attend student
```js
// block students
const doc = await App.service('rooms').patch(doc._id, {$addToSet: {block: 'user._id'}})
// unblock students
const doc = await App.service('rooms').patch(doc._id, {$pull: {block: 'user._id'}})
// attend students
const doc = await App.service('rooms').patch(doc._id, {$addToSet: {attend: 'user._id'}})
// un attend students
const doc = await App.service('rooms').patch(doc._id, {$pull: {attend: 'user._id'}})


// batch block students
const doc = await App.service('rooms').patch(doc._id, {block: [...]})
```

### self-study countdown mode counter
```js
// get counter
const sec = await App.service('rooms').get('counter', {query: {sid}})

// patch counter, patch every 10 seconds 
const sec = await App.service('rooms').patch('counter', {sid, sec: 10})
```