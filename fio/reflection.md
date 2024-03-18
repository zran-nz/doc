## Reflection

### Reflection model

```js
{
  createdAt: Date, // create time
  updatedAt: Date, // update time
  mode: String, // ['refl', 'comment']
  school: String, // pub.user.schoolInfo._id
  uid: String, // pub.user._id
  pid?: String, // parent reflection._ids
  to: [String], // parent user._id + uid
  public: Boolean, // snapshot to library
  unit: String, // unit._id
  rkey: String, // unit.key or ext.tag._id
  content: String, // attachment
  attach: [String], // file._id
  visible: String, // ['all', 'school', 'private']
}
```

### 获取公开的数据

```js
// batch get public list by unit._id
const list = await App.service("reflection").find({
  query: { mode: "refl", unit: "unit._id", to: { $exists: false } },
});
```

### 获取公开+私信给我的数据

```js
// batch get public + private list by unit._id
const list = await App.service("reflection").find({
  query: { mode: "refl", unit: "unit._id", to: pub.user._id },
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
  school,
  pid,
  unit,
  rkey,
  content,
  attach,
});
```

### 创建私信

```js
// create private comment
const doc = await App.service("reflection").create({
  mode: "refl|comment",
  school,
  pid,
  unit,
  rkey,
  content,
  attach,
  to: [pub.user._id, comment.uid],
});
```

### 文件信息批量获取

```js
// batch get fileinfo by files._id
await App.service('files').get('fileInfo', {query: ['a7f530021db91e3c36a9ea7f2a32162af4bd00aa', ...]})
```
