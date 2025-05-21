## Users
### Users model

```js
name: [String, String], // [ firstname, lastname ]
nickname: String,
password: String,
avatar: String,
email: String,
mobile: String, // E.164 format, maximum of 15 digits, +1001XXX5550100, +440201234567 => +44201234567
countryCode: String, // country code, AU, NZ
roles: [String], // 'admin', 'teacher', 'student'
managerRoles: [String], // 'agent'
gender: String, // gender
intro: String, // self intro
google: String, // google id_token.sub
zoom: String, // zoom uuid
lang: String, // default: 'en-US'}, // navigator.language
timeZone: String, // 时区文案 Intl.DateTimeFormat().resolvedOptions().timeZone
tz: Number, // 时区分钟， new Date().getTimezoneOffset()
ip: String, // reg ip
last: Date, // last login time
emergencyContact: {type: String, trim: true, sparse: true}, // E.164 format, maximum of 15 digits, +1001XXX5550100, +440201234567 => +44201234567
// for tearcher
tearcherExt: {
  curriculum: [String],
  subjects: [String],
  grades: [Any],
},
// for student
studentId: String, // studentId + password login
studentExt: {
  dob: String,
  parent: {
    mobile: String, // E.164 format
    email: String,
  },
  curriculum: String,
  subjects: [String],
  grades: [String],
},
// 免费使用过的服务类型, 服务包 id 作为key, order 作为 value
freeServiceType: {
  {[servicePack._id]: order._id},
  ...
},
inviteCode: {type: String, trim: true}, //邀请码
inviter: {type: String, trim: true}, //邀请我的人
point: {type: Number, default: 0}, // 积分
freeServiceClaimed: {type: Boolean, default: false}, // 已领取免费服务包
freePromptCount: {type: Number, default: 0}, // Prompts免费购买次数统计
agreedToTerms: {type: Boolean, default: false}, // terms and conditions agreed to verification page
```

[ServiceType](/fio/service?id=enum)

### GET:/users/checkAccount
```js
// 检测账号是否存在, mobile, email, emergencyContact 选一
await App.service('users').get('checkAccount', {
    query: { email, mobile, emergencyContact },
});
```
### GET:/users/captcha
```js
// 获取验证码, mobile, email, emergencyContact 选一
await App.service('users').get('captcha', {
    query: { email, mobile, emergencyContact },
});
```
### GET:/users/captchaById
```js
// 获取验证码 students.id
await App.service('users').get('captchaById', { query: { id: 'students.id' } })
```
### GET:/users/checkCaptcha
```js
// 验证码检查
await App.service('users').get('checkCaptcha', {
    query: { email, mobile, emergencyContact, id, captcha: '' },
});
```

### POST:/users
```js
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
});
// 登录
AppLocalLogin(email / mobile, password);
```

### GET:/users/studentId
```js
// 通过学生 ID 查询用户
await App.service('users').get('studentId', { query: { studentId: 'xxxx' } });
```

### PATCH:/users/forgetPassword
```js
// 设置密码
await App.service('users').patch('forgetPassword', {
    mobile: '', // E.164 format
    email: '', // mobile, email 二选一
    captcha: '',
    password: 'new password',
});
```

### PATCH:/users/changePassword
```js
// 更新密码
await App.service('users').patch('changePassword', { oldPassword, password });
```


### PATCH:/users/:id
- 更新用户信息
```js
// 更新邮箱
await App.service('users').patch(user._id, {captcha, email})
// 更新手机
await App.service('users').patch(user._id, {captcha, mobile, countryCode})
// 更新扩展信息
await App.service('users').patch(user._id, {studentExt: {...}})
```

### GET:/users/googleEmail
```js
// 获取 google 登录的邮箱
await App.service('users').get('googleEmail');
```

### GET:/users/googleEmailSync
```js
// 更新账号的邮箱为 google 登录的邮箱
await App.service('users').get('googleEmailSync');
```
