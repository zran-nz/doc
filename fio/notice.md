

## Notice Model
```js
type: String, // type: ['mail', 'inbox']
ip: String,
status: Boolean,
from: String, // sender user._id
to: String, // receiver user._id
email: String, // receiver email
school: String, // schoolId
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

// create notice
App.service('notice').create({
  to?: '',
  email?: '',
  data: {title: '', body: ''},
})
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