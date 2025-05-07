## Paypal

### 1.前端使用步骤

### 1.1 安装

```
npm i @paypal/paypal-js
```

### 1.2 插入 HTML

```
<div id="paypal-button-container"></div>
```

### 1.3 支付代码

```
loadScript({'client-id': 'Acg70iZz0flbVOgEA1SjmiqEhKw850HHMnOjOp1F96UOjqgnF372WxO9QcbNPIOkGm9CROrrGYFmQ6Yh'})
    .then((paypal) => {
      paypal
        .Buttons({
          style: {
            layout: 'vertical',
            disableMaxWidth: true,
          },
          createOrder(data, actions) {
            return App.service('paypal')
              .get('payment', {
                query: {
                  id: 'order._id',//订单id
                },
              })
              .then((order) => {
                return order.id
              })
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              // 监听支付事件完成
            })
          },
        })
        .render('#paypal-button-container')
    })
    .catch((err) => {
      console.error('failed to load the PayPal JS SDK script', err)
    })
```

### 2.paypal 配置参数

Sandbox
Client ID:

```
Acg70iZz0flbVOgEA1SjmiqEhKw850HHMnOjOp1F96UOjqgnF372WxO9QcbNPIOkGm9CROrrGYFmQ6Yh
```

Live
Client ID:

```
AVj0ejw9ioxhqTWelmz-1h6UMQZaNrNGObZFWc0iQzJ94SvBVE98Vf88tLfZapi7JXJMd_jWLAmLEJ0g
```

### 3.paypal sandbox 支付信息

#### CARD

Card number 4032033576774181  
Expiry date 06/2026  
CVC code 278

#### ACCOUNT

Email
sb-athji8504516@personal.example.com  
Password
B+lqiq#7

### 4.Paypal api

```js
// 请求paypal支付参数
App.service('paypal').get('payment', {
    query: {
        id: 'order._id',
    },
});
```
