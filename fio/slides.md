## slides

### slides model
```js
uid: {type: String}, // user id
// task: {type: String, sparse: true, trim: true}, // view_content.id, 已经弃用
id: {type: String, required: true, trim: true}, // slides id = unit.sid
rev: {type: String, sparse: true, trim: true}, // revision
pages: [
  {
    _id: {type: String, trim: true}, // page_id
    url: {type: String, trim: true}, // url need download to s3
    outline: {type: [String]}, // ppt outlines
    assess: {type: [String]}, // ppt assess
    pic: {type: String}, // ppt snapshot s3 hash
    // hash: { type: String }, // SHA1(JSON.stringify(slides.pageElements))
    size: {type: Number}, // pic size
  },
],
hash: {type: String}, // pptx file s3 key for library
```

### logic

> publish to library
- 下载原件到S3 -> slides.hash

> library buy or copy
- sid = `hash:${hash}:${doc.sid}`
- 初始化课件
  - 获取最新的发布的hash = slides.findOne({id: sid}).hash

> my content copy
- google drive 拷贝，获取文件id
- 关联创建课件
