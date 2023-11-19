

## Session API

### Session model
```js
sid: String // session code
image: String,
name: String,
start: Date // schedule start date
end: Date // schedule end date
ended: Date, // real ended date
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
pid: String, // unit._id
parent: { // parent info
  mode: String, // unit.mode
  group: String, // unit.linkGroup._id
  groupName: String, // unit.linkGroup.name
},

// for classroom control
block: Boolean, // when join room, block every one
guest: Boolean, // Allow anonymous login
welcome: Boolean, // show welcome box
countdown: {
  type: Number, // type 0: none, 1: Deadline, 2: Countdown
  studentCtrl: Boolean,
  deadline: Date, // deadline
  down: Number, // down min
},

// for workshop
discount: {
  val: Number, // discount value 0-99
  price: Number, // original price
  end: Date,
  size: Number // group size
},
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
students: [String], // class session: student user._id
grades: [String], // school grades

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
task: {
  ..., // task.[] snapshot
  outline: {
    assess: Mixed, // task-outline.assess snapshot
    outline: Mixed, // task-outline.outline snapshot
  }
}, 
pages: Mixed, // slides.pages snapshot
questions: Mixed, // questions snapshot
reminder: Number, // mail notice: WorkshopReminderBeforeClass
drawkey: String, // excalidraw room key
```

### type
> for school classroom, need select students  
task => session  
unit => courses  
pdTask => pdClassSession  
pdUnit => pdClassCourses  

> for school students public, need register (only for internal school students)  
task => taskSchoolWorkshop  
unit => unitSchoolCourses  
pdTask => pdSchoolStudentWorkshop  
pdUnit => pdSchoolStudentCourses  

> for school educators public, need register (only for internal school teachers)  
pdTask  => pdSchoolWorkshop  
pdUnit  => pdSchoolCourses  

> for personal public, need register  
task => taskWorkshop  
unit => unitCourses  

> for students public, need register (only for students)  
pdTask => studentWorkshop  
pdunit => studentCourses  

> for educators public, need register (only for teachers)  
pdTask => workshop  
pdunit => pdCourses  

tool => tool

### filter for find
```js

// filter by type
{type: 'workshop'}
{type: {$in: ['workshop', 'taskWorkshop']}}
// filter by status
{status: 'close'}
{status: {$ne: 'close'}}
{status: {$in: ['student', 'live']}}
// filter by sessionType
{sessionType: 'live/student'}

// for school
// filter by school, personal: null, schools: [...schoolID]
{school: {$in: [null, ...schoolID]}}
// filter by class all session
{classId: 'classId'}
// filter by class and my session
{classId: 'classId', uid: pub.user._id}
// filter by class and my enrolled
{classId: 'classId', 'reg._id': pub.user._id}

// enrolled
{'reg._id': pub.user._id}
// taught by me
{$or: [{uid: pub.user._id, taught: null}, {taught: pub.user._id}]}
// taught by others
{uid: pub.user._id, {taught: {$ne: null}}}


// filter public subject
{'subjects.value': 'xxx'}
// filter custom subject for unit/task/ any session
{'subjects.session': 'xxx'}
// filter custom subject for any workshop
{'subjects.pd': 'xxx'}
```

### self-study session
```js
// task/pd publish to self-study
await App.service('session').create({
  type: 'taskWorkshop',
  status: 'student', sessionType: 'student',
  id: 'presentation_id (unit.sid)', cid: 'unit.id', image: 'unit.cover',
  unitType: String, // unit.type
  regMax: 0,
  subjects: [...],
})
// unpublish self-study session for publisher
await App.service('session').patch(doc._id, {del: true})

// find list for student self-study center
await App.service('session').find({query: {
  isLib: true, type: 'taskWorkshop', sessionType: 'student'
}})

// find list for publisher self data
await App.service('session').find({query: {
  type: 'taskWorkshop', sessionType: 'student', 
}})
// find list for student self data
await App.service('session').find({query: {
  type: 'taskWorkshop', sessionType: 'student', 'reg._id': pub.user._id,
}})

// classroom handle
- do not join the room
- find response query = {sid, uid: pub.user._id, $limit: 2000}
- disable 'auth' service
```

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
  id: 'presentation_id (unit.sid)', cid: 'unit.id', image: 'unit.cover',
  unitType: String, // unit.type
  sessionType: String, // unit.sessionType
  price: 0 / 100 (单位:分, $1 = 100), discount: 0~99,
  regMax: 100, regDate: new Date('register dealine'),
  start: new Date('start time'), end: new Date('end time'),
  zoom: { passcode: true/false, waiting_room: true/false },
  category?: '', color?: '',
  subjects?: [...],
})
```

### start session for classroom [new]

```js
await App.service('session').create({
  type: 'session', name: '',
  school?: '', classId?: '', className?: '',
  unitType: String, // unit.type
  sessionType: String, // unit.sessionType
  id: 'presentation_id (unit.sid)', cid: 'unit.id', image: 'unit.cover',
  price: 0 / 100 (单位:分, $1 = 100), discount: 0~99,
  regMax: 100, regDate?: new Date('register dealine'),
  start: new Date('start time'), end: new Date('end time'),
  zoom?: { passcode: true/false, waiting_room: true/false },
  category?: '', color?: '', subjects: [...],
  students: [...], block: true/false
})
```

### create courses

```js
await App.service('session').create({
  type: 'courses', name: '',
  school?: '', classId?: '', className?: '',
  cid: 'unit._id', image: 'unit.cover',
  unitType: String, // unit.type
  sessionType: String, // unit.sessionType
  price?: 0 / 100 (单位:分, $1 = 100), discount?: 0~99,
  regMax?: 100, regDate?: new Date('register dealine'),
  start: new Date('first session start time'), end: new Date('last session end time'),
  subjects?: [...],
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
// for teacher
const {members, sessions} = await App.service('session').get('learningData', {query: {pid: 'session._id'}})

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
  task: {
    toolCount: {...}
  }
  total: 10, // questions.length
}]

// for student
const {sessions, count} = App.service('session').get('studentLearningData', {query: {uid: 'user._id', ids: ['session._id', ...]}})

count = {
  'session._id': 1 // response.length
}

```

### home recommend
```js
const {
  live: [], student: [], booking: [], service: []
} = await App.service('session').get('recommend')

// for more list
const {total, limit, skip, data} = await App.service('session').get('recommendLive', {query: {$skip: 10}})
const {total, limit, skip, data} = await App.service('session').get('recommendStudent', {query: {$skip: 10}})
```
