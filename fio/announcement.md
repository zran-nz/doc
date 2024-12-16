## Announcement

### Announcement model

```js
{
    from: {type: String, trim: true}, // user._id
    to: {type: [String], trim: true}, // user._id
    at: {type: String, enum: ['all'], default: 'all'},
    school: {type: String, trim: true}, // school_id
    class: {type: [String], trim: true}, // class list [class.id]
    message: {type: String},
    attachments: {
    // 图片/视频证据
    filename: {type: String, trim: true}, // 文件名
    mime: {type: String, trim: true}, // 文件 MIME
    hash: {type: String, trim: true}, // 文件SHA1, files._id
    },
    readList: {type: [String]}, // 已读uid列表
},
```

### Announcement api

```js

```
