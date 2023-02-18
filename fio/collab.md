
### Share via email
```js
// shared members
const members = await App.service('collab').get('sharedMembers')

// get collab data
await App.service('collab').get(task.id/pd.id/unit.id, {query: {type: 'task/pd/unit'}})

// Batch sharing via email
const members = await App.service('collab').patch(collab._id, {
  email: [...],
  role: 'read/write',
  message: ''
})

// update members role
await App.service('collab').patch(_id, { 'members.$.role': 'read/write' }}, { query: {'members._id': members[0]._id}})

// remove one member
await App.service('collab').patch(collab._id, {$pull: {members: {_id: 'members._id'}}})


// Example:
// get task collab
var doc = await App.service('collab').get('1559776340527345665', {query: {type: 'task'}})
// members invite email
var email = 'acansplay@gmail.com'
var member = doc.members.find(v => v.email === email)
if (member) await App.service('collab').patch(doc._id, {$pull: {members: {_id: member._id}}})
members = await App.service('collab').patch(doc._id, {email: ['acansplay@gmail.com'], role: 'write', message: ''})
member = members.find(v => v.email === email)
// remove members
await App.service('collab').patch(collab._id, {$pull: {members: {_id: member._id}}})

```

### Share via link
```js
// 设置允许匿名 直接进入的权限
await App.service('collab').patch(collab._id, {guest: null}) // [null, 'read', 'write']

// 邀请前端地址
`/v2/account/collabApply/${collab._id}`
// 获取协同信息
const collab = await App.service('collab').get(collab._id)
// 如果 guest 存在, 会自动加入协同成员，前端直接跳转到 课件编辑页面
if (collab.guest) {
  router.replace({path: `/com/${collab.type}/edit/${collab.rid}`, query: {back: '/my/content'}})
}
// 协同加入申请提交
await App.service('collab').get('apply', {query: {_id: 'collab._id'}})

// 协同申请 审核
await App.service('collab').get('review', {query: {_id: 'members._id', role: 'read/write', status: true/false}})

```

