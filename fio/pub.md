## Pub store
### Actions
#### pub.userInfo(school = null)
> return {_id, avatar, name, nickname, role, email?, schoolInfo?, ...}
```js
// get personal user info
const userInfo = pub.userInfo()

// get school user info
const userInfo = pub.userInfo(schoolId)
```

#### pub.hasSchool(schoolId)
> return Boolean

## Curriculum store
### Actions
#### curriculum.gradeOptions(uid)
```js
// get system grade options
const gradeOpts = await curriculum.gradeOptions(1)
// get school grade options
const gradeOpts = await curriculum.gradeOptions(pub.user.school)
// get personal grade options
const gradeOpts = await curriculum.gradeOptions(pub.user._id)
```

#### curriculum.gradeParse(arr, gradeOptions)
```js
// grades parse
curriculum.gradeParse([gradeId, ....], gradeOpts)
```

```js
// 学生注册
App.service('users').create({
  name: ['', ''],
  password: '',
  email: '',
  roles: ['student'],
  lang: navigator.language,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  avatar: '', // option
})

// 登录
AppLocalLogin(email, password)

```
