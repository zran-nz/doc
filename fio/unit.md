## Unit

### Unit model

```js
{
  // --- public ---
  createdAt: Date, // create time
  updatedAt: Date, // update time
  mode: String, // ['unit', 'task', 'pdUnit', 'pdTask', 'video', 'tool']
  service: {
    type: [], // service type = subjects._id
    participants: '', // ['educators', 'students'],
  }
  uid: String,
  name: String,
  del: Boolean, // archive status
  orderId: {type: String}, // order._id, 购买的订单id, 存在就是购买的课件
  guest: Boolean, // allow guest view
  status: Boolean, // has remove
  subjects: [{ // publish subjects
    label: String,
    value: String
  }],
  grades: [{
    label: String,
    value: String
  }],
  duration: {
    value: Number,
    unit: String, // day or week
  },
  publish: {
    lib: Boolean, // to library
    link: Boolean, // link content publish
    sales: {type: Number, default: 0}, // library sales count
    date: {type: Date}, // publish date
  },
  curriculumn: String, // readonly, curriculumn code
  tpl: String, // unit-tpl._id
  overview?: String,
  cover: String,
  type?: String, // ['FA', 'SA', 'Activity', 'IA', 'single', 'integrated']
  source: {type: String, trim: true}, // library auther unit._id
  sourceUid: {type: String, trim: true}, // library auther user._id
  discount: {
    val: Number, // discount value 0-99
    price: Number, // original price
    end: Date,
    size: Number // group size
  },
  filled: Boolean, // All forms have been filled

  // --- task start ---
  sid: String, // google.slides.id
  sessionType: String, // ['live', 'student']
  pageNum: Number,
  question: [String],
  isEdit: Boolean,
  // --- task end ----
  // --- unit start ---
  unit: String,
  idea: String,
  words: [String],
  inquiry: [String],
  goals?: [String],
  connection?: String,
  linkGroup: [{
    name: String, // 'Week 1', 'Week 2', ...
    alias: String,
  }],
  // --- unit end ---
  ext?: {
    _id: any,
    // old
    // `${tag._id}`: [{value: '', mark: ''}, ...],
    // `${tag._id}:${subject1}`: [{value: '', mark: ''}, ...],
    // `${tag._id}:${subject2}`: [{value: '', mark: ''}, ...],
    // `${tag._id}:${subject3}`: [{value: '', mark: ''}, ...],
    // --- for task and unit
    `${tpl._id}`: [{value: '', mark: ''}, ...],
    `${tpl._id}`: {
      `${tpl._id}`: [{value: '', mark: ''}, ...],
      `${tpl._id}:${subject1}`: [{value: '', mark: ''}, ...],
      `${tpl._id}:${subject2}`: [{value: '', mark: ''}, ...],
    },
    // --- for AT
    `${tags._id}`: [{value: '', mark: ''}, ...],
    `${tags._id}`: {
      `${tags._id}`: [{value: '', mark: ''}, ...],
      `${tags._id}:${subject1}`: [{value: '', mark: ''}, ...],
      `${tags._id}:${subject2}`: [{value: '', mark: ''}, ...],
    },
    // ---
    `${group}:${opt1}`: [{value: '', mark: ''}, ...],
    `${group}:${opt2}`: [{value: '', mark: ''}, ...],
    `${group}:${opt3}`: [{value: '', mark: ''}, ...],
    ...
  },
  link: [{
    id: String, // relate id: task.id pd.id
    type: String, // task/pd
    group?: String,
  }],
  premiumAuth: {type: Boolean, default: false}, // 是否通过精品认证
  snapshot: {type: Schema.Types.Mixed}, // library publish clone
  template: {type: Schema.Types.Mixed}, // unit-tpl.data snapshot
  tags: {type: Schema.Types.Mixed}, // {tags._id: tags.child, ...} tags.snapshot
  reflection: {type: Schema.Types.Mixed}, // 从library购买的课件，继承过来的公共数据，只读，不可修改，#4875
  income: {type: Number, default: 0}, //收入总计,单位分
}
```

### unit stores

