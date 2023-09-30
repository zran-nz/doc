## collab model
```js
rid: String, // unit._id
type: String, // ['task', 'pd', 'unit']
uid: String, // owner user._id
members: [{
  email: String, // user.email
  nickname: String,
  avatar: String,
  role: String, // ['read', 'write', 'comment']
  permissionId: String, // google drive.permission
  status: Boolean,
  message: String,
}]
```


### Share via email
```js
// shared members
await collab.sharedMembers()

// get collab data
await collab.get(unit._id, unit.mode)

// Batch invite via email
const members = await collab.invite(collabId, email = [...], role = 'read/write', message = '')

// update members role
await collab.upRole(collabId, memberId, role = 'read/write')

// remove one member
await collab.rmMember(collabId, memberId)


// Example:
// get task collab
var doc = await collab.get('...', 'task')
// members invite email
var email = 'acansplay@gmail.com'
var member = doc.members.find(v => v.email === email)
if (member) await collab.rmMember(member._id)
members = await collab.invite(doc._id, ['acansplay@gmail.com'], 'write', 'hello~')
member = members.find(v => v.email === email)
// remove members
await collab.rmMember(doc._id, member._id)
```

### Share via link
```js
// 设置允许匿名 直接进入的权限
await collab.patch(collab._id, {guest: null}) // [null, 'read', 'write']

// 邀请前端地址
`/v2/account/collabApply/${collab._id}`
// 获取协同信息
const collab = await collab.get(collabId)
// 如果 guest 存在, 会自动加入协同成员，前端直接跳转到 课件编辑页面
if (collab.guest) {
  router.replace({path: `/com/${collab.type}/edit/${collab.rid}`, query: {back: '/my/content'}})
}

// 协同加入申请提交
collab.apply(collabId, message = '')

// 协同申请 审核
await collab.review(memberId, role = 'read/write', status = true/false)

```

