## Cart

### Cart model

```js
{
  buyer: {type: String, required: true}, // buyer user._id
  goodsId: {type: String, required: true}, // unit._id
  style: {type: String}, //unit
  goods: {type: Object}, // 详情
}
```

### Cart api

```js
// 添加
await App.service('cart').create({goodsId: goodsId})

// 列表
await App.service('cart').find()

// 移除
await App.service('cart').remove(cart._id)
```
