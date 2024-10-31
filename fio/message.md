## Message

### Message model

```js
{
    uid: {type: String, required: true},
    rid: {type: String, required: true}, // 关联的 service-auth._id, service-conf._id, school-plan._id
    message: {type: String},
    read: {type: Boolean, default: false}, // read status
    role: {type: String, default: 'user', enum: ['admin', 'user']},
    type: {type: String, default: 'service-auth', enum: ['service-auth', 'service-conf', 'school-plan']},
    attachments: {
    // 图片/视频证据
    filename: {type: String, trim: true}, // 文件名
    mime: {type: String, trim: true}, // 文件 MIME
    hash: {type: String, trim: true}, // 文件SHA1, files._id
    },
}
```

### Order api

```js
// 创建
await App.service('message').create({ rid: 'rid', message: 'message' });
// 查询列表 需带$role 相关角色记录会设置为已读
await App.service('message').find({ query: { rid: 'rid', $role: 'admin' } });
// 查询单个会话已读未读信息
await App.service('message').get('read', { query: { rid: 'rid', type: 'service-auth' } });

// 以service-auth为例,find时带上$message字段,列表数据会带上已读未读信息.
// 单个详情的已读信息需用到上一个接口单独查询 get('read')
await App.service('service-auth').find({ query: { $message: true } });
```
