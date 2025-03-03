## students

### students model

```js
uid: {type: String, trim: true}, // user._id
id: {type: Number, unique: true}, // ID
school: {type: String, required: true, trim: true}, // school-plan._id or users._id for personal
email: {type: String, sparse: true, trim: true},
mobile: {type: String, trim: true, sparse: true}, // E.164 format, maximum of 15 digits, +1001XXX5550100, +440201234567 => +44201234567
name: {type: [String], trim: true}, // [first name, last name]
nickname: {type: String, trim: true}, //
avatar: {type: String, trim: true},
dob: {type: String, sparse: true, trim: true},
gender: {type: String, enum: Agl.gender, sparse: true}, // gender
class: {type: [String], trim: true}, // class list [class.id] 自然班
subjectClass: {type: [String], trim: true}, // class list [class.id] 学科班
status: {type: Number, default: 0}, // 0: inactive, 1: pending, 2: success
parent: {
  email: {type: String, sparse: true, trim: true},
  name: {type: [String], sparse: true, trim: true},
  phone: {type: String, sparse: true, trim: true},
  status: {type: Number, default: 0}, // 0: inactive, 1: pending, 2: success
},
password: {type: String, trim: true}, // temp use password
del: {type: Boolean, default: false}, // del
// unique index
- id
- school + email
- school + name + parent.email
```

### students API

```js
// get list by school
await App.service('students').find({
    query: { school: 'school_id', del: false },
});

// Add students from class
App.service('students').patch(_id, { $addToSet: { class: ['class_id'] } });
// Remove students from class
App.service('students').patch(_id, { $pull: { class: 'class_id' } });

// 学生加入学科班
App.service('students').patch(_id, { $addToSet: { subjectClass: 'class_id' } });

// Resend email
App.service('students').get('resend', { query: { _id: student._id } });
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

### check student id
```js
// 检查学生id验证是否存在
await App.service('students').get('checkId', { query: {
  school: 'xxx', id: 'id'
}})

// 批量检查 学生id验证是否存在
const {
  student: { // 存在代表已经注册过学生账号
    'id': 1,
    ...
  }
} = await App.service('students').get('checkIds', { query: {
  school: 'xxx', id: {$in: ['id', ...]}
}})
```

### 获取用户已加入的学校列表

```js
await App.service('students').get('schoolList');
```

### 获取用户在学校下的班级列表

```js
await App.service('students').get('classList', {
    query: { school: pub.user.schoolInfo._id },
});
```

### 家长邮件激活查看学生帐号密码

```js
// 家长查看链接
`/v2/account/schoolParentJoin/${code}`;

// 家长激活，并且查看学生帐号密码
await App.service('students').get('parentJoin', {
    query: { code: 'xxx' },
});
```

### 通过链接申请加入学校

```js
await App.service('students').get('apply', {
    query: { school, name: ['first name', 'last name'], avatar },
});
```

### 统计 cloud room 班级数量

```js
await App.service('students').get('cloudRoomCount', { query: { school: 'school-plan._id' } });
```
