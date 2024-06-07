## school plan

### school-plan model

```js
{
  name: {type: String, trim: true},
  logo: {type: String, trim: true},
  country: {type: String, trim: true},
  city: {type: String, trim: true},
  address: {type: String, trim: true},
  phone: {type: [String], trim: true},
  start: {type: Date},
  end: {type: Date},
  status: {type: Number, default: 0}, // 0: create, unpaid, 1: trial, 2: Paid, -1: Expired, 3: Created
  teacher: {type: Number, default: 1},
  student: {type: Number, default: 10},
  count: {
    teacher: {type: Number, default: 0},
    student: {type: Number, default: 0},
    grade: {type: Number, default: 0},
    class: {type: Number, default: 0},
  },
  space: {type: Number, default: 1000 * 1024 * 1024},
  pilot: {type: Boolean, default: false},
  personal: {type: Boolean, default: false},
  commissionEnable: {type: Boolean, default: false}, //佣金开关
  inviter: {type: String, trim: true}, //邀请我的人
}
```

### school-plan API

```js
// 向学校管理员发送pipeline邀请加入销售渠道的邮件
await App.service('school-plan').get('pipelineEmail', { query: { id: 'school-plan._id' } });

// 向学校管理员发送Content provider邀请成为内容供应商的邮件
await App.service('school-plan').get('contentEmail', { query: { id: 'school-plan._id' } });
```
