## Academic setting

## Curriculum model
```js
school: String, // 1 or school._id or user._id
code: String,
name: String,
subjects: [String], // Deprecated, need remove
count: {
  subjects: Number,
  skills: Number,
  tags: Number,
},
unit: [String],
task: [String],
del: Boolean,
```

### Curriculum store
```js
// create user curriculum
const doc = await curriculum.create(name, code = null, school = null)
// patch curriculum
await curriculum.patch(doc._id, post)
// archive curriculum
await curriculum.archive(doc._id)
// delete curriculum
await curriculum.delete(doc._id)
// get curriculum
await curriculum.get(doc._id)
// find curriculum list
await curriculum.find(schoolOrUid, del = null)
// get user curriculum list
await curriculum.getOptions(schoolOrUid)

curriculum.hasPlatformCode(code)
```

### Curriculum Default template
```js
// set current user Default template
await curriculum.setTplDef(code, val)
// get current user Unit Default template
await curriculum.getUnitTplDef()
// get current user Task Default template
await curriculum.getTaskTplDef()
```

### Curriculum Grade
```js
// batch create ObjectId
await curriculum.newObjectId(num = 1)

// import system curriculum: curriculumGrade -> platformGrade -> userGrade._id
// upload xlsx: parse to userGrade._id
// {curriculumGrade: [userGrade._id, ...], ...}
const {
  'systemCurriculumGrade': ['user grade._id', ...], ...
} = await curriculum.currGradeToUserGradeMap(schoolOrUid, curriculumCode)

// get user grade options
await curriculum.gradeOptions(schoolOrUid)

// add grade
await curriculum.gradeAdd(schoolOrUid, val=[{
  name: 'xxx', platform: ['platform grade', ...]},
  ...
])
// set grade
await curriculum.gradeSet(schoolOrUid, val)
// get user grades
await curriculum.gradeConf(schoolOrUid)

```

### grade count
```js
// 年级下的学科数量统计
await App.service('subjects').get('gradesCount', {query: {school: 'schoolIdOrUid'}})
// 年级下的标准班级数量统计
await App.service('classes').get('gradesCount', {query: {school: 'schoolIdOrUid'}})
```

## Subjects model
```js
{
  // --- public ---
  createdAt: Date, // create time
  updatedAt: Date, // update time
  name: String,
  subtitle: String,
  curriculum: String, // curriculum code
  subjectCode: {type: String}, // subject code
  participants?: String, // participants, ['educators', 'students']
  grade: [String],
  del: Boolean,
  count: {
    unit: Number,
    task: Number,
    classes: Number,
    standard: [Number],
    topic: [Number],
    goal: [Number],
    atl: [Number],
    standardTitle: String, // deprecated
    topicTitle: String // deprecated
  },
  standardLevel: [String],
  topicLevel: [String],
  goalLevel: [String],
  atlLevel: [String],
  standard: [outline],
  topic: [outline],
  goal: [outline],
  atl: [outline],
  code: { // `${curriculmCode}:${subjectCode}`
    standard: String,
    topic: String,
    atl: String,
  },
  source: { // import sys data
    standardCurriculum: [String], // import system data of standard curriculum.code
    standardSet: [String], // curriculum.title + subject.title
    topicCurriculum: [String], // import system data of topic curriculum.code
    topicSet: [String], // curriculum.title + subject.title
  },
  publish: [String], // has publish
  snapshot: {} // publish to snapshot
}

outline = {
  _id: String,
  name: String,
  grade: [String],
  tags: [String],
  code: String,
  mark: String,
  child: [outline],
}
```

### Subjects store
```js
// import store
import {subjectsStore} from 'stores/subjects'
const subjects = subjectsStore()

// create subject
await subjects.create({name, uid, curriculum: [], grade?: []})
// patch subject
await subjects.patch(_id, {...})
// subject subadd
await subjects.subAdd(_id, 'standard|topic', {
  child: [], code: "", grade: [], name: "", note:"", tags:[]
})
// subject subremove
await subjects.subRm(_id, 'standard|topic', sub._id)
// publish standard to snapshot
await subjects.patch(_id, {snapshot: 'standard'})
// publish topic to snapshot
await subjects.patch(_id, {snapshot: 'topic'})
// delete subject
await subjects.delete(_id)

// get subjects list
await subjects.find(uid)
// get subjects snapshot list
await subjects.find(uid, true)

// get subjects options
await subjects.getOptions(uid, 'au')

// get subject doc
await subjects.get('subject._id')
// get subject snapshot doc
await subjects.get('subject._id', true)

// import from platform
// need set code.standard = `${curriculmCode}:${subjectCode}`
await subjects.patch(_id, {
  standard: [...],
  'code.standard': 'ib-pyp:math'
})
// upload from xlsx
// need clean code.standard
await subjects.patch(_id, {
  standard: [...],
  'code.standard': ''
})

```

