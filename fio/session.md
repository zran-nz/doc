

## Session API

### Session model
```js
sid: String // session code
image: String,
name: String,
start: Date
end: Date
status: String, // ['live', 'close', 'student']
type: String, // content type: ['session', 'taskWorkshop', 'unitCourses', 'workshop', 'courses', 'pdCourses', 'tool']
uid: String, // user._id
zoom: Mixed, // session zoom
cid: String, // related task.id or content.id

// extend
id: String, // deprecated: old task.presentation_id, slides.id
rev: String, // deprecated: old task.revision_id, slides.rev
rid: String, // deprecated: old class.id
size: Number, // pages size + room student comments + response size
del: Boolean, // true: archive, false: restore
category: String,
color: String,

// for classroom control
guest: Boolean, // Allow anonymous login
welcome: Boolean, // show welcome box
countdown: {
  type: Number, // type 0: none, 1: Deadline, 2: Countdown
  studentCtrl: Boolean,
  deadline: Date, // deadline
  down: Number, // down min
},

// for workshop
price: Number, // free: 0, price $1 = 100
discount: Number, // 0 - 99
regDate: Date, // register dealine
regMax: Number, // max register members
regNum: Number, // register count
reg: [{ // register userinfo
  _id: String, // user._id
  avatar: String, // user.avatar
  nickname: String, // user.nickname
  last: Date, // reg date
}],

// for class session
school: String, // old cc_school.id
classId: String, // old classId school class id, class2.task_class_id
className: String, // old className
unitType: String, // unit.type ['FA', 'SA', 'Activity', 'IA', 'Single', 'integrated', 'UOI', 'IDU']
sessionType: String, // unit.sessionType, ['live', 'student']
unit: String, // related unit.id
students: { type: [String] }, // class session: student user._id

// for unit session, courses
childSize: Number,
childs: [{
  _id: String, // session._id
  cid: String, // task._id or pd._id or tool._id
  group: String, // linkGroup._id
  groupName: String, // link.group name
  mode: String, // unit.mode, task/pd/tool
  sid: String, // session._id
}],

// snapshot data
task: Mixed, // task.[] snapshot
pages: Mixed, // slides.pages snapshot
questions: Mixed, // questions snapshot
assess: Mixed, // task-outline.assess snapshot
outline: Mixed, // task-outline.outline snapshot
reminder: Number, // mail notice: WorkshopReminderBeforeClass
drawkey: String, // excalidraw room key
```

### type
> for classroom  
task => session  
unit => courses

> for public  
task => taskWorkshop  
unit => unitCourses

> for workshop  
pd => workshop  
pdunit => pdCourses


tool => tool

### Session detail [new]

`await App.service('session').get(_id)`

### patch session questions options [new]

```js
await App.service("session").patch(_id, {
  'quetions.$.options': [...options]
}, { query: { 'questions._id': '' }});
```

### start quick session [new]

`await App.service('session').create({ id: 'presentation_id', image: 'cover url', guest: true })'`

### start workshop [new]

```js
await App.service('session').create({
  type: 'workshop', name: '', school: '',
  id: 'presentation_id', cid: 'content.id', image: 'cover url',
  unitType: String, // unit.type
  sessionType: String, // unit.sessionType
  price: 0 / 100 (单位:分, $1 = 100), discount: 0~99,
  regMax: 100, regDate: new Date('register dealine'),
  start: new Date('start time'), end: new Date('end time'),
  zoom: { passcode: true/false, waiting_room: true/false },
  category?: '', color?: ''
})
```

### start session [new]

```js
await App.service('session').create({
  type: 'session', name: '',
  school?: '', classId?: '', className?: '',
  unitType: String, // unit.type
  sessionType: String, // unit.sessionType
  id: 'presentation_id', cid: 'content.id', image: 'cover url',
  price: 0 / 100 (单位:分, $1 = 100), discount: 0~99,
  regMax: 100, regDate?: new Date('register dealine'),
  start: new Date('start time'), end: new Date('end time'),
  zoom?: { passcode: true/false, waiting_room: true/false },
  category?: '', color?: ''
})
```

### create courses

