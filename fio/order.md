## Order

### Order model

```js
{
  buyer: {type: String, required: true}, // buyer user._id/school-plan._id
  schoolAdmin: {type: String}, // user._id 机构下单 下单的学校管理员
  // seller: {type: String}, //seller已废弃,改用sellers
  sellers: {type: Array},
  name: {type: String},
  no: {type: String},
  // link已废弃,改用links
  // link: {
  //   id: {type: String}, // link id, Ex: task.id, unit.id, workshop.id
  //   name: {type: String},
  //   mode: {type: String}, // unit.mode
  //   type: {type: String}, // 2:unit plan; 4:task; 6:evaluation, old.content_type
  //   newId: {type: String},
  //   hash: {type: String},
  // },
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
      point: {type: Number},
      style: {type: String}, //unit session service self_study service_premium
      goods: {type: Object}, //下单时商品快照
      sessionId: {type: Object}, //捆绑服务包的公开课_id
      count: {type: Object}, //服务包次数 不包含赠送次数
      gift: {type: Boolean}, // 弃用 更换为promotion
      promotion: {type: Boolean}, // 是否赠品/推广 promotion
      giftCount: {type: Number, default: 0}, // 赠送次数
      removed: {type: Boolean}, //支付前 被下架或删除
      inviter: {type: String, trim: true}, //分享人
      archived: {type: Boolean, default: false}, //archived and deleted
      persons: {type: Number, default: 1}, // 主题服务包 学校购买 1v1服务包份数
    },
  ],
  /**
   * 订单状态 status 除400外的4xx弃用
   * 100.待支付；
   * 200.支付成功；
   * 300.支付失败；
   * 400.支付超时 Payment has timed out
   * 401.未支付 公开课被讲师取消 canceled by the facilitator
   * 402.未支付 公开课因未成团被系统取消 Minimal registration number not met
   * 403.未支付 课件/自学习被下架 Product removed
   * 500.已支付 公开课/服务包被购买者取消 canceled by the purchaser
   * 501.已支付 公开课被讲师取消 canceled by the facilitator (session支付前被取消,支付成功退款都为此状态)
   * 502.已支付 公开课因未成团被系统取消 Minimal registration number not met
   * 503.已支付 支付前被下架/删除,支付后立即退款
   */
  status: {type: Number, default: 100},
  settled: {type: Boolean, default: false}, //braintree settled
  /**
   * 订单类型
   * unit
   * session_public
   * session_self_study
   * session_service_pack 捆绑服务包
   * service_pack 服务包
   * service_premium 主题服务包
   */
  type: {type: String, enum: ['unit', 'session_public', 'session_self_study', 'session_service_pack', 'service_pack', 'service_premium']},
  price: {type: Number}, // Unit cent 支付金额(现金+gift card)
  point: {type: Number}, // 支付积分
  // subtotal: {type: Number}, // Unit cent 商品总金额 后续增加
  // cash: {type: Number}, // Unit cent 现金支付 后续增加
  // giftCard: { type: Number }, // Unit cent gift card 支付 后续增加
  // coupon: { type: Number }, // Unit cent 优惠金额 后续增加

  payMethod: {type: Array}, // 支付方式 paypal, windcave, giftCard, braintree
  paid: {type: Number, default: 0}, // 支付状态 0未支付 1已支付 2已退款
  paypalId: {type: String}, // paypal支付号
  braintreeId: {type: String}, // Braintree支付号
  /**
   * 支付信息 paymentInfo
   * {
   *  paymentInstrumentType string 支付方式
   *  cardType string 卡机构
   *  last4 string 卡号后四位
   * }
   */
  paymentInfo: {type: Object},
  expiration: {type: Date}, // 支付超时时间
  // 退款详情
  refund: [
    {
      method: {type: String}, //paypal, windcave, giftCard braintree
      status: {type: Number}, //状态同order status
      amount: {type: Number}, // Unit cent 退款金额,
      executed: {type: Boolean, default: true}, //退款已执行
      createdAt: {type: Date},
      executedAt: {type: Date}, //退款执行时间
    },
  ],
  paidAt: {type: Date},
  reminder: {type: Number, default: 0}, // 未支付提醒,0: 待提醒，1: 超时前15min已提醒
  inviter: {type: String, trim: true}, //分享人
  isPoint: {type: Boolean, default: false}, //积分购买
  isSeparated: {type: Boolean, default: false}, //积分/佣金是否已分账
  isSchool: {type: Boolean, default: false}, // buyer为学校
  sharedSchool: {type: String}, // school-plan._id 从学校分享购买的,分享的学校id
  servicePremium: {type: String}, // service-pack._id 主题服务包id
  servicePremiumSnapshot: {type: Object}, //主题服务包快照
  persons: {type: Number, default: 1}, // buyer为学校,1v1服务包份数
}
```

