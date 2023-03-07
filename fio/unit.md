## Unit plan

### Unit plan model
```js
{
  // --- public ---
  mode: String, // ['unit', 'task', 'pd', 'video', 'tool']
  uid: String,
  name: String,
  curriculumn: String, // readonly, curriculumn code 
  overview?: String,
  cover: String,
  type?: String, // ['FA', 'SA', 'Activity', 'IA', 'single', 'integrated']
  // --- task start ---
  sid: String, // google.slides.id
  pageNum: Number,
  question: [String],
  // --- task end ---
  // --- unit start ---
  idea: String,
  words: [String],
  inquiry: [String],
  goals?: [String],
  connection?: String,
  linkGroups: [String], // ['Week 1', 'Week 2', ...]
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
}
```
### unit api
```js
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

// get recommend Inquiry
await App.service('unit').get('recommendInquiry', {query: {_id: doc._id}})
// list = ['', '', ...]

// get relate link list
const list = await App.service('unit').get('relateLinkList', {query: {rid: 'unit._id'}})

```
[Link relate link Inquiry stages](/fio/setting?id=unit-relate-link-group-tags)

## Unit plan template

### unit-tpl model
```js
{
  _id: String,
  name: String, // template name
  curriculum: String, // curriculum code
  school: String, // school-plan._id
  data: [{
    code?: String, // private variable
    enable: Boolean,
    type: String, // form type: [text, text-multiple, radio, choice, choice-mark]
    group: String, // ['basic', 'inquiry', 'applying', '', 'link']
    name: String, //
    prompt?: String,
    // sort?: Number,
    tags?: String, // relate tags code
  }], // 
}
```
### unit-tpl public data
```js
// default unit form
[
  {group: 'basic', required: true, enable: true, code: 'name', origin: 'Unit Name', type: 'text', tips: ''},
  {group: 'basic', required: true, enable: true, code: 'cover', origin: 'Cover', type: 'image', tips: ''},
  {group: 'basic', required: false, code: 'unit', origin: 'Project-based Unit', type: 'radio', tips: ''},
  {group: 'basic', required: false, code: 'type', origin: 'Unit Type', type: 'radio', tips: ''},
  {group: 'basic', required: false, code: 'overview', origin: 'Overview', type: 'text', tips: ''},
  {group: 'inquiry', required: true, enable: true, code: 'idea', origin: 'Big Idea/ Statement of Inquiry/ Central Idea', type: 'text', tips: ''},
  {group: 'inquiry', required: true, enable: true, code: 'words', origin: 'Key words', type: 'text-multiple', tips: ''},
  {group: 'inquiry', required: false, code: 'goals', origin: 'UN Sustainable Development Goal(s)', type: 'choice', tips: ''},
  {group: 'inquiry', required: true, enable: true, code: 'inquiry', origin: 'Key question(s) / Line(s) of inquiry', type: 'text-multiple', tips: ''},
  {group: 'inquiry', required: false, code: 'connection', origin: 'Real World Connection(s)', type: 'radio', tips: ''},
]
```

### unit-tpl api
```js
// get unit-tpl list
const doc = await App.service('unit-tpl').find({query: {school: 'school._id'}})
// get default school unit-tpl
let rs = await App.service('conf-school').get('get', { query: {key: 'UnitTplDefault', rid: schoolId}})
// auto create default set
if (!rs) rs = await App.service('conf-school').create({key: 'UnitTplDefault', rid: schoolId, val: []})
// update default school unit-tpl
App.service('conf-school').patch(_id, {val: { 'curriculumnCode': 'unit-tpl._id', ... }})

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
