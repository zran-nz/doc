### List of country codes
`await App.service('conf').get('CountryCodes')`
> https://dev.classcipe.com/fio/conf/CountryCodes

### City search
> /fio/maps/city/{CountryCodes}?q={search}


### Unit/Task/PD Tpl Public Config
```js
await App.service('conf').get('UnitTpl')
await App.service('conf').get('TaskTpl')
await App.service('conf').get('PdUnitTpl')
await App.service('conf').get('PdTaskTpl')

// unit-tpl public data
[
  {group: 'basic', required: true, enable: true, code: 'name', origin: 'Unit Name', type: 'text', tips: ''},
  {group: 'basic', required: true, enable: true, code: 'cover', origin: 'Cover', type: 'image', tips: ''},
  {group: 'basic', required: false, code: 'unit', origin: 'Project-based Unit', type: 'radio', tips: ''},
  {group: 'basic', required: false, code: 'type', origin: 'Unit Type', type: 'radio', tips: ''},
  {group: 'basic', required: false, code: 'overview', origin: 'Overview', type: 'text', tips: ''},
  {group: 'inquiry', required: true, enable: true, code: 'idea', origin: 'Big Idea/ Statement of Inquiry/ Central Idea', type: 'text', tips: ''},
  {group: 'inquiry', required: true, enable: true, code: 'words', origin: 'Key words', type: 'text-multiple', tips: ''},
  {group: 'inquiry', required: false, code: 'goals', origin: 'UN Sustainable Development Goal(s)', type: 'choice', tips: ''},
  {group: 'inquiry', required: true, enable: true, code: 'inquiry', origin: 'Key question(s) / Line(s) of inquiry', type: 'text-multiple', tips: ''},
  {group: 'inquiry', required: false, code: 'connection', origin: 'Real World Connection(s)', type: 'radio', tips: ''},
]
```

### School Grades
> Get personal grade list  
`App.service('conf-user').get('Grades')`

> Get school grades  
`App.service('conf-school').get('get', { query: { key: 'Grades', rid: schoolId }})`

### Curriculum
> get personal Curriculum
`App.service('conf-user').get('Curriculum')`

> get school Curriculum
`App.service('conf-school').get('get', { query: { key: 'Curriculum', rid: schoolId }})`

> patch school Curriculum
`App.service('conf-school').patch(_id, {'val.{subjects}.{curriculumn}': [...subjects]})`



## Tags

### tags model
```js
{
  _id: String,
  uid: String, // user._id or 表单schoolId
  sort: Number, // 排序用
  curriculum: [String], // 关联大纲代码
  ib: Boolean, // ib专用, 弃用
  set: String, // 分类
  tags?: [String],
  child?: {
    'tag': ['childs', ...], // 子标签
    ...
  }
}
```

1、系统的分类与标签不允许删除
2、单个身份下分类名称不允许重复
3、标签全局不重复，各分类下也不重复
4、新增的标签 分类为在当前分类

- 获取平台标签
  - ```await App.service('tags').get('pubList')```
  - 指定分类下的标签
    - ```await App.service('tags').get('pubList', { query: { set: ['Task types', 'Inquiry stages'] }})```
- 获取标签
  - ```await App.service('tags').get('list')```
  - 指定分类下的标签
    - ```await App.service('tags').get('list', { query: { set: ['Task types', 'Inquiry stages'] }})```
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

> 标签iframe引用
- 个人身份      /v2/com/tags?token={token}
- 学校老师身份  /v2/com/tags/{schoolId}?token={token}
- 学校身份      /v2/com/tags/school/{schoolId}?token={token}
- 平台管理页面  /v2/sys/tags?uid=1


### Unit relate link group tags
```js
// Get link group tags
// get public tags: 'Inquiry stages'
const [inquiryStages] = await App.service('tags').get('pubList', { query: { set: ['Inquiry stages'] }})
// get personal Group tag
const doc = await App.service('conf-user').get('UnitSet')

// add personal Group tag
await App.service('conf-user').patch(doc._id, { $addToSet: { val: 'test' }})
// remove personal Group tag
await App.service('conf-user').patch(doc._id, { $pull: { val: 'test' }})

// Get the group tags last selected
const lastDoc = await App.service('conf-user').get('UnitSetLast')

// Save the group tags last selected
await App.service('conf-user').patch(lastDoc._id, { val: selected})
```

