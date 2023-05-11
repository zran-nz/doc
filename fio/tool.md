## Assessment tool

### Assessment tool model
```js
{
  // --- public ---
  createdAt: Date, // create time
  updatedAt: Date, // update time
  mode: String, // ['unit', 'task', 'pd', 'video', 'tool']
  uid: String,
  name: String,
  del: Boolean, // archive status
  status: Boolean, // publish status
  overview?: String,
  cover: String,
  type?: String, // ['FA', 'SA', 'Activity', 'IA', 'single', 'integrated']
  source: String, // library auther user._id
  price: Number, // publish price
  toolType: String, // ['title', 'diy', 'report']
  toolGroup: [{
    _id: String, // tagGroup._id or outline.child.$._id or auto create
    name: String, // tagGroup.name, read-only if tag exists
    tag: String, // tag._id or outline.child.parent._id or 'ib-myp:Design:custom'
    index: [...String], // [toolData._id, ...]
    teacher: Boolean,
    self: Boolean,
    peer: Boolean,
    anonymous: Boolean,
    visible: String, // ['all', 'teacher']
    mark: String,
    type: String, //  ['radio', 'text', 'number', 'date']
    options: [...String],
  }],
  toolData: [{
    _id: String, // outline.child.$._id or auto create
    group: String, // toolGroup._id
    name: String, // tag.name, read-only if tag exists
    mark: String, // mark
    type: String, // ['radio', 'text', 'number', 'date']
    options: [...String], // options
  }],
  ext: { // linked data, from link unit ext
    _id: any,
    `${tag._id}`: [{value: '', mark: ''}, ...],
    `${tag._id}:${subject1}`: [{value: '', mark: ''}, ...],
  }
}
```
### tool api
```js
// get tool list
const list = await App.service('unit').find({query: {mode: 'tool'}})

// get doc
const doc = await App.service('unit').get(list.data[0]._id)
// use toolData by sort
doc.toolData.setKey('_id')
for(const group of doc.toolGroup){
  for(const _id of group.index) {
    console.warn(doc.toolData.get(_id))
  }
}

const tool = doc.toolData[0]
// patch toolData
App.service('unit').patch(doc._id, {'toolData.$': {group, name, mark, type, options}}, {query: {'toolData._id': tool._id}})
// patch toolData single Attributes
App.service('unit').patch(doc._id, {'toolData.$.options': ['111','222','333']}, {query: {'toolData._id': tool._id}})
// patch toolData sort
App.service('unit').patch(doc._id, {'toolGroup.$.index': [tool._id,tool._id,...]}, {query: {'toolGroup._id': toolGroup._id}})


// save to history
App.service('history-tool').create({data: [...String]}) // save options to history

// get my history list
App.service('history-tool').find() // save options to history

// delete history list
App.service('history-tool').remove(doc._id)

// add tag to linked data
App.service('unit').patch(doc._id, {[`ext.${tag._id}`]: {}})


// example test
var doc = await App.service('unit').create({mode: 'tool', name: 'tool test', curriculum: 'au'})
console.warn(doc)
doc = await App.service('unit').patch(doc._id, {$addToSet:{
  toolData: [{name: 'test1', mark: 'mark1', type: 'radio', options: ['Yes', 'No']}]
}})
console.warn(doc.toolData)
doc = await App.service('unit').patch(doc._id, {$pull: {toolData: doc.toolData[0]}})
console.warn(doc.toolData)
await App.service('unit').remove(doc._id)

var doc = await App.service('history-tool').create({data: ['Yes', 'No3']}).catch(e => null)
console.warn(doc)
var list = await App.service('history-tool').find()
console.warn(list)
if (doc) await App.service('history-tool').remove(doc._id)

```

### add assessment tool
```js
// create assessment tool form unit
doc = await App.service('unit').get('copyTool', {query: {unit: 'unit._id'}})
// copy assessment tool form unit
doc = await App.service('unit').get('copyTool', {query: {unit: 'unit._id', _id: 'unit._id', name?: ''}})
```

### tool outline to section
```js


```


### Assessment tool data model
```js
{
  session: String, // relate session.sid
  tool: String, // relate unit._id for assessment tool
  task?: String, // relate unit._id for task
  unit?: String, // relate unit._id for unit
  assessor: String, // assessor user._id 
  student: String, // student user._id
  data: {
    `toolData._id or toolGroup._id`: { // toolData._id or toolGroup._id
      val: { type: String },
      val2: { type: String },
      val3: { type: String },
    },
    ...
  },
}
```

### tool data api
```js
// create
const doc = await App.service('tool-data').create({
  session: 'session.sid', tool: 'unit._id', student: 'user._id', data: {'toolData._id': {val: ''}, ...}
})

// find by tool
const doc = await App.service('tool-data').find({query: {session: 'session.sid', tool: 'unit._id'}})

// patch all students
const rs = App.service('tool-data').patch('all', {`data.${toolData._id}`: {val: '123', ...}}, {query: {session: 'session._id'}})

// init for teacher
const memberList = await App.service('session').get('toolMembers', {query: {sid: 'session.sid'}})
for(const o of memberList) {
  await App.service('tool-data').create({session: 'session.sid', tool: 'unit._id', student: v._id, data: {}})
}

```

[Session Members](/fio/session?id=get-members-for-assessment-tool)