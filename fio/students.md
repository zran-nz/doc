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
  },
  status: Number, // 0: inactive, 1: pending, 2: success
  del: Boolean, // del
}
```

### students API
```js

// get list by school
await App.service('students').find({query: {school: 'school_id', del: false}})

// Add students from class
App.service('students').patch(_id, { $addToSet: {class: ['class_id']}})
// Remove students from class
App.service('students').patch(_id, { $pull: {class: 'class_id'}})


// 学校邮箱验证, 返回0没有被使用过
App.service('students').get('checkEmail', { query: {school: '', email: ''}})

// 学校学生+生日不重复验证, 返回0没有被使用过
App.service('students').get('checkNameDob', { query: {school: '', name: [], dob: ''}})

// Resend email
App.service('students').get('resend', { query: {_id: student._id}})
```
