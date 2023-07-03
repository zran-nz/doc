## Unit plan

### Unit plan model
```js
{
  // --- public ---
  createdAt: Date, // create time
  updatedAt: Date, // update time
  mode: String, // ['unit', 'task', 'pdUnit', 'pdTask', 'video', 'tool']
  uid: String,
  name: String,
  del: Boolean, // archive status
  status: Boolean, // has remove
  subjects: [String], // publish subjects
  publish: {
    lib: Boolean, // to library
    link: Boolean, // link content publish
  },
  curriculumn: String, // readonly, curriculumn code 
  tpl: String, // unit-tpl._id
  overview?: String,
  cover: String,
  type?: String, // ['FA', 'SA', 'Activity', 'IA', 'single', 'integrated']
  source: String, // library auther user._id
  discount: {
    val: Number, // discount value 0-99
    price: Number, // original price
    size: Number // group size
  },
  filled: Boolean, // All forms have been filled

  // --- task start ---
  sid: String, // google.slides.id
  sessionType: String, // ['live', 'student']
  pageNum: Number,
  question: [String],
  isEdit: Boolean,
  // --- task end ---
  // --- unit start ---
  grade: [Number], // [6, 12]
  unit: String,
  duration: Number,
  idea: String,
  words: [String],
  inquiry: [String],
  goals?: [String],
  connection?: String,
  linkGroup: [{
    name: String, // 'Week 1', 'Week 2', ...
    alias: String,
  }],
  // --- unit end ---
  ext?: {
    _id: any,
    `${tag._id}`: [{value: '', mark: ''}, ...],
    `${tag._id}:${subject1}`: [{value: '', mark: ''}, ...],
    `${tag._id}:${subject2}`: [{value: '', mark: ''}, ...],
    `${tag._id}:${subject3}`: [{value: '', mark: ''}, ...],
    `${group}:${opt1}`: [{value: '', mark: ''}, ...],
    `${group}:${opt2}`: [{value: '', mark: ''}, ...],
    `${group}:${opt3}`: [{value: '', mark: ''}, ...],
    ...
  },
  link: [{
    id: String, // relate id: task.id pd.id
    type: String, // task/pd
    group?: String,
  }],
  snapshot: Mixed // library publish clone
  template: Mixed // unit-tpl.data snapshot
}
```
### unit api
```js
// find unit list
// lib: library, published: my published, me: my contents, share: shared by me, other: shared by other
const list = await App.service('unit').find({query: {tab: 'lib/published/me/share/other', ...}})

// get unit data
const doc = await App.service('unit').get('unit._id')

// patch Attributes
await App.service('unit').patch(doc._id, {key: val})
await App.service('unit').patch(doc._id, {`ext.${key}`: ext[key]})

// get unit outline
await App.service('task-outline').get('byRid', {query: {_id: doc._id}})

// get recommend idea
const list = await App.service('unit').get('recommendIdea', {query: {key: 'keyword'}})
// list = [{idea: '', words: ['', ...]}, ...]
// get recommend words
const list = await App.service('unit').get('recommendWords', {query: {key: 'keyword'}})
// list = ['xxx', ...]

// get recommend Inquiry
await App.service('unit').get('recommendInquiry', {query: {_id: doc._id}})
// list = ['', '', ...]

// get child list
const list = await App.service('unit').get('child', {query: {pid: 'unit._id'}})


```
### unit link api
```js
// get relate link list
const list = await App.service('unit').get('relateLinkList', {query: {rid: 'unit._id'}})

// get all relate link list
const list = await App.service('unit').get('allRelateLinkList', {query: {rid: ['unit._id', ...]}})

```
### unit copy api
```js
// for self content
const doc = await App.service('unit').patch('copy', {_id: 'unit._id', name?: ''})
// for library
const doc = await App.service('unit').patch('copy', {_id: 'unit._id', orderId: 'order._id', name?: ''})
```

### unit publish api
```js
// publish unit self
await App.service('unit').patch('publish', {_id, discount: {val, price, size}, subjects: [...], 'publish.lib': true})

// publish unit link content
await App.service('unit').patch('publish', {_id, 'publish.link': true})

// publish to self-study
// await App.service('session').create('publish', {_id, 'publish.study': true})

```

[Copy or Create assessment tool](/fio/tool?id=add-assessment-tool)

[Link relate link Inquiry stages](/fio/setting?id=unit-relate-link-group-tags)

