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
  status: Boolean, // publish status
  del: Boolean,
  count: {
    unit: Number,
    task: Number,
    classes: Number,
  },
  standardLevel: [String],
  topicLevel: [String],
  goalLevel: [String],
  atlLevel: [String],
  standard: [outline],
  topic: [outline],
  goal: [outline],
  atl: [outline],
}

outline = {
  _id: String,
  name: String,
  grade: [String],
  tags: [String],
  code: String,
  child: [outline],
}
```
### Subjects api
```js
// get Subjects list
const list = await App.service('subjects').find({query: {}})

// get doc
const doc = await App.service('subjects').get(list.data[0]._id)

// create subject
const doc = await App.service('subjects').create({})

```
