## Library
### library model
```js
uid: {type: String, required: true}, // users._id
model: {type: String, required: true, enum: ['unit', 'prompts']}, // 关联数据服务源
publish: {type: Boolean, default: true}, // 发布状态
snapshot: {type: Schema.Types.Mixed}, // snapshot
linkSnapshot: {type: Schema.Types.Mixed}, // unit link 的课件快照列表
```
### library api
```js
// 发布到 library
await App.service('library').get('publish', {query: {_id, model}})

```

## prompts
- 将 task 中的 ppt 其中的一页独立发布
### prompts model
```js
uid: {type: String, required: true}, // users._id
unit: {type: String, required: true}, // unit._id
curriculum: {type: String, required: true}, // curriculum code
service: {
  type: {type: [String]}, // service type, pd: subjects._id
  participants: {type: String, sparse: true, enum: Agl.subjectsParticipants}, // participants
},
subjects: [
  {
    label: {type: String, sparse: true, trim: true},
    value: {type: String, sparse: true, trim: true},
  },
],
grades: [
  {
    label: {type: String, sparse: true, trim: true},
    value: {type: String, sparse: true, trim: true},
  },
],
publish: {type: Boolean, default: false}, // 发布状态
pages: {type: Schema.Types.Mixed}, // pages snapshot
questions: {type: Schema.Types.Mixed}, // questions snapshot
materials: {type: Schema.Types.Mixed}, // materials snapshot
```
### prompts api
```js
// 创建
await App.service('prompts').create({unit, pages, questions, materials, curriculum, service, subjects, grades})
```

## Unit

### unit model ext
```js
// read only
{
  collectCount: Number,
  collected: String, // unit._id
  order: {
    _id: String, // order._id
    link: {
      id?: String, // link id, Ex: unit._id
      name?: String,
      mode?: String, // unit.mode
      newId?: String, // new unit._id by current user
      hash?: String
    }
  },
  sales: Number,
}
```
### unit library api
```js
// library index and search
await App.service('unit').get('search', {query: {key: '', $limit: 10}})

// filter query, 无数据不需要传对应的属性
{
  key: '',
  mode: '', 
  'grades.value': {$in: [...]},
  'subjects.value': {$in: [...]}
}

// library latest more
await App.service('unit').get('latestList', {query: {key: '', mode: '', $limit: 10, $skip: 0}})
// library task more
await App.service('unit').get('taskList', {query: {key: '', $limit: 10, $skip: 0}})
// library unit more
await App.service('unit').get('unitList', {query: {key: '', $limit: 10, $skip: 0}})


// library index for students
await App.service('session').get('index', {query: {limit: 10}})

// library by mode
await App.service('unit').find({query: {tab: 'lib', mode: 'unit/task'}})
// library get doc
await App.service('unit').get(doc._id, {query: {isLib: true}})

// library by live workshop
await App.service('session').find({query: {isLib: true}})

// ext search
$or: [{name: {$search: "123"}}]

```
### unit library action api
```js
// publish
const rs = await App.service('unit').patch('publish', {_id: doc._id, discount: {price: 5.0, val: 10, size: 2}})
// unpublish
const rs = await App.service('unit').patch(doc._id, {'publish.lib': false})

// buy api
await App.service('order').create({link: {id: unit._id, mode: unit.mode}})

// copy api for library
const rs = await App.service('unit').patch('copy', {_id: doc._id, orderId: order._id})

// copy api for my content
const rs = await App.service('unit').patch('copy', {_id: doc._id, name: 'xxx'})

// example buy
const doc = await App.service('unit').get(doc._id)
if (doc.order) {
  if (!doc.order.newId) {
    const cpdoc = await App.service('unit').patch('copy', {_id: doc._id, orderId: doc.order._id})
  }
} else {
  const rs = await App.service('order').create({link: {id: doc._id, mode: doc.mode}})
  if (!rs) $q.notify({type: 'negative', message: 'Bought unsuccessfully'})
  else $q.notify({type: 'positive', message: 'Bought successfully'})
}


```

## Reviews

### reviews model
```js
{
  uid: String,
  rid: String, // unit._id
  rate: Number, // 
  grade?: [Number], // grade [min, max]
  note: String,
  tags?: [String], // from conf.reviewsTags
  rates?: {}, // others rate
  createdAt: Date, // create time
  updatedAt: Date, // update time
}
```
### reviews api
```js
// create reviews
const doc = await App.service('reviews').create({
  rid: 'unit._id', rate: 4, grade: [3,12], note: 'Commit content'
})
// patch review
const doc = await App.service('reviews').patch(doc._id, {note: 'Commit content'})
// get task/unit reviews
const rs = await App.service('reviews').find({query: {rid: 'unit._id'}})
// get my reviews
const rs = await App.service('reviews').get('my', {query: {rid: 'unit._id'}})

// get reviews stat
const doc = await App.service('reviews').get('stat', {query: {rid: 'unit._id'}})
```

## Collect

### Collect model
```js
{
  uid: String,
  rid: String, // unit._id
  type: String, // unit.mode
  createdAt: Date, // create time
  updatedAt: Date, // update time
}
```
### Collect api
```js
// create
const doc = await App.service('collect').create({rid: 'unit._id', type: 'task/unit/pd'})
// remove
const doc = await App.service('collect').remove(doc._id)
```

### Order model
```js
{
  buyer: String, // buyer user._id
  seller?: String,
  name?: String,
  no?: String,
  link: {
    id?: String, // link id, Ex: task.id, unit.id, workshop.id
    name?: String,
    type?: String, // 2:unit plan; 4:task; 6:evaluation, old.content_type
    newId?: String,
    hash?: String
  },
  status: Number, // default: 0 // 状态（1：待支付；2：支付成功；3：支付失败）
  price: Number, // Unit cent
}
```
### Order api
```js
// create
const doc = await App.service('order').create({rid: 'unit._id', type: 'task/unit/pd'})
// remove
const doc = await App.service('order').patch(doc._id)
```
