## Announcement

### Announcement model

```js
{
    from: {type: String, trim: true}, // user._id
    to: {type: [String], trim: true}, // user._id
    at: {type: String, enum: ['all'], default: 'all'},
    school: {type: String, trim: true}, // school._id
    class: {type: String, trim: true}, // class._id
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
// 发送通知
await App.service('announcement').create({
    from: 'uid',
    at: 'all',
    school: 'school._id',
    class: 'class._id',
    message: 'message',
});

// 已读
await App.service('announcement').get('read', { query: { class: 'class._id', school: 'school-plan._id' } });
```
