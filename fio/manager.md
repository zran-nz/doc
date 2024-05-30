## manager

### manager model

```js
{
  uid: {type: String}, // users._id
  email: {type: String, required: true, trim: true},
  name: {type: [String], trim: true}, // [first name, last name]
  nickname: {type: String, trim: true},
  avatar: {type: String, trim: true},
  role: {type: String, trim: true, enum: Agl.usersManagerRoles}, // 代理/销售等待定 ['agent']
  status: {type: Number, default: 0}, // 0: inactive, 1: pending, 2: success
  del: {type: Boolean, default: false}, // del
}
```

### manager api

```js
//创建
await App.service('manager').create({ name: ['first name', 'last name'], email: email, role: role });

// 第一次进入后台
await App.service('manager').get('update', { query: { uid: user._id, status: 2 } });

// 删除
await App.service('manager').remove(manager._id);
```
