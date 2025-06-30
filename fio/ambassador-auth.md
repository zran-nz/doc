## ambassador-auth

### ambassador-auth model

```js
uid: {type: String, index: true, required: true},
role: {type: String, enum: Agl.usersRoles}, // user.roles
status: {type: Number, index: true, default: 1}, // 0: 未申请/Apply verification, 1:申请中/Under processing, 2: 通过/Verified, -1: 拒绝/Under processing
attachments: [
  // 附件
  {
    filename: {type: String, trim: true},
    mime: {type: String, trim: true},
    hash: {type: String, trim: true},
    date: {type: Date}, // 上传时间
    type: {type: String, trim: true}, // 认证类型, conf.val.attachmentType
    size: {type: Number}, // 文件大小
  },
],
feedback: {
  // 留言反馈
  message: {type: String}, // 用户留言内容
  date: {type: Date}, // 留言时间
  read: {type: Boolean, default: false}, // read status
  reply: {type: String}, // 后台回复内容
  replyDate: {type: Date},
  replyRead: {type: Boolean, default: false}, // read status
},
```

### ambassador-auth api

### POST:/point-setting

```js
//创建
await App.service('ambassador-auth').create({
    attachments,
});
```

### PATCH:/ambassador-auth/:id

```js
// 通过/拒绝
await App.service('ambassador-auth').patch('_id', { status: 2 / -1 });
```
