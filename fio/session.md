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
  order: String, // order._id
}],

// for class session
school: String, // school-plan._id
classId: String, // classes._id
className: String, // classes.name
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
  sessionType: String, // unit.sessionType, ['live', 'student']
}],

// snapshot data
task: {
  ..., // task.[] snapshot
  outline: {
    assess: Mixed, // task-outline.assess snapshot
    outline: Mixed, // task-outline.outline snapshot
  }
},
video: {type: Schema.Types.Mixed}, // interactive-videoes snapshot
pages: Mixed, // slides.pages snapshot
questions: Mixed, // questions snapshot
reminder: Number, // mail notice: WorkshopReminderBeforeClass
drawkey: String, // excalidraw room key
// for service 捆绑服务包（只有父课程能捆绑，pid: null）
premium: {type: Boolean, default: false}, // 是否为精品公开课
promotion: {type: Boolean, default: false}, // 是否为推广课
promotionSession: {type: String}, // 关联推广课的session._id，用于上课new prompt选择
servicePack: { // 公开课捆绑销售的服务包
  _id: {type: String}, // service-pack._id 服务包id
  times: {type: Number}, // live直播课的数量
  price: {type: Number}, // 美分，服务包价格 = service-pack.discount 折扣 * live直播课的数量
},
// for service booking
booking: {type: String}, // service-booking._id 学生的预约
tutorialPackUser: {type: String}, // Lecture关联的辅导包 https://github.com/zran-nz/bug/issues/5584
income: {type: Number, default: 0}, //收入总计,单位分
personal: {type: Boolean, default: false}, // 个人老师排的课
count: {
  students: {type: Number, default: 0}, // 排课或报名的学生数量，需要做报告的学生
  report: {type: Number, default: 0}, // 已经发送报告的数量
},
isView: {type: Boolean, default: false}, // 是否点击查看过takeaway页面 https://github.com/zran-nz/bug/issues/5479#issuecomment-2408292950
freePromptCount: {type: Number, default: 0}, // Prompts免费购买次数统计

substituteWithin: {type: Boolean, default: false}, // 代课 校内/校外
substituteTeacher: {type: String}, // 代课老师的id
substituteTeacherStatus: {type: Number}, // 代课老师 0: 待审核/Pending, 1: 已通过/Approved
substituteTeacherMessage: {type: String}, // 给老师留言
substituteAdmin: {type: String}, // 代课审批管理员
substituteAdminStatus: {type: Number}, // 管理员 0: 待审核/Pending, 1: 已通过/Approved
substituteAdminMessage: {type: String}, // 给管理员留言
substitutePackUser: {type: String}, // 关联使用的服务包 service-pack-user._id
substituteServicePackSnapshot: {type: Schema.Types.Mixed}, // 使用的服务包快照
substituteServicePackUserSnapshot: {type: Schema.Types.Mixed}, // pack-user快照
substituteSubject: {type: [String], trim: true}, // subjects._id
substituteTopic: {type: [String], trim: true}, // topic._id
substitutePush: {type: [String], trim: true}, // 已推送老师uid
substituteDuration: {type: Number}, // 校外 使用的服务包分钟数
substitutePushTime: {type: Date}, // 上次推送时间
substitutePushAll: {type: Boolean}, // 是否已推送全部老师
substitutePriorityPush: {type: Boolean}, // 线下 是否已进行优先推送
substituteReminder: {type: Boolean}, // 代课 开课前3小时 未匹配 通知
substituteMatched: {type: Boolean}, // 历史上匹配成功过 取消代课不删除此字段
substituteExclude: {type: [String], trim: true}, // 排除老师uid 有匹配过的
substitutePriority: {type: Boolean}, // 线下 优先推送匹配到的 没有路程补贴 (同地点结束一小时内优先推送的老师)
```

### type

> for school classroom, need select students  
> task => session  
> unit => courses  
> pdTask => pdClassSession  
> pdUnit => pdClassCourses

> for school students public, need register (only for internal school students)  
> task => taskSchoolWorkshop  
> unit => unitSchoolCourses  
> pdTask => pdSchoolStudentWorkshop  
> pdUnit => pdSchoolStudentCourses  
> tool => studentTool (import)

> for school educators public, need register (only for internal school teachers)  
> pdTask => pdSchoolTeacherWorkshop  
> pdUnit => pdSchoolTeacherCourses  
> tool => schoolEducatorTool (import)

> for school educators, need select internal school teachers  
> pdTask => pdSchoolWorkshop  
> pdUnit => pdSchoolCourses  
> tool => educatorTool (import)

> for students public, need register (only for students)  
> task => taskWorkshop  
> unit => unitCourses  
> pdTask => studentWorkshop  
> pdunit => studentCourses

> for educators public, need register (only for teachers)  
> pdTask => workshop  
> pdunit => pdCourses

### type for booking

> for educators booking

-   task => bookingTask
-   pdTask => bookingPdTask

> for Student booking

-   task => bookingStuTask
-   pdTask => bookingStuPdTask

> 用于 education consultant - interview for teacher verification

-   task => jobSeekerTask
-   pdTask => jobSeekerPdTask

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

// filter by user field
// fieldType: {type: String, enum: ['email', 'mobile', 'classcipeId']}
{'userField': 'xxx', 'userFieldType': 'email/mobile/classcipeId'}

// query multiple session details by id
await App.service('session').get('listByIds', {query: {ids: [session._id, session._id]}})
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
await App.service('session').patch(
    _id,
    {
        'quetions.$.options': [...options],
    },
    { query: { 'questions._id': '' } }
);
```

