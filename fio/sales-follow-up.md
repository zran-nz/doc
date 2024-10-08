## sales-follow-up

### sales-follow-up model

```js
{
  customer: {type: String, required: true}, // 销售对象 user._id
  customerName: {type: String}, // 销售对象 user.name
  customerType: {type: String, default: 'user', enum: ['user', 'school']}, // 销售对象类型
  type: {type: String, default: 'following', enum: ['following', 'completed']}, // 跟进类型
  status: {type: Number, default: 0}, // 跟进状态,0:未跟进 1:已跟进
  servicePack: {type: String, required: true}, // 服务包 service-pack._id
  servicePackName: {type: String}, // 服务包 service-pack.name
  serviceType: {type: String, enum: ['mentoring', 'correcting', 'substitute', 'service_premium']}, // 服务包类型
  servicePackUser: {type: String, required: true}, // 用户服务包 service-pack-user._id
  order: {type: String}, // order._id
  sales: {type: String}, // 跟进人 user._id
  salesName: {type: String}, // 跟进人 user.name
  salesType: {type: String, enum: ['manager', 'consultant']}, // 跟进人类型 manager:系统销售 consultant:顾问老师
  // 联系记录
  contactLog: [
    {
      duration: {type: Number},
      createdAt: {type: Date, default: Date.now},
      sales: {type: String}, // 跟进人 user._id
      salesName: {type: String}, // 跟进人 user.name
      note: {type: String},
    },
  ],
  followedAt: {type: Date}, // 开始跟进时间
  releasedAt: {type: Date}, // 上次释放时间
  shareCount: {type: Number, default: 0}, // 已分享次数 跟踪的服务包
  shareGoods: {type: [String]}, // 已分享的推荐商品
},
```

### sales-follow-up api

```js
// find
// all
await App.service('sales-follow-up').find({ type: 'following' });
// by me
await App.service('sales-follow-up').find({ query: { sales: user._id, status: 1, type: 'following' } });
// by others
await App.service('sales-follow-up').find({ query: { sales: { $ne: user._id }, status: 1, type: 'following' } });
// by me + by others
await App.service('sales-follow-up').find({ query: { status: 1, type: 'following' } });
// unclaimed
await App.service('sales-follow-up').find({ query: { status: 0, type: 'following' } });
// by me + unclaimed
await App.service('sales-follow-up').find({
    query: {
        $or: [
            { sales: user._id, status: 1, type: 'following' },
            { status: 0, type: 'following' },
        ],
    },
});

// sorted by sales 获取sales列表 按项目数排序 字段count为项目数
await App.service('sales-follow-up').get('groupBySales', { query: { type: 'following', salesType } });

// product type
await App.service('sales-follow-up').get('groupByProduct', { query: { status } });

// stop
await App.service('sales-follow-up').get('stop', { query: { id: _id } });
// claim assign
await App.service('sales-follow-up').get('claim', { query: { id: _id, uid: uid } });

// 联系记录
await App.service('sales-follow-up').patch(_id, {
    $push: {
        contactLog: {
            duration: 59,
            sales: uid, // 跟进人 user._id
            createdAt: new Date(),
            note: note,
        },
    },
});
// 更新note
await App.service('sales-follow-up').patch(_id, { 'contactLog.$.note': note }, { query: { 'contactLog._id': contactLog._id } });

// 详情 servicePackInfo.status:发布状态
await App.service('sales-follow-up').get(_id);
// remove
await App.service('sales-follow-up').remove(_id);

// 发送站内信
App.service('sales-follow-up').get('sendInbox', { query: { uid: '收件人', content: '站内信内容' } });

// 推广邮件
await App.service('sales-follow-up').get('share', { query: { id: _id, goodsId: 'service-pack._id/session._id', style: 'service/session' } });
```
