## userNoticeSetting

### userNoticeSetting model

```js
{
  enable: {type: Boolean, default: true}, //总开关
  // {
  //   'noticetpls._id': {
  //     enableEmail: true,
  //     enableInbox: true,
  //     enableText: true,
  //     enablePush: true,
  //   },
  // }
  setting: {type: Schema.Types.Mixed, default: {}}, // 通知开关列表
}
```

### userNoticeSetting api

```js
/**
 * 更新消息设置
 * 用户未设置过,则没有数据,默认都为true
 * setting同理,只有设置过模板的才有数据,默认都为true,字段可能为空或没有该字段
 * 
 * id: user._id
 * enable: true 不更新可不传
 * setting: 只传更新的那条,不更新可不传,每一条下这四个都需要(enableEmail,enableInbox,enableText,enablePush)
 */
await App.service('user-notice-setting').get('save', {
    query: {
      id: user._id,
      enable: true,
      setting: {
        noticetpls._id: {
          enableEmail: true,
          enableInbox: false,
          enableText: false,
          enablePush: true,
        },
      },
    },
})

// 获取用户消息设置
try {
  var data = await App.service('user-notice-setting').get('user._id')
} catch (e) {
  console.log('user-notice-setting not found')
}
```