### start quick session [new]

`await App.service('session').create({ id: 'presentation_id', image: 'cover url', guest: true })'`

### start booking session

```js
await App.service('session').create({
  type,
  name,
  image: 'cover url',
  unitType: String, // unit.type
  sessionType: String, // unit.sessionType
  start: new Date('start time'), end: new Date('end time'),
  zoom: { passcode: true/false, waiting_room: true/false },
  category?: '', color?: '',
  subjects?: [...],
  students: {type: [String]}, // session student user_id
  pages: {type: Schema.Types.Mixed}, // slides.pages snapshot
  questions: {type: Schema.Types.Mixed}, // questions snapshot
  materials: {type: Schema.Types.Mixed}, // materials snapshot
  booking: {type: String}, // service-booking._id 学生的预约
})
```

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
await App.service('session').patch(_id, {
    name: '',
    image: 'cover url',
    regMax: 100,
    regDate: new Date('register dealine'),
    start: new Date('start time'),
    end: new Date('end time'),
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
    $addToSet: {
        reg: {
            avatar: pub.user.avatar,
            nickname: pub.user.nickname,
            _id: pub.user._id,
        },
    },
});

// unregister
await App.service('session').patch(session._id, {
    $pull: { reg: { _id: 'reg._id' } },
});
```

### live workshop list [new]

```js
// live workshop - featured
await App.service('session').find({
    query: {
        del: false,
        isLib: true,
        school: null,
        type: 'workshop',
        status: { $ne: 'close' },
        end: { $gte: new Date() },
        $sort: { start: 1, name: 1, _id: 1 },
    },
});
// live workshop - scheduled
await App.service('session').find({
    query: {
        del: false,
        school: { $in: [...school.id, null] },
        type: 'workshop',
        status: { $ne: 'close' },
        start: { $gte: new Date() },
        $sort: { _id: -1 },
        'reg._id': pub.user._id,
    },
});
// live workshop - on-going
await App.service('session').find({
    query: {
        del: false,
        school: { $in: [...school.id, null] },
        type: 'workshop',
        status: { $ne: 'close' },
        start: { $lte: new Date() },
        $sort: { _id: -1 },
        'reg._id': pub.user._id,
    },
});
// live workshop - ended
await App.service('session').find({
    query: {
        del: false,
        school: { $in: [...school.id, null] },
        type: 'workshop',
        status: 'close',
        start: { $lte: new Date() },
        $sort: { _id: -1 },
        'reg._id': pub.user._id,
    },
});
```

### Session list for class [new]

```js
// scheduled
await App.service('session').find({
    query: {
        del: false,
        classId: '',
        type: 'session',
        status: { $ne: 'close' },
        start: { $gte: new Date() },
        $sort: { start: 1, name: 1, _id: 1 },
    },
});
// on-going
await App.service('session').find({
    query: {
        del: false,
        classId: '',
        type: 'session',
        status: { $ne: 'close' },
        start: { $lte: new Date() },
        $sort: { _id: -1 },
    },
});
// ended
await App.service('session').find({
    query: {
        del: false,
        classId: '',
        type: 'session',
        status: 'close',
        $sort: { _id: -1 },
    },
});
// archived
await App.service('session').find({
    query: {
        del: true,
        classId: '',
        type: 'session',
        status: 'close',
        $sort: { _id: -1 },
    },
});

// ext search
$or: [{ name: { $search: '123' } }];
```

### Session list for calendar

```js
// 根据时间范围过滤
await App.service('session').get('calendarList', {
    query: {
        start: new Date('start time'),
        end: new Date('end time'),
        zone: new Date().getTimezoneOffset(),
    },
});

