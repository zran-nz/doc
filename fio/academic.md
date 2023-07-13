## Academic setting

### Subjects model
```js
{
  // --- public ---
  createdAt: Date, // create time
  updatedAt: Date, // update time
  name: String,
  curriculum: String, // curriculum code
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
    standardTitle: String,
    topicTitle: String
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
// delete subject
await subjects.delete(_id)

// get subjects list
await subjects.find(uid)

// get subjects options
await subjects.getOptions(uid, 'au')

// get subject doc
await subjects.get('subject._id')

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
const doc = await App.service('subjects').patch(doc._id, {snapshot: true})

// patch count
const doc = await App.service('subjects').patch(doc._id, {'count.standard': [3,10,40]})
```

### tags model
```js
{
  _id: String, // tag._id
  uid: String, // 课堂用户id or 表单schoolId
  set: String, // 名称
  prompt: String, 
  curriculum: [String], // 关联大纲 curriculumCode or curriculum._id
  sort: Number, // 排序用
  step: String, // 关联Unit步骤 ['basic', 'inquiry', 'applying'] 
  stepTask: String, // 关联Task步骤 ['basic', 'inquiry', 'applying']
  layer: Boolean, // 一层: false, 多层: true
  tool: Boolean, // tool use
  child: [{...tag, child: [tag]}], // 子标签
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
// delete tag
await tags.delete(_id)
// get tags list
await tags.find(uid=1)
// get tags options
await tags.getOptions(uid=1, 'au')
// get tag doc
await tags.get('tag._id')
```
