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
await App.service('unit').get('search', {query: {key: '', limit: 10}})

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
