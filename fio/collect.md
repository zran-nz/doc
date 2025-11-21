## collab model
```js
type: {type: String, required: true, enum: [...Agl.unitMode, 'teacher']}, // type [task, unit, ..., teacher]
rid: {type: String, required: true}, // ref unit._id or teacher.uid
name: {type: String}, // ref name or teacher name
uid: {type: String, required: true}, // users._id
school: {type: String}, // school-plan._id
```


### for personal collect 
```js
// teacher list
await collab.find({query: {type: 'teacher'}})

// unit list
await collab.find({query: {type: {$ne: 'teacher'}}})

// create
await collab.create({type, rid})

// remove
await collab.remove(doc._id)
```

### for school collect
```js
// teacher list
await collab.find({query: {school: 'school-plan._id', type: 'teacher'}})

// unit list
await collab.find({query: {school: 'school-plan._id', ype: {$ne: 'teacher'}}})

// create
await collab.create({school: 'school-plan._id', type, rid})

// remove
await collab.remove(doc._id, {query: {school: 'school-plan._id'}})
```

