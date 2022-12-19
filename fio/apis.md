### 详情获取接口

> 获取 unit 详情
> `App.service('unit').get(id)`

> 获取 task 详情
> `App.service('task').get(id)`

> 获取 content 详情 (PD, video)
> `App.service('content').get(id)`

### 用户接口

#### 认证接口 = 当前用户信息获取

`AppLogin()`

#### 个人身份用户信息修改 [new]

`App.service('users').patch(pub.user._id, { name: ['firstname', 'lastname'], avatar: '', gender: 'Male/Female/Other', intro: '' })`

#### 学校身份用户信息修改 [new]

`App.service('users').patch(pub.user._id, { name: ['firstname', 'lastname'], avatar: '' }, { query: { school: 'school.id' }})`

#### 获取用户身份列表 [old-Db]

`App.service('users').get('schoolUserList')`

#### 切换身份 [old-api]

`POST https://dev.classcipe.com/classcipe/sys/switchSchool  {isPersonal:false,schoolId:"0/school.id"}`

#### 获取个人身份下的班级列表 [old-Db]

`App.service('users').get('oldClassList')`

#### 获取指定学校下的班级列表 [old-Db]

`App.service('users').get('oldClassList', { query: { school: 'school.id' }})`

#### 获取三方账户绑定列表

`await App.service('user-token').find({ query: { sub: { $in: [pub.user.google, pub.user.zoom] }}})`

#### 解绑三方账户

`await App.service('user-token').remove(_id)`

#### 获取个人用户详情

`await App.service('users').get('oldAccountInfo')`

> plan.used: 当前空间使用 单位: Kb  
> plan.space: 总空间大小 单位: Kb  
> stat.curriculum: 0: 未设置，1：已经设置

#### 获取学校账户详情

`await App.service('users').get('oldAccountInfo', {query: {school: "1468390544921169921"}})`

> plan.status: 0 未开通,1 申请中,2 试用中,3 已开通,-1 已过期  
> plan.used: 当前空间使用 单位: Kb  
> plan.space: 总空间大小 单位: Kb  
> stat.curriculum: 0: 未设置，1：已经设置

### Session 接口

#### session 详情接口 [new]

`await App.service('session').get(_id)`

#### start quick session [new]

`await App.service('session').create({ id: 'presentation_id', image: 'cover url', guest: true })'`

#### start workshop [new]

```js
await App.service('session').create({
  type: 'workshop', name: '', school: '',
  id: 'presentation_id', cid: 'content.id', image: 'cover url',
  price: 0 / 100 (单位:分, $1 = 100), discount: 0~99,
  regMax: 100, regDate: new Date('register dealine'),
  start: new Date('start time'), end: new Date('end time'),
  zoom: { passcode: true/false, waiting_room: true/false }
})
```

#### start session [new]

```js
await App.service('session').create({
  type: 'session', name: '',
  school?: '', classId?: '', className?: '',
  taskType?: '', // import by task
  id: 'presentation_id', cid: 'content.id', image: 'cover url',
  price: 0 / 100 (单位:分, $1 = 100), discount: 0~99,
  regMax: 100, regDate?: new Date('register dealine'),
  start: new Date('start time'), end: new Date('end time'),
  zoom?: { passcode: true/false, waiting_room: true/false }
})
```

#### patch session [new]

```js
await App.service("session").patch(_id, {
  name: "",
  image: "cover url",
  regMax: 100,
  regDate: new Date("register dealine"),
  start: new Date("start time"),
  end: new Date("end time"),
});
```

#### session list for calender [new]

```js
await App.service('session').get('dateList', {
  query: {
    start: new Date('start time'), end: new Date('end time'), zone: new Date().getTimezoneOffset()
  }
})

// filter workshop
await App.service('session').get('dateList', {
  query: {
    start: new Date('start time'), end: new Date('end time'),
    type?: 'workshop', // workshop / session
    school?: [...'school_id'], //
    uid?: pub.user._id, // only launch by me
    'reg._id'?: pub.user._id, // only workshop to attend
  }
})

// filter session
await App.service('session').get('dateList', {
  query: {
    start: new Date('start time'), end: new Date('end time'),
    type?: 'session', // workshop / session
    school?: [...'school_id'], //
    classId?: 'classID', //
    taskType?: [...'task_type'], // task session filter
    uid?: pub.user._id / { $ne: pub.user._id }, // only launch by me
  }
})
```

### 通知接口

#### 通知列表

```js
// 接口
await App.service('notice').get('oldList', { query: {  status?: 0/1, $search?, $skip?: 0, $limit?: 10 }})
// 全部
await App.service('notice').get('oldList')
// 未读
await App.service('notice').get('oldList', { query: { status: 0 }})
```

#### 通知更新为已读

```js
await App.service("notice").get("oldRead", { query: { id: "" } });
```

#### 未读通知数量

```js
await App.service("notice").get("oldUnReadCount");
```

### 会议接口

#### zoom 授权例子

```js
const authWin = window.open(
  `/fio/zoom/auth?uid=${pub.user._id}`,
  "zoomAuth",
  "width=900,height=600,menubar=yes,resizable=yes,scrollbars=true,status=true,top=100,left=200"
);
const authId = setInterval(async () => {
  if (!authWin.closed) return;
  clearInterval(authId);
  const zoomStatus = await App.service("zoom-meet").get("check");
  console.log("zoom auth:", zoomStatus);
}, 100);
```

#### zoom 过期检查

`await App.service('zoom-meet').get('check')`

#### zoom 授权解除

`await App.service('zoom-meet').get('unbind')`

### 模板接口

#### quick session 模板列表 [old-Db]

`await App.service('templates').get('quickList')`

### 课件相关接口

#### oldCheckCollaboration 根据 id 查询课件协同状态， 返回 boolean

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

## 课堂接口

### session 操作接口

- \_id 为 session.\_id

> End session  
> `App.service('session').patch(_id, {status: 'close'})`

> Reopen session  
> `App.service('session').patch(_id, {status: 'live'})`

> Archive session  
> `App.service('session').patch(_id, {del: true})`

> Restore session  
> `App.service('session').patch(_id, {del: false})`

> Delete session  
> `App.service('session').remove(_id)`

### 学生答题接口

> Get  
> `App.service('response').get(_id)`

> create  
```js
App.service('response').create({
  page: '', // page_id
  type: '', // question.type
  content: '', // text or url
  answer?: [], // for radio, checkbox, choice data
  locked?: false, // for radio, checkbox, Boolean
  point?: {}, // for comment, json
  json?: {} // draw json
})
```

> patch  
> `App.service('response').patch(_id, {content: '',...})`

> remove  
> `App.service('response').remove(_id)`

## 学校接口 [old-Db]

### 学校老师列表

`await App.service('school').get('oldTeacherList', { query: { school: 'school_id' }})`
