## PDF

### PDF Invoice 接口
```js
POST /fio/pdf/invoice
{no: '1110000', schoolName: 'xxxxxx', date: 'xx/xx/2022', amount: '', paid: '', total: '', due: '', list: [{desc: 'xxxx', units: '12', price: '21', type: '11', amount: '23'}]}

```

```shell
curl -H "Content-Type: application/json" -X POST -d '{"no":"1110000","schoolName":"xxxxxx","date": "xx/xx/2022","list":[{"desc":"xxxx","units":"12","price":"21","type":"11","amount":"23"}]}' https://dev.classcipe.com/fio/pdf/invoice --output test.pdf
```