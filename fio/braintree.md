## Braintree

### Braintree api


```js
// 获取token
await App.service('braintree').get('token', {})


/**
 * 支付
 * paymentMethodNonce: nonceFromTheClient
 * deviceData: deviceDataFromTheClient
 * orderId 订单_id
 */
await App.service('braintree').get('sale', {query: {nonce, deviceData, orderId}})
```

