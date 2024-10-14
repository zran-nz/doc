## manager

### manager model

```js
{
  uid: {type: String}, // users._id
  email: {type: String, required: true, trim: true},
  name: {type: [String], trim: true}, // [first name, last name]
  nickname: {type: String, trim: true},
  avatar: {type: String, trim: true},
  // usersManagerRoles: ['admin', 'academic_consultant', 'sales_manager', 'sales', 'customer_service_manager', 'customer_service', 'accountant', 'agent']
  role: {type: String, trim: true, enum: Agl.usersManagerRoles},
  status: {type: Number, default: 0}, // 0: inactive, 1: pending, 2: success
  del: {type: Boolean, default: false}, // del
  joinAt: {type: Date},
}
```

### manager api

```js
//创建
await App.service('manager').create({ name: ['first name', 'last name'], email: email, role: role });

// 第一次进入后台
await App.service('manager').get('join', { query: { uid: user._id, status: 2, avatar: avatar } });

// 删除
await App.service('manager').remove(manager._id);

// 发送邀请邮件
await App.service('manager').get('inviteEmail', { query: { id: manager._id } });

// 修改管理身份
await App.service('manager').patch(manager._id, { role: role, status: 0 });
```
