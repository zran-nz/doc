## 大纲

```js
// Command term 标签接口返回, 默认最多取500条
['Select', 'Use']
```

```js
// knowledgeTag 标签接口返回, 默认最多取500条  
['Uses of data', ]

```

```js
// 大纲内容统计批量查询接口，需要bloom, KnowledgeDimensions统计, 和term,Knowledge tag
// get one
await App.service('stats-target').get('test')
// get multi
await App.service('stats-target').find({ query: {
  _id: {$in: ['_id1','_id2','_id3']}
}})
// bloom, knowledge report
// bloom维度范围为0-5, knowledge范围为0-3
// bloom, knowledge维度报告值 新增为 1, 移除为 -1
await App.service('stats-target').patch('test', {
  $inc: { 'bloom.4': 1, 'knowledge.1': 1 }
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
// 返回结果
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
```

## 标签
```json

{
  tag: { type: String },
  cg: [{ type: String }]
},

{
  uid: { type: String },
  tag: { type: String },
  cg: [{ type: String }]
}


```

### 表单自定义模板
- 系统后台配置模板
  - 预先配置好几套模板，可供用户选择使用


| 系统属性 | 是否启用 | 是否必填 | 自定义别名 | hint |
| :---  | :---  | :--  | :--: |
| name | true or false |  | 输入描述 |

