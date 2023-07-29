

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
// start countdown for student, return start time
const sec = await App.service('rooms').get('countdownStart', {query: {sid}})

// get countdown list for teacher
const list = await App.service('rooms').get('countdownList', {query: {sid}})
// list = {[user._id]: startTime, ....}

// get self counter for student 
// const sec = await App.service('rooms').get('counter', {query: {sid}})
// patch counter, patch every 10 seconds for student
// const sec = await App.service('rooms').patch('counter', {sid, sec: 10})
// get counter all members sec for teacher
// const list = await App.service('rooms').get('counterAll', {query: {sid}})
// list = {[user._id]: sec, ....}
```


### find rooms status count
```js
await App.service('rooms').get('countStatus', {query: {sid: {$in: [sid, ...]}}})
```