```js
// create unit
await unit.create({mode: '', name: '', ...})

// patch unit
await unit.patch(doc._id, {...})
// patch unit name
await unit.patch(doc._id, {name: 'xxxx'})
// patch unit guest
await unit.patch(doc._id, {guest: true/false})

// unit link add
await unit.patch(doc._id, {$addToSet: {link: {...}}})
// unit link remove
await unit.patch(doc._id, {$pull: {link: {_id: 'link._id'}}})
// unit link batch remove
await unit.patch(doc._id, {$pull: {link: {_id: {$in: ['link._id', ...]}}}})

```

### filter for find

```js
// filter my contents
{tab: 'me'}
// filter share by me
{tab: 'share'}
// filter share by others
{tab: 'other'}
// filter archived
{tab: 'arch'}

// filter mode
{mode: 'task/unit/pd/pdUnit/tool'}

// filter search
{name: {$search: 'key word'}}

// filter linkNum > 0
{'linkNum': {$gt: 0}}
```

### unit api

```js
// find unit list
// lib: library, published: my published, me: my contents, share: shared by me, other: shared by other
const list = await App.service('unit').find({query: {tab: 'lib/published/me/share/other', ...}})

// get unit data
const doc = await App.service('unit').get('unit._id')

// patch Attributes
await App.service('unit').patch(doc._id, {key: val})
await App.service('unit').patch(doc._id, {`ext.${key}`: ext[key]})

// get unit outline
await App.service('task-outline').get('byRid', {query: {_id: doc._id}})

// get recommend idea
const list = await App.service('unit').get('recommendIdea', {query: {key: 'keyword'}})
// list = [{idea: '', words: ['', ...]}, ...]
// get recommend words
const list = await App.service('unit').get('recommendWords', {query: {key: 'keyword'}})
// list = ['xxx', ...]

// get recommend Inquiry
await App.service('unit').get('recommendInquiry', {query: {_id: doc._id}})
// list = ['', '', ...]

// get child list
const list = await App.service('unit').get('child', {query: {pid: 'unit._id'}})

// query multiple unit details by id
await App.service('unit').get('listByIds', {query: {ids: [unit._id, unit._id]}})
```

### unit link api

```js
// get relate link list
const list = await App.service('unit').get('relateLinkList', {query: {rid: 'unit._id'}})

// get all relate link list
const list = await App.service('unit').get('allRelateLinkList', {query: {rid: ['unit._id', ...]}})

// 获取 link 的 live 课数量
const num = await App.service('unit').get('liveLinkNum', {query: {_id: unit._id}})
```

### unit copy api

```js
// for self content
const doc = await App.service('unit').patch('copy', {_id: 'unit._id', name?: ''})
// for library
const doc = await App.service('unit').patch('copy', {_id: 'unit._id', orderId: 'order._id', name?: ''})
```

### unit publish api

```js
// publish unit self
await App.service('unit').patch('publish', {_id, discount: {val, price, size}, subjects: [...]})

// publish unit link content 不需要请求了
await App.service('unit').patch('publish', {_id, 'publish.link': true})

// unpublish unit
await App.service('unit').patch('unPublish', {_id: 'unit._id'})

// publish to self-study
// await App.service('session').create('publish', {_id, 'publish.study': true})

```

[Copy or Create assessment tool](/fio/tool?id=add-assessment-tool)

[Link relate link Inquiry stages](/fio/setting?id=unit-relate-link-group-tags)

## Unit plan template

### unit-tpl-user model

```js
school: String, // school-plan._id or user._id
name: String,
curriculum: String, // user custom curriculum code
tpl: {
  // auto create
  unit: String, // unit-tpl._id
  task: String, // unit-tpl._id
}
}
```

### unit-tpl-user api

```js
// create
const doc = await App.service("unit-tpl-user").create({
  school: schoolIdOrUserId,
  name: "",
  curriculum: "curric._id 自定义大纲的_id",
});
// get
const doc = await App.service("unit-tpl-user").get(doc._id);
// list
const list = await App.service("unit-tpl-user").find({
  query: { school: schoolIdOrUserId },
});
// remove
const doc = await App.service("unit-tpl-user").remove(doc._id);
```
