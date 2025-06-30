
## 用户购买的服务包

### service-pack-user model

```js
uid: {type: String}, // users._id
total: {type: Number, default: 0}, // 总次数 会变化，代课服务下为分钟数
used: {type: Number, default: 0}, // 已经使用，代课服务下为分钟数
expireSoon: {type: Date}, // 即将过期的时间
session: {
  _id: {type: String}, // 关联session._id
  name: {type: String}, // session.name
  start: {type: String}, // session.start
  end: {type: String}, // session.end
},
snapshot: {type: Schema.Types.Mixed, required: true}, // service-pack 快照，主题服务包下的Lecture包用 service-auth 快照
status: {type: Boolean, default: true},
order: {type: String, required: true}, // 关联 order._id
price: {type: Number, default: 0}, // 订单金额
point: {type: Number}, // 订单支付积分
isPoint: {type: Boolean, default: false}, // 现金购买/积分购买
payMethod: {type: String}, // 默认为空, 现金支付过就会更新为 cash， https://github.com/zran-nz/bug/issues/5020
// 主题服务包用 https://github.com/zran-nz/bug/issues/5196
pid: {type: String}, // 主题服务包的主包, 本身用于Lecture包，一个主题服务包包含多个Lecture包
premium: {type: String}, // Lecture包 对应的 service-auth 认证的精品课 service-auth._id
taskIndex: {type: [String]}, // Lecture包下, 课件去重后的索引 https://github.com/zran-nz/bug/issues/5200
tasks: {type: [String]}, // Lecture包下, 需要预约的课件id，用于自动计算出预约的关联的课件，增加：首次购买/补买/取消预约，扣除：预约，[id1, id2, ...]
// 线下包
country: {type: String}, // 国家
city: {type: String}, // 城市
place_id: {type: String, trim: true}, // google地点id
location: {
  type: {
    type: String,
    enum: ['Point'],
  },
  coordinates: {
    type: [Number],
  },
},
servicePremium: {type: String}, // service-pack._id lecture下有此主题服务包id
participants: {type: [String]}, // uid
zoom: {
  enabled: {type: Boolean},
  maxParticipants: {type: Boolean},
  max: {type: Number},
  min: {type: Number},
},
```

### 用户已购买的服务包接口

```js
// 服务包列表（purchased）
await this.service('service-pack-user').find({ query: {} });

// 服务包列表（purchased） 学校购买
await this.service('service-pack-user').find({ query: { uid: 'school-plan._id', $isSchool: true } });

/**
 * 按用户查询
 * fieldType: {type: String, enum: ['email', 'mobile', 'classcipeId']}
 * 弃用 改为getFind
 */
await App.service('service-pack-user').find({
    userField: '',
    userFieldType: 'email/mobile/classcipeId',
});

// 更新线下服务包地址
await App.service('service-pack-user').patch('location', { _id: 'service-pack-user._id', place_id: 'from google', address: '' });
```


### 主题服务包下的 Lecture 包列表

```js
await App.service('service-pack-user').find({ query: { pid: 'service-pack-user._id' } });
```

### 检查 service-pack-user 是否为 free

```js
await App.service('service-pack-user').get('checkFree', { query: { ids: ['service-pack-user._id'] } });
```
