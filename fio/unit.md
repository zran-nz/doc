## Unit

### Unit model

```js
{
  // --- public ---
  createdAt: Date, // create time
  updatedAt: Date, // update time
  mode: String, // ['unit', 'task', 'pdUnit', 'pdTask', 'video', 'tool']
  service: {
    type: [], // service type = subjects._id
    participants: '', // ['educators', 'students'],
  }
  uid: String,
  name: String,
  del: Boolean, // archive status
  guest: Boolean, // allow guest view
  status: Boolean, // has remove
  subjects: [{ // publish subjects
    label: String,
    value: String
  }],
  grades: [{
    label: String,
    value: String
  }],
  duration: {
    value: Number,
    unit: String, // day or week
  },
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
    end: Date,
    size: Number // group size
  },
  filled: Boolean, // All forms have been filled

  // --- task start ---
  sid: String, // google.slides.id
  sessionType: String, // ['live', 'student']
  pageNum: Number,
  question: [String],
  isEdit: Boolean,
  // --- task end ----
  // --- unit start ---
  unit: String,
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
    // old
    // `${tag._id}`: [{value: '', mark: ''}, ...],
    // `${tag._id}:${subject1}`: [{value: '', mark: ''}, ...],
    // `${tag._id}:${subject2}`: [{value: '', mark: ''}, ...],
    // `${tag._id}:${subject3}`: [{value: '', mark: ''}, ...],
    // --- for task and unit
    `${tpl._id}`: [{value: '', mark: ''}, ...],
    `${tpl._id}`: {
      `${tpl._id}`: [{value: '', mark: ''}, ...],
      `${tpl._id}:${subject1}`: [{value: '', mark: ''}, ...],
      `${tpl._id}:${subject2}`: [{value: '', mark: ''}, ...],
    },
    // --- for AT
    `${tags._id}`: [{value: '', mark: ''}, ...],
    `${tags._id}`: {
      `${tags._id}`: [{value: '', mark: ''}, ...],
      `${tags._id}:${subject1}`: [{value: '', mark: ''}, ...],
      `${tags._id}:${subject2}`: [{value: '', mark: ''}, ...],
    },
    // ---
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
  premiumAuth: {type: Boolean, default: false}, // 是否通过精品认证
  snapshot: Mixed // library publish clone
  template: Mixed // unit-tpl.data snapshot
  income: {type: Number, default: 0}, //收入总计,单位分
}
```

### unit stores

```js
// create unit
await unit.create({mode: '', name: '', ...})

// patch unit
await unit.patch(doc._id, {...})
// patch unit name
await unit.patch(doc._id, {name: 'xxxx'})
// patch unit guest
await unit.patch(doc._id, {guest: true/false})

// unit link add
await unit.patch(doc._id, {$addToSet: {link: {...}}})
// unit link remove
await unit.patch(doc._id, {$pull: {link: {_id: 'link._id'}}})
// unit link batch remove
await unit.patch(doc._id, {$pull: {link: {_id: {$in: ['link._id', ...]}}}})

```

### filter for find

```js
// filter my contents
{tab: 'me'}
// filter share by me
{tab: 'share'}
// filter share by others
{tab: 'other'}
// filter archived
{tab: 'arch'}

// filter mode
{mode: 'task/unit/pd/pdUnit/tool'}

// filter search
{name: {$search: 'key word'}}

// filter linkNum > 0
{'linkNum': {$gt: 0}}
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

// query multiple unit details by id
await App.service('unit').get('listByIds', {query: {ids: [unit._id, unit._id]}})


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

// unpublish unit
await App.service('unit').patch('unPublish', {_id: 'unit._id'})

// publish to self-study
// await App.service('session').create('publish', {_id, 'publish.study': true})

```

[Copy or Create assessment tool](/fio/tool?id=add-assessment-tool)

[Link relate link Inquiry stages](/fio/setting?id=unit-relate-link-group-tags)

## Unit plan template

### unit-tpl-user model

```js
school: String, // school-plan._id or user._id
name: String,
curriculum: String, // user custom curriculum code
tpl: {
  // auto create
  unit: String, // unit-tpl._id
  task: String, // unit-tpl._id
}
```

### unit-tpl-user api

```js
// create
const doc = await App.service('unit-tpl-user').create({
    school: schoolIdOrUserId,
    name: '',
    curriculum: 'curric._id 自定义大纲的_id',
});
// get
const doc = await App.service('unit-tpl-user').get(doc._id);
// list
const list = await App.service('unit-tpl-user').find({
    query: { school: schoolIdOrUserId },
});
// remove
const doc = await App.service('unit-tpl-user').remove(doc._id);
```

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
await App.service('unit-tpl').get('pdUnit');
await App.service('unit-tpl').get('pdTask');
// get task sys default unit-tpl
await App.service('unit-tpl').get('task', { query: { curriculum: 'au' } });
// get unit sys default unit-tpl
await App.service('unit-tpl').get('unit', { query: { curriculum: 'au' } });
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
