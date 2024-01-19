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
      cover: {type: String},
      price: {type: Number},
      style: {type: String}, //unit session
      removed: {type: Boolean}, //支付前 被下架或删除
    },
  ],
  /**
   * 订单状态 除400外的4xx弃用
   * 状态100：待支付；200：支付成功；300：支付失败；
   * 400.支付超时 Payment has timed out
   * 401.未支付 公开课被讲师取消 canceled by the facilitator
   * 402.未支付 公开课因未成团被系统取消 Minimal registration number not met
   * 403.未支付 课件/自学习被下架 Product removed
   * 500.已支付 公开课/服务包被购买者取消 canceled by the purchaser
   * 501.已支付 公开课被讲师取消 canceled by the facilitator
   * 502.已支付 公开课因未成团被系统取消 Minimal registration number not met
   * 503.已支付 课件/自学习被下架
   */
  status: {type: Number, default: 100},
  price: {type: Number}, // Unit cent 支付金额
  // subtotal: {type: Number}, // Unit cent 商品总金额 后续增加
  // giftCard: { type: Number }, // Unit cent gift card 支付金额 后续增加
  // coupon: { type: Number }, // Unit cent 优惠金额 后续增加

  payMethod: {type: Array}, // 支付方式 paypal, windcave, giftCard
  paid: {type: Number, default: 0}, // 支付状态 0未支付 1已支付 2已退款
  paypalId: {type: String}, // paypal支付号
  expiration: {type: Date}, // 支付超时时间
  refund: [
    {
      method: {type: String}, //paypal, windcave, giftCard
      amount: {type: Number}, // Unit cent 退款金额,
      createdAt: {type: Date},
    },
  ], // 退款详情
  paidAt: {type: Date},
}
```

### Order api

```js
// create link传数组
await App.service('order').create({ link: [{ id: unit.id, mode: unit.mode, style: 'unit/session' }] });

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

/**
 * 取消订单
 * status:只有500需手动处理
 * 500.已支付 公开课/服务包被购买者取消 canceled by the purchaser
 */
await App.service('order').get('cancel', { query: { id: _id, status: status } });

// 监听支付完成回调 link传数组
App.service('order').on('patched', (patchedData) => {
    // if (patchedData.status === 200) {}
});
```
