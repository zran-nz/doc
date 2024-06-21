## school user

### school-user model

```js
{
  uid: String, // new users._id
  school: String, // school_id
  email: String,
  name: ['first name', 'last name'],
  nickname: String, //
  avatar: String,
  dob: String,
  role: [String], // ['admin']
  class: [String], // class list [class.id]
  head: [String], // head teacher [class.id]
  subject: [String], // [curriculum.code:subject.code, ...]
  subjectGrade: { [code]: [...'grade1'], ... }
  status: Number, // 0: inactive, 1: pending, 2: success
  del: Boolean, // del
  closeAlert: {type: Boolean, default: false}, // 关闭显示弹框提示,进入特殊学校
}
```

### school-user API

```js

// 学校老师列表获取
await App.service('school-user').find({query: {school: 'school_id', del: false}})

// 学校权限 - 添加管理员
App.service('school-user').patch(_id, { $addToSet: {role: ['admin']}})
// 学校权限 - 移除管理员
App.service('school-user').patch(_id, { $pull: {role: 'admin'}})

// 学校班级 - 添加老师
App.service('school-user').patch(_id, { $addToSet: {class: ['class_id']}})
// 学校班级 - 移除老师
App.service('school-user').patch(_id, { $pull: {class: 'class_id'}})
// 学校权限 - 添加班主任
App.service('school-user').patch(_id, { $addToSet: {head: ['class_id']}})
// 学校权限 - 移除班主任
App.service('school-user').patch(_id, { $pull: {head: 'class_id'}})

// 学校权限 - 添加学科管理员
const subjectKey = `${curriculumCode}:${subjectCode}`
App.service('school-user').patch(_id, {
  $addToSet: {subject: [subjectKey]},
  [`subjectGrade.${subjectKey}`]: [2,3] // grades array
})
// 学校权限 - 移除学科管理员
App.service('school-user').patch(_id, {
  $pull: {subject: 'curriculumCode:subjectCode'},
  $unset: {`subjectGrade.${subjectKey}`: ''}
})

```

### 通过链接申请加入学校

```js
// 检查当前账号是否存在学校列表中
await App.service('school-user').get('checkExists', {
    query: { school: '...' },
});
// 申请加入学校
await App.service('school-user').get('apply', {
    query: { school, name: ['first name', 'last name'], avatar },
});
```

### get school user info

```js
await App.service('school-user').get('info', {
    query: { school: pub.user.schoolInfo._id, email: pub.user.email },
});
```

### 获取用户已加入的学校列表

```js
await App.service('school-user').get('schoolList');
```

### get school user classList

```js
await App.service('school-user').get('classList', {
    query: { school: pub.user.schoolInfo._id },
});
```

### check email

```js

// 批量检查 老师邮箱验证
const {
  student: { // 存在代表已经注册过学生账号
    'email': 1,
    ...
  },
  teacher: { // 存在代表该学校下被添加为老师
    'email': 1,
    ...
  }
} = await App.service('school-user').get('checkEmails', { query: {
  school: '', email: {$in: ['email', ...]}
}})

```

### 关闭提示

```js
// 关闭提示
App.service('school-user').patch(_id, { closeAlert: true });
```
