## Paypal

###1.前端使用步骤
###1.1安装
```
npm i @paypal/paypal-js
```

###1.2插入HTML
```
<div id="paypal-button-container"></div>
```

###1.3支付代码
```
loadScript({'client-id': 'AckJ83_lkyM-rlrTUHoSc8AYG6gREbHE94qqogZujg9L1Jz3dlzcTwFtzDiOz5ahuqsvn-wlullYB-tK'})
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


###2.paypal参数配置
Sandbox
Client ID:
```
AckJ83_lkyM-rlrTUHoSc8AYG6gREbHE94qqogZujg9L1Jz3dlzcTwFtzDiOz5ahuqsvn-wlullYB-tK
```

Live
Client ID:
```
AVj0ejw9ioxhqTWelmz-1h6UMQZaNrNGObZFWc0iQzJ94SvBVE98Vf88tLfZapi7JXJMd_jWLAmLEJ0g
```

