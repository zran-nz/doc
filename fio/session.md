

## Session API

### Session model
```js
sid: String // session code
image: String,
name: String,
start: Date
end: Date
status: String, // ['live', 'close', 'student']
type: String, // content type: ['session', 'workshop']
uid: String, // user._id
zoom: Mixed, // session zoom
cid: String, // related task.id or content.id

// extend
id: String, // deprecated: old task.presentation_id, slides.id
rev: String, // deprecated: old task.revision_id, slides.rev
rid: String, // deprecated: old class.id
size: Number, // pages size + room student comments + response size
del: Boolean, // true: archive, false: restore

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
taskType: String, // task.task_type
unit: String, // related unit.id
students: { type: [String] }, // class session: student user._id

// snapshot data
task: Mixed, // task.[] snapshot
pages: Mixed, // slides.pages snapshot
questions: Mixed, // questions snapshot
assess: Mixed, // task-outline.assess snapshot
outline: Mixed, // task-outline.outline snapshot
reminder: Number, // mail notice: WorkshopReminderBeforeClass
drawkey: String, // excalidraw room key
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
  id: 'presentation_id', cid: 'content.id', image: 'cover url',
  price: 0 / 100 (单位:分, $1 = 100), discount: 0~99,
  regMax: 100, regDate: new Date('register dealine'),
  start: new Date('start time'), end: new Date('end time'),
  zoom: { passcode: true/false, waiting_room: true/false }
})
```

### start session [new]

```js
await App.service('session').create({
  type: 'session', name: '',
  school?: '', classId?: '', className?: '',
  taskType?: '', // import by task
  id: 'presentation_id', cid: 'content.id', image: 'cover url',
  price: 0 / 100 (单位:分, $1 = 100), discount: 0~99,
  regMax: 100, regDate?: new Date('register dealine'),
  start: new Date('start time'), end: new Date('end time'),
  zoom?: { passcode: true/false, waiting_room: true/false }
})
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
    taskType?: [...'task_type'], // task session filter
    uid?: pub.user._id / { $ne: pub.user._id }, // only launch by me
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

## Student response

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
