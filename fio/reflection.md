## Reflection

### enum

```js
reflectionMode: ['refl', 'comment'],
reflectionVisible: ['all', 'school', 'private'],
```

### Reflection model

```js
mode: {type: String, enum: Agl.reflectionMode, default: 'refl'},
uid: {type: String, required: true}, // pub.user._id
pid: {type: String, trim: true}, // parent reflection._id
to: {type: [String], sparse: true}, // parent user._id + uid
public: {type: Boolean, default: true}, // snapshot to library
unit: {type: String, required: true}, // unit._id
rkey: {type: String, required: true}, // unit.key or ext.tag._id
session: {type: String, required: true}, // 关联 session._id
school: {type: String, sparse: true, trim: true}, // 关联学校 pub.user.schoolInfo._id
classId: {type: String, required: true}, // 关联班级 classes._id
content: {type: String, required: true, trim: true}, // attachment
attach: {type: [String]}, // file._id
visible: {type: String, enum: Agl.reflectionVisible},
createdAt: Date, // create time
updatedAt: Date, // update time

// private comment, public: {to: null}, public+private: {to: user._id}
公开的数据: uid, public: true
私信的数据: uid, public: false, to: [sender, recver]
公开，班级下数据: uid, public: true, classId
非公开，班级下数据: uid, public: false, classId
公开，排课的数据: uid, public: true, session
非公开，排课的数据: uid, public: false, session
```

### 获取公开的数据

```js
// batch get public list by unit._id
const list = await App.service("reflection").find({
  query: { mode: "refl", unit: "unit._id", to: null },
});
```

### 获取公开+私信给我的数据

```js
// batch get public + private list by unit._id
const list = await App.service("reflection").find({
  query: { mode: "refl", unit: "unit._id", to: { $in: [null, pub.user._id] } },
});
```

### 更新/删除 reflection or comment

```js
// patch reflection or comment
const doc = await App.service("reflection").patch(doc._id, { content, attach });
// remove reflection or comment
await App.service("reflection").remove(doc._id);
```

### 创建 reflection or comment

```js
// create reflection or comment
const doc = await App.service("reflection").create({
  mode: "refl|comment",
  pid?, // 关联回复
  unit, // 关联课件
  rkey,
  content,
  attach?,
  session?, // 所有排课 产生的数据
  school?, // 学校身份排课 产生的数据
  classId?, // 班级下排课 产生的数据

});
```

### 创建私信

```js
// create private comment
const doc = await App.service("reflection").create({
  ... // 同创建接口
  to: [pub.user._id, comment.uid], // 发送人+接受人
});
```

### 文件信息批量获取

```js
// batch get fileinfo by files._id
await App.service('files').get('fileInfo', {query: ['a7f530021db91e3c36a9ea7f2a32162af4bd00aa', ...]})
```
