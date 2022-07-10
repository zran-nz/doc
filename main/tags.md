## 大纲

- https://dev.classcipe.com/v2/json/au.json
- https://dev.classcipe.com/v2/json/nz.json

### Command term 
```js
// 公共标签接口
GET /fio/tags-terms/pubList
await App.service('tags-terms').get('pubList')
// 搜索接口
GET /fio/tags-terms/search?key=sel
await App.service('tags-terms').get('search', { query: {key: 'sel'}})
// 自定义创建接口
POST /fio/tags-terms { tag: 'xxxx' }
await App.service('tags-terms').create({tag: 'xxx'})
curl -H "Content-Type: application/json" -H "Authorization: <your access token>" -X POST -d '{"tag": "xxxx"}' /fio/tags-terms
```

### knowledge knowledge
```js
// 公共标签接口
GET /fio/tags-knowledge/pubList
await App.service('tags-knowledge').get('pubList')
// 搜索接口 (只搜索非平台的标签)
GET /fio/tags-knowledge/search?key=sel
await App.service('tags-knowledge').get('search', { query: {key: 'sel'}})
// 自定义创建接口
POST /fio/tags-knowledge { tag: 'xxxx' }
await App.service('tags-knowledge').create({tag: 'xxx'})
curl -H "Content-Type: application/json" -H "Authorization: <your access token>" -X POST -d '{"tag": "xxxx"}' /fio/tags-knowledge

```

### 标签接口
```js
// 大纲内容统计批量查询接口，需要bloom, KnowledgeDimensions统计, 和term,Knowledge tag
// 获取单个大纲条 统计/推荐内容
GET /fio/stats-target/md5
await App.service('stats-target').get('test') // 传入大纲的md5值
// 获取多个大纲条 统计/推荐内容
await App.service('stats-target').find({ query: {
  _id: {$in: ['_id1','_id2','_id3']}
}})
[
  {
    id: '000000000000000000000000', // 大纲的md5值
    bloom: [0, 5, 0, 10, 0, 0], // 对应6个bloom维度的统计 Evaluate, Analyze, Apply, Understand, Remember, Create
    knowledge: [0, 4, 10, 0] // 对应4个KnowledgeDimensions维度统计, Factual, Conceptual, Procedural, Megacognitave
    terms: ['Select', 'Use'], // 保存最后使用的20个，不重复，超过的挤出最早的数据
    tags: ['Uses of data', ...], // 保存最后使用的20个，不重复，超过的挤出最早的数据
  },
  ...
]
// bloom, knowledge report
// bloom维度范围为0-5, knowledge范围为0-3
// bloom, knowledge 维度报告值 新增为 1, 移除为 -1
// 比如 bloom 从 1 变为 3, knowledge 从 3 变为 2
await App.service('stats-target').patch('test', {
  $inc: { 'bloom.1': -1, 'bloom.3': 1, 'knowledge.3': -1, 'knowledge.2': 1 }
})
// terms, tags report
await App.service('stats-target').patch('test', {
  $addToSet: { terms: 'e', tags: 'e' }
})
// all report
await App.service('stats-target').patch('test', {
  $inc: { 'bloom.4': 1, 'knowledge.1': 1 },
  $addToSet: { terms: 'e', tags: 'e' }
})
```

## 标签

1、系统的分类与标签不允许删除
2、单个身份下分类名称不允许重复
3、标签全局不重复，各分类下也不重复
4、新增的标签 分类为在当前分类

- 获取平台标签
  - ```await App.service('tags').get('pubList')```
  - ```await App.service('tags').get('pubList', { query: { set: ['Task types', 'Inquiry stages'] }})```
- 获取标签
  - ```await App.service('tags').get('list')```
- 新增分类
  - 对当前身份不重复
  - ```await App.service('tags').create({set: 'test'})```
- 新增分类同时设置标签 (当前身份下标签重复也会不成功)
  - ```await App.service('tags').create({set: 'test', tags: ['test1', 'test2']})```
- 新增标签 (单个分类下可以批量操作)
  - 对当前身份不重复
  - ```await App.service('tags').patch('62937c447fdb088d59cfc366', {$addToSet: { tags: ['test', 'test1'] }})```
- 删除标签 (单个分类下可以批量操作)
  - ```await App.service('tags').patch('62937c447fdb088d59cfc366', {$pull: { tags: ['test'] }})```
- 删除分类及标签
  - ```await App.service('tags').remove('62937c447fdb088d59cfc366')```

标签iframe引用
个人身份      /v2/com/tags?token={token}
学校身份      /v2/com/tags/school?uid={schoolId}&token={token}
平台管理页面  /v2/sys/tags?uid=1


### Unit 关联task分组自定义标签接口
- 获取task分组标签
  - ```await App.service('conf-user').get('UnitSet')```
- task分组标签新增 (单个操作)
  - _id 在分组标签接口获取
  - ```await App.service('conf-user').patch(_id, { $addToSet: { val: 'test' }})```
- task分组标签移除 (单个操作)
  - _id 在分组标签接口获取
  - ```await App.service('conf-user').patch(_id, { $pull: { val: 'test' }})```

### Unit 关联task分组标签最后选择接口
- 获取task分组标签最后选择
  - ```await App.service('conf-user').get('UnitSetLast')```
- task分组标签最后选择 保存
  - _id 在分组标签接口获取
  - ```await App.service('conf-user').patch(_id, { val: []})```


### 表单自定义模板
- 系统后台配置模板
  - 预先配置好几套模板，可供用户选择使用


| 系统属性 | 是否启用 | 是否必填 | 自定义别名 | hint |
| :---  | :---  | :--  | :--: |
| name | true or false |  | 输入描述 |

## PPT题型推荐
- 根据 knowledge + bloom + dimension 推荐
- 课前推荐简单的
  - 包含knowledge
  - 难度 <= bloom or <= dimension

- 课后推荐更难的
  - 包含knowledge
  - 难度 >= bloom or >= dimension