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

  ext?: [{
    name: String,
    mark: String, // mark
    type: String, // ['radio', 'text', 'number', 'date']
    options: [...String], // options
    teacher: Boolean,
    self: Boolean,
    peer: Boolean,
    anonymous: Boolean,
    visible: String, // ['all', 'teacher']
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
App.service('history').create([...String]) // save options to history

// get my history list
App.service('history').find() // save options to history

```
