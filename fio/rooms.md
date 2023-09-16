

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
const sec = await App.service('rooms').patch('countdownStart', {sid})
// get countdown for student, return start time
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
1、通过列表接口获取报名人数（workshop类取 regNum，班级session取 students数量）  
2、其他统计通过以下接口获取 锁屏人数: block，实际进入课堂人数：members（通过链接实际人数）
```js
await App.service('rooms').get('countStatus', {query: {sid: {$in: [sid, ...]}}})
```

### save teacher draw by pageid
```js
// get draw doc by pageId
const doc = {
  _id, sid, pageId, ppt: {...}, blank: {...}
} = await App.service('session-draw').get('byPageId', {query: {sid: session.sid, pageId: session.pages._id}})

// ppt draw save 
await App.service('session-draw').patch(doc._id, {ppt: {...}})

// blank draw save 
await App.service('session-draw').patch(doc._id, {blank: {...}})
```