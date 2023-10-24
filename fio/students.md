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

// 列表获取
await App.service('students').find({query: {school: 'school_id', del: false}})

// 学校班级 - 添加学生
App.service('students').patch(_id, { $addToSet: {class: ['class_id']}})
// 学校班级 - 移除学生
App.service('students').patch(_id, { $pull: {class: 'class_id'}})


// 学校邮箱验证, 返回0没有被使用过
App.service('students').get('checkEmail', { query: {school: '', email: ''}})
```
