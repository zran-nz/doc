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
  tool: {
    teacher: Boolean,
    self: Boolean,
    peer: Boolean,
    anonymous: Boolean,
    visible: String, // ['all', 'teacher']
  },
  toolData: [{
    name: String,
    mark: String, // mark
    type: String, // ['radio', 'text', 'number', 'date']
    options: [...String], // options
  }],
  snapshot: Mixed // library publish clone
}
```
### 
```js
// get tool list
App.service('unit').find({query: {mode: 'tool'}})

// get doc
App.service('unit').get(doc._id)

// save to history
App.service('history-tool').create({data: [...String]}) // save options to history

// get my history list
App.service('history-tool').find() // save options to history

// delete history list
App.service('history-tool').remove(doc._id)



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