
## unit-tpl 
### unit-tpl model

```js
{
  _id: String,
  name: String, // template name
  curriculum: String, // curriculum code
  curricId: {type: String, required: true}, // user custom curric._id
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

### GET:/unit-tpl/pdUnit
```js
// get pd default unit-tpl
await App.service("unit-tpl").get("pdUnit");
```
### GET:/unit-tpl/pdTask
```js
// get pd default task-tpl
await App.service("unit-tpl").get("pdTask");
```
### GET:/unit-tpl/task
```js
// get task sys default unit-tpl
await App.service("unit-tpl").get("task", { query: { curriculum: "au" } });
```
### GET:/unit-tpl/unit
```js
// get unit sys default unit-tpl
await App.service("unit-tpl").get("unit", { query: { curriculum: "au" } });
```

### GET:/unit-tpl/:id
```js
// get unit-tpl one
const doc = await App.service('unit-tpl').get('unit-tpl._id')
```
### GET:/unit-tpl
```js
// get unit-tpl list
const doc = await App.service('unit-tpl').find({query: {school: 'school._id'}})
```
### unit-tpl api

```js
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

### GET:/unit-tpl/copyTpl
```js
// create unit and task tpl from sys tpl
await App.service("unit-tpl").get("copyTpl", { query: { curricId: 'curric._id', school: 'school-plan._id' }});
```

### PATCH:/unit-tpl/setDefault
```js
// set default unit+task tpl by unit-tpl.group
await App.service("unit-tpl").get("setDefault", { group: 'unit-tpl.group', school: 'school-plan._id' }});
```

### unit-tpl.snapshot
- 对模板和tags生成快照, 保存到课件上
- 在首次创建和切换模板的时候会调用