### Order api

```js
/**
 * create 传数组
 * link:array required
 * {
 *  id,
 *  style:'unit,session,service',
 *  count:1,//服务包 购买次数
 * }
 * cart:array optional
 * promotion:boolean optional
 * freeServiceClaimed:boolean optional 新注册14天用户免费领取
 * inviter:string optional
 * isPoint:boolean optional 积分购买/现金购买可不填
 * isSchool:boolean optional default:false buyer为学校
 * school:string optional buyer为学校时需传学校id school-plan._id
 * sharedSchool:string optional 从学校分享购买的,分享学校id school-plan._id
 * servicePremium:string optional 主题服务包购买需要 service-pack._id
 * persons:number optional 主题服务包 1v1服务包份数
 */
await App.service('order').create({ link: [{ id: unit._id, mode: unit.mode, style: 'unit/session/service', count: 1 }], cart: [cart._id], promotion: false, isPoint: true, inviter: inviteCode });
// 主题服务包购买
await App.service('order').create({
    link: [
        { id: 'service-pack._id', style: 'service', count: 4 }, // 1v1服务包
        { id: 'service-pack.contentOrientated.premium', style: 'service_premium' }, // 主题服务包大课
    ],
    isSchool: true, //buyer为学校
    school: 'school-plan._id', //buyer为学校时传,个人购买不需要
    sharedSchool: 'school-plan._id', // 从学校分享购买的,分享学校id
    persons: 6, //buyer为学校,1v1服务包份数
    servicePremium: 'service-pack._id', //主题服务包id
});
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

/**
 * 按用户查询
 * fieldType: {type: String, enum: ['email', 'mobile', 'classcipeId']}
 */
await App.service('order').find({
    userField: '',
    userFieldType: 'email/mobile/classcipeId',
});

// 学校下单查询
await App.service('order').find({
    query: {
        buyer: 'school-plan._id',
        $skipSys: 1,
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

/**
 * 检查商品状态 
 * 新增判断 每个商品只能同时存在一个未支付订单
  return {
      links,
      available,//可下单
      notExist,//不存在或未发布
      ordered,//已下单
  };
 */
await App.service('order').get('checkLinks', {
    query: {
        links: [
            { id: unit._id, style: 'unit' },
            { id: session._id, style: 'session' },
            { id: service._id, style: 'service' },
        ],
    },
});
/**
 * 检查商品状态 主题服务包
 * 新增判断 每个商品只能同时存在一个未支付订单
  return {
      links,
      available,//可下单
      notExist,//不存在或未发布
      ordered,//已下单
      servicePremiumAvailable,//当前links,主题服务包是否可购买
  };
 */
await App.service('order').get('checkLinks', {
    query: {
        links: [
            { id: 'service-pack._id', style: 'service' }, // 1v1服务包
            { id: 'service-pack.contentOrientated.premium', style: 'service_premium' }, // 主题服务包大课
        ],
        servicePremium: 'service-pack._id',
        sharedSchool: 'school-plan._id', // 购买学校分享服务包时传
    },
});

// 订单可退款检查
await App.service('order').get('orderRefundCheck', { query: { id: order._id } });

// 订单数量统计 unpaid,paid
await App.service('order').get('count');

// 学校购买,按ticket退款
await App.service('order').get('cancelTicket', { query: { tickets: ['service-pack-ticket._id', 'service-pack-ticket._id'] } });
```
