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
```

## Notice Tpl Model

```js
code: String,
name: String,
enable: Boolean,
title: String, // for mail,inbox title
text: String, // for mail body
note: String, // for inbox body
keys: [String], // for mail replace var
```

## 推送接口 - deprecated

- Post 可以是任意对象
- 对象中指定了 userId 则只推送给此用户
- 对象中指定了 schoolId 的则推送给该学校下的所有用户
- 未指定的 则推送给平台所有用户

curl 例子

```shell
curl -H "Content-Type: application/json" -X POST -d '{"msgId":"1566953060269883393","cmd":"user","msgTxt":"You are an admin now","busType":"account","userId":"1493113285880418305"}' /fio/notice
```