```js
await App.service('session').create({
  type: 'courses', name: '',
  school?: '', classId?: '', className?: '',
  cid: 'unit._id', image: 'cover url',
  unitType: String, // unit.type
  sessionType: String, // unit.sessionType
  price?: 0 / 100 (单位:分, $1 = 100), discount?: 0~99,
  regMax?: 100, regDate?: new Date('register dealine'),
  start: new Date('first session start time'), end: new Date('last session end time'),
  childs: [{
    _id: String, // session._id
    cid: String, // session.cid
    group?: String, // linkGroup._id
    groupName?: String, // linkGroup name
    mode: String, // task/pd/tool
    sid: String, // session.sid
  }, ...]
})

// example
const unitDoc = await App.service('unit').get('unit._id')
const groupMap = {}
const linkMap = {}
for(const o of unitDoc.linkGroup){
  groupMap[o._id] = o.name
}
for(const link of unitDoc.link){
  linkMap[link.id] = link.group
}
const childs = []
const unitLinkList = await App.service('unit').get('relateLinkList', {query: {rid: 'unit._id'}})
for(const o of unitLinkList){
  const sessionDoc = await App.service('session').create({type: 'session', cid: o._id, ...})
  const link = linkMap[o._id]
  childs.push([
    _id: sessionDoc._id,
    sid: sessionDoc.sid,
    cid: sessionDoc.cid,
    mode: link.mode,
    group: link.group,
    groupName: groupMap[link.group]
  ])
}
const courseDoc = await App.service('session').create({type: 'courses', cid: unitDoc._id, ..., childs})
```

### patch session [new]

```js
await App.service("session").patch(_id, {
  name: "",
  image: "cover url",
  regMax: 100,
  regDate: new Date("register dealine"),
  start: new Date("start time"),
  end: new Date("end time"),
});
```

### launch workshop list [new]
```js
// launch workshop - scheduled
await App.service('session').find({query: {
  del: false, school: null, type: 'workshop', status: {$ne: 'close'},
  start: {$gte: new Date()},
  $sort: {start: 1, name: 1, _id: 1},
}})
// launch workshop - on-going 
await App.service('session').find({query: {
  del: false, school: null, type: 'workshop', status: {$ne: 'close'},
  start: {$lte: new Date()},
  $sort: {_id: -1},
}})
// launch workshop - ended
await App.service('session').find({query: {
  del: false, school: null, type: 'workshop', status: 'close',
  $sort: {_id: -1},
}})
// launch workshop - archived
await App.service('session').find({query: {
  del: true, school: null, type: 'workshop',
  $sort: {_id: -1},
}})

// For school
- school: school.id
```

### register workshop
```js
// register
// _date: use send mail, session localtime format
await App.service('session').patch(session._id, {
  _date: new Date(session.start).toString(), 
  $addToSet: {reg: {avatar: pub.user.avatar, nickname: pub.user.nickname, _id: pub.user._id}}
})

// unregister
await App.service('session').patch(session._id, {
  $pull: {reg: {_id: 'reg._id'}}
})

```

### live workshop list [new]
```js
// live workshop - featured
await App.service('session').find({query: {
  del: false, isLib: true, school: null, type: 'workshop', status: {$ne: 'close'},
  end: {$gte: new Date()},
  $sort: {start: 1, name: 1, _id: 1},
}})
// live workshop - scheduled
await App.service('session').find({query: {
  del: false, school: {$in: [...school.id, null]}, type: 'workshop', status: {$ne: 'close'},
  start: {$gte: new Date()},
  $sort: {_id: -1},
  'reg._id': pub.user._id,
}})
// live workshop - on-going
await App.service('session').find({query: {
  del: false, school: {$in: [...school.id, null]}, type: 'workshop', status: {$ne: 'close'},
  start: {$lte: new Date()},
  $sort: {_id: -1},
  'reg._id': pub.user._id,
}})
// live workshop - ended
await App.service('session').find({query: {
  del: false, school: {$in: [...school.id, null]}, type: 'workshop', status: 'close',
  start: {$lte: new Date()},
  $sort: {_id: -1},
  'reg._id': pub.user._id,
}})

```
### Session list for class [new]
```js
// scheduled
await App.service('session').find({query: {
  del: false, classId: '', type: 'session', status: {$ne: 'close'},
  start: {$gte: new Date()},
  $sort: {start: 1, name: 1, _id: 1}
}})
// on-going
await App.service('session').find({query: {
  del: false, classId: '', type: 'session', status: {$ne: 'close'},
  start: {$lte: new Date()},
  $sort: {_id: -1},
}})
// ended
await App.service('session').find({query: {
  del: false, classId: '', type: 'session', status: 'close',
  $sort: {_id: -1},
}})
// archived
await App.service('session').find({query: {
  del: true, classId: '', type: 'session', status: 'close',
  $sort: {_id: -1},
}})

// ext search
$or: [{name: {$search: "123"}}]

```
### Session list for calender [new]
```js
// find by start ~ end
await App.service('session').get('dateList', {
  query: {
    start: new Date('start time'), end: new Date('end time'), zone: new Date().getTimezoneOffset()
  }
})

// find list by classId
await App.service('session').get('dateList', {
  query: {
    start: new Date('start time'), end: new Date('end time'),
    classId: 'classId',
    zone?: new Date().getTimezoneOffset()
  }
})

// filter workshop
await App.service('session').get('dateList', {
  query: {
    start: new Date('start time'), end: new Date('end time'),
    type?: 'workshop', // workshop / session
    school?: [...'school_id'], //
    uid?: pub.user._id, // only launch by me
    'reg._id'?: pub.user._id, // only workshop to attend
  }
})

// filter session
await App.service('session').get('dateList', {
  query: {
    start: new Date('start time'), end: new Date('end time'),
    type?: 'session', // workshop / session
    school?: [...'school_id'], //
    classId?: 'classID', //
    unitType?: [...'unit.type'], // unit.type
    sessionType?: [...'unit.sessionType'], // unit.type
    uid?: pub.user._id / { $ne: pub.user._id }, // only launch by me
  }
})
```

