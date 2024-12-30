## school

### classes model
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
enroll: {
  enable: {type: Boolean, default: false},
  classes: {type: [String], default: false}, // classes._id, filter(type === 'standard')
},
time: {type: Number}, // session time, unit sec
break: {type: Number}, // break time, unit sec
block: [
  {
    week: {type: Number}, // day of the week, 0-6, new Date().getDay(): Sunday - Saturday : 0 - 6
    start: {type: String, required: true}, // 00:00, hour:min
    end: {type: String, required: true},
    every: {type: Number, default: 1},
    repeat: {type: String, enum: Agl.classesBlockRepeat},
  },
],
```