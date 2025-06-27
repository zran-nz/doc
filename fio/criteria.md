
## criteria model
```js
name: {type: String, required: true},
school: {type: String, required: true}, // 个人: pub.user._id, 学校: school-plan._id,  系统公共数据: "1"
standard: [
  {
    code: {type: String, required: true, maxLength: 4}, // 缩略词, 限制4位长度
    name: {type: String, required: true}, // 名称
    desc: {type: String, required: true}, // 描述
    weight: {type: Number}, // 权重
  },
],
```

### criteria 默认数据
```js
// 获取默认数据的 criteria._id
await App.service('criteria').get('last', {query: {
  school?: school-plan._id, // 个人身份不用传
}})

// 更新默认数据的 criteria._id, 系统后台的数据不能调用
await App.service('criteria').patch('last', {
  _id: 'criteria._id',
  school?: school-plan._id, // 个人身份不用传
})
```

### criteria api
```js
// 查找
await App.service('criteria').find({query: {
  school?: school-plan._id, // 个人身份不用传, 系统公共数据: "1"
}})
// 创建
await App.service('criteria').create({
  name: 'xxx',
  school?: school-plan._id, // 个人身份不用传, 系统后台传(仅限管理员): "1"
  standard?
})
// 更新
await App.service('criteria').patch(doc._id, {
  name: 'xxx',
  standard: [...]
})
// 删除单个 standard
await App.service('criteria').patch(doc._id, {
  $pull: {
    standard: {_id: 'standard._id'}
  }
})
// 增加单个 standard
await App.service('criteria').patch(doc._id, {
  $addToSet: {
    standard: {code, name, desc}
  }
})
```