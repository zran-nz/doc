## Notice Model

```js
type: String, // type: ['mail', 'inbox']
ip: String,
status: Boolean,
from: String, // sender user._id
to: String, // receiver user._id
email: String, // receiver email
school: String, // schoolId
code: String, // notice-tpl.code
conf: [String], // conf for mail
rs: { type: Schema.Types.Mixed }, // result for mail
data: {
  title: String,
  body: String,
  ...
}
```

### Notice api

```js
// notice list for unread
App.service('notice').find({query: {type: 'inbox', status: false}})
// notice list for all
App.service('notice').find({query: {type: 'inbox'}})
// mark as read
App.service('notice').get('read', {query: {_id: doc._id}})

// 全部设为已读
App.service('notice').get('readAll')
// 删除已读消息
App.service('notice').get('removeAll')
// 未读统计
App.service('notice').get('unReadCount')


// create notice
App.service('notice').create({
  to?: '',
  email?: '',
  data: {title: '', body: ''},
})

// 查找sms记录
await App.service('notice').find({query: {$sys: 1, type: 'sms', searchTo: uid}})
```

## Notice Tpl Model

```js
code: {type: String, trim: true, required: true, unique: true},
name: {type: String, trim: true},
enable: {type: Boolean, default: true},
enableInbox: {type: Boolean, default: false},
enablePush: {type: Boolean, default: false},
enableText: {type: Boolean, default: false}, // 短信
title: {type: String, trim: true}, // for mail,inbox title
text: {type: String, trim: true}, // for mail body
note: {type: String, trim: true}, // for inbox body
keys: {type: [String], trim: true}, // for mail replace var
category: {type: String, trim: true}, //类目ID
```

### Notice Tpl api

```js
// 更新类目
await App.service('notice-tpl').patch('notice-tpl._id', { category: '类目' });
// 更新开关
await App.service('notice-tpl').patch('notice-tpl._id', { enablePush: true });

// 短信发送 uid,mobile传一个即可
await App.service('notice-tpl').get('sendSms', { query: { uid, mobile, text: 'sms text content' } });
```

## 推送接口 - deprecated

-   Post 可以是任意对象
-   对象中指定了 userId 则只推送给此用户
-   对象中指定了 schoolId 的则推送给该学校下的所有用户
-   未指定的 则推送给平台所有用户

curl 例子

```shell
curl -H "Content-Type: application/json" -X POST -d '{"msgId":"1566953060269883393","cmd":"user","msgTxt":"You are an admin now","busType":"account","userId":"1493113285880418305"}' /fio/notice
```
