### List of country codes
`await App.service('conf').get('CountryCodes')`
> https://dev.classcipe.com/fio/conf/CountryCodes

### City search
> /fio/maps/city/{CountryCodes}?q={search}


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
  set1？: String, // 子分类
  tags?: [String]
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

