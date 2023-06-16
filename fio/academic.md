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
  snapshot: {} // publish to snapshot
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

### Subjects store
```js
// import store
import {subjectsStore} from 'stores/subjects'
const subjects = subjectsStore()

// get subjects list
await subjects.find(uid)

// get subjects options
await subjects.getOptions(uid, 'au')

// get subject doc
await subjects.getOutline('subject._id')

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

```
