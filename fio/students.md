## students

### students model
```js
{
  id: String, // unique id
  school: String, // school_id
  email: String,
  name: ['first name', 'last name'],
  nickname: String, //
  avatar: String,
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
await App.service('students').find({query: {school: 'school_id', del: false}})

// Add students from class
App.service('students').patch(_id, { $addToSet: {class: ['class_id']}})
// Remove students from class
App.service('students').patch(_id, { $pull: {class: 'class_id'}})


// 学生邮箱验证, 返回0没有被使用过
App.service('students').get('checkEmail', { query: {school: '', email: ''}})

// 学校学生姓名+家长邮箱不重复验证, 返回0没有被使用过
App.service('students').get('checkEmail', { query: {school: '', name: [], 'parent.email': ''}})

// Resend email
App.service('students').get('resend', { query: {_id: student._id}})
```