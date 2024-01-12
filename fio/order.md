## Order

### Order model

```js
{
  buyer: {type: String, required: true}, // buyer user._id
  seller: {type: String}, //seller已废弃,改用sellers
  sellers: {type: Array},
  name: {type: String},
  no: {type: String},
  // link已废弃,改用links
  link: {
    id: {type: String}, // link id, Ex: task.id, unit.id, workshop.id
    name: {type: String},
    mode: {type: String}, // unit.mode
    type: {type: String}, // 2:unit plan; 4:task; 6:evaluation, old.content_type
    newId: {type: String},
    hash: {type: String},
  },
  links: [
    {
      id: {type: String}, // link id, Ex: task.id, unit.id, workshop.id
      name: {type: String},
      mode: {type: String}, // unit.mode
      type: {type: String}, // 2:unit plan; 4:task; 6:evaluation, old.content_type
      newId: {type: String},
      hash: {type: String},
    },
  ],
  // 状态100：待支付；200：支付成功；300：支付失败；
  // 400.支付超时 Payment has timed out
  // 401.订单生成但未完成支付，课件/自学习被下架 Product removed
  // 402.订单生成后未支付的公开课被讲师取消 canceled by the facilitator
  // 500.已完成支付的公开课因未成团被系统取消 Minimal registration number not met
  // 501.订单生成后已支付的公开课被讲师取消 canceled by the facilitator
  // 502.订单生成后已支付的公开课/服务包被购买者取消 canceled by the purchaser
  status: {type: Number, default: 0},
  price: {type: Number}, // Unit cent 支付金额
  subtotal: {type: Number}, // Unit cent 商品总金额 后续增加
  // giftCard: { type: Number }, // Unit cent gift card 支付金额 后续增加
  // coupon: { type: Number }, // Unit cent 优惠金额 后续增加

  payMethod: {type: String}, // 支付方式 paypal, windcave
  paid: {type: Number, default: 0}, // 支付状态 0未支付 1已支付 2已退款
  paypalId: {type: String}, // paypal支付号
  refund: [
    {
      method: {type: String}, //paypal, windcave, giftCard
      amount: {type: Number}, // Unit cent 退款金额,
      createdAt: {type: Date},
    },
  ], // 退款详情
},
```

### Order api

```js
// create link传数组
await App.service('order').create([{ link: { id: unit.id, mode: unit.mode } }]);

// 订单列表 all
await App.service('order').find();
// 订单列表 paid
await App.service('order').find({
    query: {
        status: 200,
    },
});
// 订单列表 unpaid
await App.service('order').find({
    query: {
        status: 100,
    },
});

// 详情
await App.service('order').get(_id);

// 监听支付完成回调 link传数组
App.service('order').on('patched', (patchedData) => {
    // if (patchedData.status === 200) {}
});
```