## Unit plan template

### unit-tpl model
```js
{
  _id: String,
  name: String, // template name
  curriculum: String, // curriculum code
  school: String, // school-plan._id or user._id
  mode: String, // ['unit', 'task', 'pdUnit', 'pdTask', 'video', 'tool']
  data: [{
    code?: String, // private variable
    enable: Boolean,
    type: String, // form type: [text, text-multiple, radio, choice, choice-mark]
    group: String, // ['basic', 'inquiry', 'applying', '', 'link']
    name: String, //
    prompt?: String,
    tags?: String, // relate tags code
    diy: Boolean, // tag diy
  }], // 
}
```

### Tpl Public Config
[Unit/Task/PD Tpl Public Config](/fio/setting?id=unittaskpd-tpl-public-config)

### Platform Default unit-tpl api
```js
// get pd default unit-tpl
await App.service('unit-tpl').get('pdUnit')
await App.service('unit-tpl').get('pdTask')
// get task sys default unit-tpl
await App.service('unit-tpl').get('task', {query: {curriculum: 'au'}})
// get unit sys default unit-tpl
await App.service('unit-tpl').get('unit', {query: {curriculum: 'au'}})
```

### unit-tpl api
```js
// get unit-tpl one
const doc = await App.service('unit-tpl').get('unit-tpl._id')
// get unit-tpl list
const doc = await App.service('unit-tpl').find({query: {school: 'school._id'}})
// get default school user unit-tpl
let doc = await App.service('conf-user').get('UnitTplDefault')
let doc = await App.service('conf-user').create({key: 'UnitTplDefault', val: {}})
// set default school user unit-tpl
let rs = await App.service('conf-user').patch(doc._id, {val: {
  personal: unit-tpl._id, // for personal
  [schooId]: unit-tpl._id, // for school
  [schooId]: unit-tpl._id, // for school
  ...
}})

// get default school unit-tpl
// let rs = await App.service('conf-school').get('get', { query: {key: 'UnitTplDefault', rid: schoolId}})
// auto create default set
// if (!rs) rs = await App.service('conf-school').create({key: 'UnitTplDefault', rid: schoolId, val: []})
// update default school unit-tpl
// App.service('conf-school').patch(_id, {val: { 'curriculumnCode': 'unit-tpl._id', ... }})

// get public data
const pubData = await App.service('conf').get('UnitTpl')

// first create
const doc = await App.service('unit-tpl').create({ name: '', school: 'school._id', data: [] })

// get unit-tpl data
const doc = await App.service('unit-tpl').get(_id)

// auto merge pubData to doc
const dataList = {}
doc.data.map(v => {
  if (v.code) dataList[v.code] = v
})
let needUpdate = false
pubList.map(v => {
  if (dataList(v.code)) Object.assign(dataList[v.code], v)
  else doc.data.push(v), needUpdate = true
})
if (needUpdate) await App.service('unit-tpl').patch(_id, doc)

// add sub data
const doc = await App.service('unit-tpl').patch(_id, {$addToSet: {data: subdata}})

// patch sub data
const doc = await App.service('unit-tpl').patch(_id, {'data.$': {...subdata}}, {query: {'data._id': data._id}})

// remove sub data
const doc = await App.service('unit-tpl').patch(_id, {$pull: {data: {_id: subdata._id}}})

```


## Reflection
### Reflection model
```js
{
  createdAt: Date, // create time
  updatedAt: Date, // update time
  mode: String, // ['refl', 'comment']
  school: String, // pub.user.schoolInfo._id
  uid: String, // pub.user._id
  pid?: String, // parent reflection._ids
  unit: String, // unit._id
  rkey: String, // unit.key or ext.tag._id
  content: String, // attachment
  attach: [String], // file._id
  visible: String, // ['all', 'school', 'private']
}
```
### Reflection api
```js
// batch get reflection or comment by unit._id
const list = await App.service('reflection').find({query: {mode: 'refl', unit: 'unit._id'}})
// create reflection or comment
const doc = await App.service('reflection').create({mode: 'refl', school, pid, unit, rkey, content, attach})
// patch reflection or comment
const doc = await App.service('reflection').patch(doc._id, {content, attach})
// remove reflection or comment
await App.service('reflection').remove(doc._id)

// batch get fileinfo by files._id
await App.service('files').get('fileInfo', {query: ['a7f530021db91e3c36a9ea7f2a32162af4bd00aa', ...]})
```