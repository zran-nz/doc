### class model

```js
school: {type: String, required: true},
type: {type: String, default: 'standard', enum: Agl.classesTypes},
host: {type: String}, // user._id 标准班班主任，或者学科班创建人
grade: {type: String, required: true},
name: {type: String, required: true},
del: {type: Boolean, default: false},
count: {
  teacher: {type: Number, default: 0},
  student: {type: Number, default: 0},
  journalPub: {type: Number, default: 0}, // 班级下的journal统计
  journalUnPub: {type: Number, default: 0},
},
// for subject
term: {type: String, trim: true}, // school-term._id
curriculum: {type: String, trim: true}, //
subject: {type: String, trim: true}, //
subjectTemporary: {type: String, trim: true}, // 临时学科
enroll: {
  enable: {type: Boolean, default: false}, // 自主报名
  classes: {type: [String], default: false}, // classes._id, filter(type === 'standard')
},
attachmentsCover: {
  filename: {type: String, trim: true}, // 文件名
  mime: {type: String, trim: true}, // 文件 MIME
  hash: {type: String, trim: true}, // 文件SHA1, files._id
},
deadline: {type: Date}, // deadline
maxParticipants: {type: Number}, // 最大人数 0:不限制
approvalEnable: {type: Boolean, default: false}, // 报名审批开关
questions: {type: [String]},
// time: {type: Number}, // session time, unit sec
// break: {type: Number}, // break time, unit sec
block: [
  {
    week: {type: Number}, // day of the week, 0-6, new Date().getDay(): Sunday - Saturday : 0 - 6
    start: {type: String, required: true}, // 00:00, hour:min
    end: {type: String, required: true},
    every: {type: Number, default: 1},
    repeat: {type: String, enum: Agl.classesBlockRepeat, default: 'week'},
  },
],
```

### class API

```js
// 添加班主任
await App.service('class').patch(_id, { host: uid });
```

### class-apply model

```js
student: {type: String, trim: true, required: true}, // students._id
type: {type: String, default: 'subject', enum: Agl.classesTypes},
school: {type: String, required: true, trim: true}, // school-plan._id
class: {type: String, trim: true, required: true}, // class._id
answers: {type: Schema.Types.Mixed},
status: {type: Number, default: 0}, // 0: pending, 1: approved, -1: rejected
```

### class-apply API

```js
/**
 * 创建报名
 * status 不用传,默认为0,approvalEnable=false时,status默认为1
 */
await App.service('class-apply').create({
    student: 'students._id',
    class: 'classes._id',
    school: 'school-plan._id',
});
// 通过审核 会自动更新students.subjectClass
await App.service('class-apply').patch(_id, { status: 1 });

// 报名通过 加入班级学生数量
await App.service('class-apply').get('count', { query: { class: 'class._id' } });
```

### class-question-logs model

```js
uid: {type: String, trim: true}, // user._id
questions: {type: [String]},// classes在create或patch字段questions时,会更新本表字段,每次更新需提交整个字段classes.questions,不要使用addToSet或pull等
```
