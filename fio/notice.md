
## 推送接口

- Post 可以是任意对象
- 对象中指定了 userId 则只推送给此用户
- 对象中指定了 schoolId 的则推送给该学校下的所有用户
- 未指定的 则推送给平台所有用户

curl 例子
```shell
curl -H "Content-Type: application/json" -X POST -d '{"msgId":"1566953060269883393","cmd":"user","msgTxt":"You are an admin now","busType":"account","userId":"1493113285880418305"}' /fio/notice
```

```js
App.service('notice').create(data)
```