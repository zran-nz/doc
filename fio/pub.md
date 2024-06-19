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
freeServiceType: {type: [String], enum: Agl.ServiceType}, // 免费使用过的服务类型
inviteCode: {type: String, trim: true}, //邀请码
inviter: {type: String, trim: true}, //邀请我的人
point: {type: Number, default: 0}, // 积分
```

[ServiceType](/fio/service?id=enum)

### 注册账号

```js
// 检测账号是否存在, mobile, email, emergencyContact 选一
await App.service("users").get("checkAccount", {
  query: { email, mobile, emergencyContact },
});

// 获取验证码, mobile, email, emergencyContact 选一
await App.service("users").get("captcha", {
  query: { email, mobile, emergencyContact },
});

// 创建账号 mobile, email 二选一
await App.service("users").create({
  mobile: "+1123123123", // E.164 format, maximum of 15 digits, +11XXX5550100, +440201234567 => +44201234567
  countryCode: "AU", // 国家代码 AU,NZ,US... /fio/conf/CountryCodes
  email: "",
  captcha: "",
  password: "new password",
  roles: ["student"], // ['student', 'teacher']
  lang: navigator.language,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

// 登录
AppLocalLogin(email / mobile, password);
```

### 忘记密码

```js
// 获取验证码
await App.service("users").get("captcha", {
  query: { email, mobile, emergencyContact },
});

// 设置密码
await App.service("users").patch("forgetPassword", {
  mobile: "", // E.164 format
  email: "", // mobile, email 二选一
  captcha: "",
  password: "new password",
});
```

### 修改密码

```js
// 更新密码
await App.service("users").patch("changePassword", { oldPassword, password });
```

### 验证码检查

```js
await App.service("users").get("checkCaptcha", {
  query: { email, mobile, emergencyContact, captcha: "" },
});
```

### 更新用户信息

```js
// 获取验证码
await App.service('users').get('captcha', {query: {email, mobile, emergencyContact}})

// 更新邮箱
await App.service('users').patch(user._id, {captcha, email})
// 更新手机
await App.service('users').patch(user._id, {captcha, mobile, countryCode})

// 更新扩展信息
await App.service('users').patch(user._id, {studentExt: {...}})
```

### google 授权 url

```js
// type = login: '登录授权', slide: '谷歌ppt授权'
// prompt = 1: '显示授权窗口', 不传则不会显示授权窗口
loginGoogleUrl(type, state, prompt);

// 正常登录
loginGoogleUrl("login", {});
// 编辑google ppt授权
loginGoogleUrl("slide", {});
// 绑定账户
loginGoogleUrl("login", { uid: "pub.user.id" });
// 注册学生账户
loginGoogleUrl("login", { type: "signup", role: "student" });
// 注册老师账户
loginGoogleUrl("login", { type: "signup", role: "teacher" });
```
