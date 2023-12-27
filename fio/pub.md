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

## Users model
```js
name: [String, String], // [ firstname, lastname ]
nickname: String,
password: String,
avatar: String,
email: String,
mobile: String, // E.164 format, maximum of 15 digits, +1001XXX5550100, +440201234567 => +44201234567
countryCode: String, // country code, AU, NZ
roles: [String], // 'admin', 'teacher', 'student'
gender: String, // gender
intro: String, // self intro
google: String, // google id_token.sub
zoom: String, // zoom uuid
lang: String, // default: 'en-US'}, // navigator.language
timeZone: String, // Intl.DateTimeFormat().resolvedOptions().timeZone
tz: String, // new Date().getTimezoneOffset()
ip: String, // reg ip
last: Date, // last login time
// for student
studentExt: {
  dob: String,
  parent: {
    mobile: String, // E.164 format
    email: String,
  },
  curriculum: String,
  subjects: [String],
},
```

### 注册账号
```js
// 获取验证码, mobile, email 二选一
await App.service('users').get('captcha', {email, mobile})

// 创建账号 mobile, email 二选一
await App.service('users').create({
  mobile: '+1123123123', // E.164 format, maximum of 15 digits, +11XXX5550100, +440201234567 => +44201234567
  countryCode: 'AU', // 国家代码 AU,NZ,US... /fio/conf/CountryCodes
  email: '',
  captcha: '',
  password: 'new password',
  roles: ['student'], // ['student', 'teacher']
  lang: navigator.language,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
})

// 登录
AppLocalLogin(email, password)
```

### 忘记密码
```js
// 获取验证码
await App.service('users').get('captcha', {email, mobile})

// 设置密码
await App.service('users').patch('forgetPassword', {
  mobile: '', // E.164 format
  email: '', // mobile, email 二选一
  captcha: '',
  password: 'new password',
})
```

### 更新用户信息
```js
// 获取验证码
await App.service('users').get('captcha', {email, mobile})

// 验证
await App.service('users').get('checkCaptcha', {email, mobile, captcha: ''})

// 更新密码
await App.service('users').patch(user._id, {password})
// 更新邮箱
await App.service('users').patch(user._id, {captcha, email})
// 更新手机
await App.service('users').patch(user._id, {captcha, mobile, countryCode})

// 更新扩展信息
await App.service('users').patch(user._id, {studentExt: {...}})
```
