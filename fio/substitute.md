## substitute

### substitute model

```js
{
    teacher: {type: String}, // 代课老师的id
    within: {type: Boolean, default: false}, // 代课 校内/校外
    teacherStatus: {type: Number, default: 0}, // 代课老师 0: 待审核/Pending, 1: 已通过/Approved
    teacherMessage: {type: String}, // 给老师留言
    admin: {type: String}, // 代课审批管理员
    adminStatus: {type: Number, default: 0}, // 管理员 0: 待审核/Pending, 1: 已通过/Approved
    adminMessage: {type: String}, // 给管理员留言
    packUser: {type: String}, // 关联使用的服务包 service-pack-user._id
    servicePackSnapshot: {type: Schema.Types.Mixed}, // 使用的服务包快照
    sessionSnapshot: {type: Schema.Types.Mixed}, // session快照
}
```

### Substitute api

```js

```