### Subjects api
```js
// get personal Subjects list
const list = await App.service('subjects').find({query: {}})

// get school Subjects list
const list = await App.service('subjects').find({query: {uid: 'schoolId'}})

// create personal subject
const doc = await App.service('subjects').create({name: ''})

// create school subject
const doc = await App.service('subjects').create({uid: 'schoolId', name: ''})

// get doc
const doc = await App.service('subjects').get(doc._id)

// publish snapshot subject
const doc = await App.service('subjects').patch(doc._id, {snapshot: 'standard|topic'})

// patch count
const doc = await App.service('subjects').patch(doc._id, {'count.standard': [3,10,40]})
```

## skills model
```js
{
  // --- public ---
  createdAt: Date, // create time
  updatedAt: Date, // update time
  name: String,
  subtitle: String,
  curriculum: String, // curriculum code
  grade: [String],
  del: Boolean,
  count: {
    standard: [Number],
  },
  standardLevel: [String],
  standard: [outline],
  code: { // `${curriculmCode}:${subjectCode}`
    standard: String,
  },
  source: { // import sys data
    standardCurriculum: [String], // import system data of standard curriculum.code
    standardSet: [String], // curriculum.title + subject.title
  },
  publish: [String], // has publish
  snapshot: {} // publish to snapshot
}

outline = {
  _id: String,
  name: String,
  grade: [String],
  tags: [String],
  code: String,
  mark: String,
  child: [outline],
}
```

### skills store
```js
// import store
import {skillsStore} from 'stores/skills'
const skills = skillsStore()

// create skill
await skills.create({name, uid, curriculum: [], grade?: []})
// patch skill
await skills.patch(_id, {...})
// publish tag
await skills.patch(_id, {snapshot: true})

// delete skill
await skills.delete(_id)

// get skills list
await skills.find(uid)
// get skills snapshot list 
await skills.find(uid=1, true)

// get skills options
await skills.getOptions(uid, 'au')

// get skill doc
await skills.get('subject._id')
// get skills snapshot
await skills.get('subject._id', true)

// import from platform
// need set code.standard = `${curriculmCode}:${subjectCode}`
await skills.patch(_id, {
  standard: [...],
  'code.standard': 'ib-pyp:math'
})
// upload from xlsx
// need clean code.standard
await subjects.patch(_id, {
  standard: [...],
  'code.standard': ''
})

```

## tags model
```js
{
  _id: String, // tag._id
  uid: String, // 课堂用户id or 表单schoolId
  set: String, // 名称
  prompt: String,  
  curriculum: [String], // curriculumCode or curriculum._id
  curriculum: [String], // curriculumCode or curriculum._id
  source: { // import sys data
    _id: String, // related tags._id or 'subjects'
    readonly: Boolean, // bind first level: true, import sys data: false
    curriculum: {type: [String]}, // related curriculum.code
    set: {type: [String]}, // related curriculum.name
  },
  count: [Number], // count child every level number
  sort: Number, // 排序用
  step: String, // 关联Unit步骤 ['basic', 'inquiry', 'applying'] 
  stepTask: String, // 关联Task步骤 ['basic', 'inquiry', 'applying']
  layer: Boolean, // 一层: false, 多层: true
  tool: Boolean, // tool use
  child: [{...tag, child: [tag]}], // 子标签
  configured: Boolean, // 是否存在数据
  publish: Boolean, // 发布状态
  snapshot: {} // publish to snapshot
}
tag = {
  _id: String, // tag._id
  name: String,
  prompt: String,
}
```
### tags store
```js
// import store
import {tagsStore} from 'stores/tags'
const tags = tagsStore()
// create tag
await tags.create({set: 'tag name', uid: school._id or user._id, curriculum: []})
// patch tag
await tags.patch(_id, {...})
// publish tag
await tags.patch(_id, {snapshot: true})
// delete tag
await tags.delete(_id)
// get tags list
await tags.find(uid=1)
// get tags snapshot list 
await tags.find(uid=1, true)
// get tags options
await tags.getOptions(uid=1, 'au')
// get tag doc
await tags.get('tag._id')
// get tag snapshot
await tags.get('tag._id', true)
```

## criteria model
```js
name: {type: String, required: true},
school: {type: String, required: true}, // school-plan._id
standard: [
  {
    code: {type: String, required: true, maxLength: 4}, // 缩略词, 限制4位长度
    name: {type: String, required: true}, // 名称
    desc: {type: String, required: true}, // 描述
    weight: {type: Number}, // 权重
  },
],
```
### criteria api
```js
// 获取最后使用的数据
await App.service('criteria').get('last', {query: {
  school?: school-plan._id, // 个人身份不用传
}})
// 更新最后使用的数据
await App.service('criteria').patch('last', {
  _id: 'criteria._id',
  school?: school-plan._id, // 个人身份不用传
})
// 查找
await App.service('criteria').find({query: {
  school?: school-plan._id, // 个人身份不用传
}})
// 创建
await App.service('criteria').create({
  name: 'xxx', 
  school?: school-plan._id, // 个人身份不用传
  standard?
})
// 更新
await App.service('criteria').patch(doc._id, {
  name: 'xxx',
  standard: [...]
})
// 删除单个 standard
await App.service('criteria').patch(doc._id, {
  $pull: {
    standard: {_id: 'standard._id'}
  }
})
// 增加单个 standard
await App.service('criteria').patch(doc._id, {
  $addToSet: {
    standard: {code, name, desc}
  }
})
```