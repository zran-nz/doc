## Pub store

### Actions

#### pub.userInfo(school = null)

> return {\_id, avatar, name, nickname, role, email?, schoolInfo?, ...}

```js
// get personal user info
const userInfo = pub.userInfo();

// get school user info
const userInfo = pub.userInfo(schoolId);
```

#### pub.hasSchool(schoolId)

> return Boolean

## Curriculum store

### Actions

#### curriculum.gradeOptions(uid)

```js
// get system grade options
const gradeOpts = await curriculum.gradeOptions(1);
// get school grade options
const gradeOpts = await curriculum.gradeOptions(pub.user.school);
// get personal grade options
const gradeOpts = await curriculum.gradeOptions(pub.user._id);
```

#### curriculum.gradeParse(arr, gradeOptions)

```js
// grades parse
curriculum.gradeParse([gradeId, ....], gradeOpts)
```


### google 授权 url

```js
// type = login: '登录授权', slide: '谷歌ppt授权'
// prompt = 1: '显示授权窗口', 不传则不会显示授权窗口
loginGoogleUrl(type, state, prompt);

// 正常登录
loginGoogleUrl('login', {});
// 编辑google ppt授权
loginGoogleUrl('slide', {});
// 绑定账户
loginGoogleUrl('login', { uid: 'pub.user.id' });
// 注册学生账户
loginGoogleUrl('login', { type: 'signup', role: 'student' });
// 注册老师账户
loginGoogleUrl('login', { type: 'signup', role: 'teacher' });
```