### Session list for students
```js
// session list
await App.service('session').find({
  query: {
    start: new Date('start time'), end: new Date('end time'),
    type?: 'session',
    students: pub.user._id, // with me
    school?: [...'school_id'], //
    classId?: 'classID', //
    unitType?: [...'unit.type'], // unit.type
    sessionType?: [...'unit.sessionType'], // unit.type
  }
})
// workshop list
await App.service('session').find({
  query: {
    start: new Date('start time'), end: new Date('end time'),
    type?: 'workshop',
    'reg._id': pub.user._id, // with me
    school?: [...'school_id'], //
    classId?: 'classID', //
    unitType?: [...'unit.type'], // unit.type
    sessionType?: [...'unit.sessionType'], // unit.type
  }
})
```

### Session action

- \_id 为 session.\_id

> End session  
> `App.service('session').patch(_id, {status: 'close'})`

> Reopen session  
> `App.service('session').patch(_id, {status: 'live'})`

> Archive session  
> `App.service('session').patch(_id, {del: true})`

> Restore session  
> `App.service('session').patch(_id, {del: false})`

> Delete session  
> `App.service('session').remove(_id)`

### get members for assessment tool
```js
// get members for student
const doc = await App.service('session').get('toolMembers', {query: {sid: 'session.sid', role: 'student'}})
// get members for teacher
const doc = await App.service('session').get('toolMembers', {query: {sid: 'session.sid'}})

// example test
var doc = await App.service('session').get('63eed1c5338d4d5568c5ab94')
await App.service('session').patch(doc._id, {
  _date: new Date(doc.start).toString(), 
  $addToSet: {reg: {avatar: Auser.avatar, nickname: Auser.nickname, _id: Auser._id}}
})
await App.service('session').get('toolMembers', {query: {sid: "C17cmGC9", role: 'student'}})
await App.service('session').get('toolMembers', {query: {sid: "C17cmGC9"}})

```

### LearningData
```js
const {members, sessions} = App.service('session').get('learningData', {query: {pid: 'session._id'}})

members = [{
  _id: 'user._id',
  nickname: 'user.nickname',
  avatar: 'user.avatar',
  sessions: {
    'session._id': {
      // for live
      attend: Boolean,
      // for study
      count: 0, // response.length
      // for assessment tool
      self: 0,
      teacher: 0,
      others: 0,
    }
  }
}]
sessions = [{
  _id: 'session._id',
  sid: 'session.sid',
  start: 'session.start',
  end: 'session.end',
  status: 'session.status',
  type: 'type',
  sessionType: 'sessionType',
  countdown: {
    deadline: Date
  },
  total: 10, // questions.length
}]

```

### Student response

> Get  
> `App.service('response').get(_id)`

> create  
```js
App.service('response').create({
  page: '', // page_id
  type: '', // question.type
  content: '', // text or url
  answer?: [], // for radio, checkbox, choice data
  locked?: false, // for radio, checkbox, Boolean
  point?: {}, // for comment, json
  json?: {} // draw json
})
```

> patch  
> `App.service('response').patch(_id, {content: '',...})`

> remove  
> `App.service('response').remove(_id)`