// 所有为该学校老师排的公开课
query.school = 'school-plan._id';
query.type = { $in: ['pdSchoolTeacherWorkshop'] };

// 所有为该学校学生排的公开课
query.school = 'school-plan._id';
query.type = { $in: ['taskSchoolWorkshop', 'pdSchoolStudentWorkshop'] };

// 班级下所有类型的live课
query.classId = 'classes._id';

// 所有我上的课
query = {};

// 所有我参与的课
query.$or = [{ 'reg._id': 'user._id' }, { students: 'user._id' }];
```

### Session list for date

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

-   \_id 为 session.\_id

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
const doc = await App.service('session').get('toolMembers', {
    query: { sid: 'session.sid', role: 'student' },
});
// get members for teacher
const doc = await App.service('session').get('toolMembers', {
    query: { sid: 'session.sid' },
});

// example test
var doc = await App.service('session').get('63eed1c5338d4d5568c5ab94');
await App.service('session').patch(doc._id, {
    _date: new Date(doc.start).toString(),
    $addToSet: {
        reg: { avatar: Auser.avatar, nickname: Auser.nickname, _id: Auser._id },
    },
});
await App.service('session').get('toolMembers', {
    query: { sid: 'C17cmGC9', role: 'student' },
});
await App.service('session').get('toolMembers', { query: { sid: 'C17cmGC9' } });
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
    // for teacher
    live: [],
    student: [],
    // for students or register
    myLive: [],
    myStudent: [],
    // service
    booking: [],
    service: [],
    toBeBooked: [], // 可预约列表
    toBeScheduled: [], // 待排课列表
} = await App.service('session').get('recommend');

// query filter
query.dateRange = [start, end, zone];
(query.status = 'scheduled'), 'ongoing', 'ended';

// for more list
const { total, limit, skip, data } = await App.service('session').get('recommendLive', { query: { $skip: 10 } });
const { total, limit, skip, data } = await App.service('session').get('recommendStudent', { query: { $skip: 10 } });
const { total, limit, skip, data } = await App.service('session').get('recommendMyLive', { query: { $skip: 10 } });
const { total, limit, skip, data } = await App.service('session').get('recommendMyStudent', { query: { $skip: 10 } });
```

### Roaster

```js
const [...] = await App.service('session').get('roaster', {query: {sid: session.sid}})
```

### student study center

```js
// 自学习中心首页
const { study, live, premium } = await App.service('session').get('indexStudent', {
    query: { $limit: 10 },
});

// 自学习列表
const {
    data: [],
    total,
    limit,
    skip,
} = await App.service('session').get('indexStudy', {
    query: { $limit: 10, $skip: 0 },
});

// live列表
const {
    data: [],
    total,
    limit,
    skip,
} = await App.service('session').get('indexLive', {
    query: { $limit: 10, $skip: 0 },
});

// premium列表
const {
    data: [],
    total,
    limit,
    skip,
} = await App.service('session').get('indexPremium', {
    query: { $limit: 10, $skip: 0 },
});
```

### 推广课接口

```js
const {
    data: [],
    total,
} = await App.service('session').get('indexPromotion');
```

### 插入云端 Prompts

```js
await App.service('session').patch('insertPrompts', { _id: 'session._id', promptId: 'prompts._id', index: '插入的位置' });
```

### new prompt

```js
await App.service("session").patch("newPrompt", {
  _id: "session._id",
  index?: 1, // 插入的位置, 不传则插入在最后
  page: {
    pic: "8852b1ae0e5d8c5a8ba4fe9e19f135d288d0c72a", // 图片hash值
    size: 37907, // 图片的大小
  },
  questions: [ // 参考addon下的 questions model
    {
      type: "website", // ['text', 'choice', 'comment', 'draw', 'media', 'website']
      multi: false,
      scoreEnable: false
      data?: 'url' // website 传url
    },
  ],
  materialsList: [{
    _id: '', // service-pack.attachments._id
    type: '', // youtube or service-pack.attachments.mime.split('/')[0] (mime只取类型)
    desc: '', // youtube video name or service-pack.attachments.filename
    key: '', // for file, service-pack.attachments.hash
    url: '', // for youtube
    size: 0,
  }]
});
```

### substitute

```js
// 代课 管理员待审核数量
await App.service('session').get('substituteAdminCount', { query: { school: 'school-plan._id' } });
```

### create video

```js
await App.service('session').create({
  type: 'videoSession',
  status: 'student', sessionType: 'student',
  cid: 'unit.id', image: 'unit.cover',
  regMax: 0,
  subjects?,
})
```
