## 详情获取接口
> 获取unit 详情
`App.service('unit').get(id)`

> 获取task 详情
`App.service('task').get(id)`

> 获取content 详情 (PD, video)
`App.service('content').get(id)`

## 老接口临时实现
### 模板接口
#### start quick session
`await App.service('session').create({ id: 'presentation_id', pageIds: ['p1', 'xx', ...], image: 'cover url', guest: true })'`

#### quick session 模板列表
`await App.service('templates').get('quickList')`

### 课件相关接口
#### oldCheckCollaboration 根据id 查询课件协同状态， 返回 boolean
`await App.service('content').get('oldCheckCollaboration', { query: { id: 'content.id' }})`

#### oldContent 课件列表查询接口
`await App.service('task').get('oldContent', { query: { pid: 'parent id', type, tab: 'all/share/other/arch/addon/', status, create, $sort, $search, $skip = 0, $limit = 10 }})`

#### oldArchive 课件归档，恢复
`await App.service('task').get('oldArchive', { query: { id: '', type: 2/4/9, del: 0/1 }})`

#### oldDel 课件彻底删除接口
`await App.service('task').get('oldDel', { query: { id: '', type: 2/4/9 }})`

#### oldEditSlide 设置课件为编辑中
`await App.service('task').get('oldEditSlide', { query: { id: '', type: 2/4/9, val: 0/1 }})`

#### oldLeave 离开协同
`await App.service('task').get('oldLeave', { query: { id: '' }})`

### 学校相关接口

#### 获取单个学校详情
`App.service('school').get(id)`

#### 学校内容局部更新接口，更新什么传什么，不需要全传
`App.service('school').patch(id, { name: '', country: '', city: '', logo: '', phone_country_code: '', phone_num: '' })`



## 课堂接口 废弃

- id为 session的真实id, 纯数字

> End session  
`App.service('class2').patch(id, {status: 'close'})`

> Reopen session  
`App.service('class2').patch(id, {status: 'live'})`

> Archive session  
`App.service('class2').patch(id, {del_flag: 1})`

> Restore session  
`App.service('class2').patch(id, {del_flag: 0})`

> Delete session  
`App.service('class2').remove(id)`
