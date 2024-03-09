## students

### students model

```js
{
  id: String, // unique id
  uid: String, // user._id
  password: String,
  school: String, // school_id or user._id for personal
  email: String,
  name: ['first name', 'last name'],
  nickname: String, //
  avatar: String,
  gender: String, // 'Male', 'Female', 'Others'
  dob: String,
  class: [String], // class list [class.id]
  parent: {
    email: String,
    name: [String],
    phone: String,
  },
  status: Number, // 0: inactive, 1: pending, 2: success
  del: Boolean, // del
}
// unique index
- id
- school + email
- school + name + parent.email
```

### students API

```js
// get list by school
await App.service("students").find({
  query: { school: "school_id", del: false },
});

// Add students from class
App.service("students").patch(_id, { $addToSet: { class: ["class_id"] } });
// Remove students from class
App.service("students").patch(_id, { $pull: { class: "class_id" } });

// Resend email
App.service("students").get("resend", { query: { _id: student._id } });
```

### check email

```js

// 批量检查 学生邮箱验证
const {
  teacher: { // 存在代表已经注册过老师账号
    'email': 1,
    ...
  },
  student: { // 存在代表该学校下被添加为学生
    'email': 1,
    ...
  }
} = await App.service('students').get('checkEmails', { query: {
  school: '', email: {$in: ['email', ...]}
}})

// 批量检查 学校学生姓名+家长邮箱不重复验证
const {
  `${email}:${name[0]} ${name[1]}`: 1, // 存在代表已经被添加为学生
  ...
} = await App.service('students').get('checkParents', { query: {
  school: '', 'parent.email': {$in: ['xxx@xxx.com', ...]}}
})

```

### 获取用户已加入的学校列表

```js
await App.service("student").get("schoolList");
```

### 获取用户在学校下的班级列表

```js
await App.service("student").get("classList", {
  query: { school: pub.user.schoolInfo._id },
});
```

### 家长邮件激活查看学生帐号密码

```js
// 家长查看链接
`/v2/account/schoolParentJoin/${code}`;

// 家长激活，并且查看学生帐号密码
await App.service("student").get("parentJoin", {
  query: { code: "xxx" },
});
```
