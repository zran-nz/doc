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
  toolGroup: [{
    _id: String, // tagGroup._id or auto create
    name: String, // tagGroup.name, read-only if tag exists
    tag: String, // tag._id
    index: [String], // [toolData._id, ...]
    teacher: Boolean,
    self: Boolean,
    peer: Boolean,
    anonymous: Boolean,
    visible: String, // ['all', 'teacher']
  }],
  toolData: [{
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
### 
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