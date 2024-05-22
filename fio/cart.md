## Cart

### Cart model

```js
{
  buyer: {type: String, required: true}, // buyer user._id
  goodsId: {type: String, required: true}, // buyer user._id
  style: {type: String, enum: ['unit', 'session']}, //unit,session
  goods: {type: Object}, // 商品详情
  inviter: {type: String, trim: true}, //分享人
},
```

### Cart api

```js
/**
 * 添加
 * style 不传默认为unit
 */
await App.service('cart').create({ goodsId: goodsId, style: 'session', inviter: code });

// 列表
await App.service('cart').find();

// 移除
await App.service('cart').remove(cart._id);
```
