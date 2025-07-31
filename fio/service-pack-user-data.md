## service-pack-user-data

### service-pack-user-data model

```js
packUser: {type: String, required: true}, // 关联购买的服务包 service-pack-user._id
expired: {type: Date}, // 过期列表
status: {type: Number, default: 0}, // 状态 0: 可用，-1: 过期, 1: 被使用
gift: {type: Boolean, default: false}, // 是否赠品
order: {type: String, trim: true}, // 关联 order
serviceTicket: {type: String, trim: true}, // 关联 service-pack-ticket._id
payMethod: {type: String, trim: true}, // 支付方式
```

### service-pack-user-data:add

```js
// 批量增加次数数据
this.app.service('service-pack-user-data').add({
  packUser,
  packUserData,
  packUserTasks, // Lecture包复购的课件id数组
  isNew = false,
  order,
  payMethod,
  type = 'order',
  times = 1,
  servicer,
  oldSession,
  start,
  isPromotion = false,
  serviceTicket,
  isClaim = false,
})
```

- 获取实际的 freq, packId 数据
  - 获取 packUserDoc
    - packUserDoc = await this.app.service('service-pack-user').Model.findById(packUser).select(['snapshot', 'status', 'pid', 'tasks', 'taskIndex'])
  - 存在 packUserDoc.pid，需要获取父 Doc
    - packUserDocParent = await this.app.service('service-pack-user').Model.findById(packUserDoc.pid).select(['snapshot', 'status', 'pid'])
    - freq = packUserDocParent.snapshot.freq
    - packId = packUserDocParent.snapshot.\_id
  - 不存在则使用 packUserDoc
    - freq = packUserDoc.snapshot.freq
    - packId = packUserDoc.snapshot.\_id
- 获取未过期的最后一次
  - const lastDoc: any = await this.Model.findOne({packUser, expired: {$gte: new Date()}}).sort({expired: -1})
- 存在 lastDoc 则使用最后一次作为开始时间
  const nt = !lastDoc ? Date.now() : new Date(lastDoc.expired).getTime()
- 判断 packUserData 参数
  - 存在则为取消，超时的时候，取出消耗的次数数据
    - const arr: any = await this.Model.find({\_id: {$in: packUserData}})
    - 将使用测次数数据重新按新的时间加回去
      ```
      for (let i = 0; i < arr.length; i++) {
        data.push({order: arr[i].order, payMethod: arr[i].payMethod, packUser: arr[i].packUser, expired: new Date(nt + (i + 1) * freq * 86400000)})
      }
      ```
  - 不存在则按传入的 times 参数增加次数数据
    ```
    for (let i = 0; i < times; i++) {
    data.push({order, payMethod, packUser, expired: new Date(nt + (i + 1) _ freq _ 86400000), serviceTicket})
    }
    ```
- 批量创建次数数据 await this.create(data)
- 更新服务包的最新的过期时间和剩余次数, 主服务包的统计
  - 如果是首次创建服务包
    - expireSoon = data[0].expired
    - remaining = times
    - const $set: any = {expireSoon, total: times}
    - if (payMethod === 'cash') $set.payMethod = payMethod
    - 更新服务包统计
      - await this.app.service('service-pack-user').Model.updateOne({\_id: packUser}, {$set})
  - 如果不是首次创建
    - 找出最早过期的次数
      - let firstDoc: any = await this.Model.findOne({packUser, status: 0}).sort({expired: 1})
      - expireSoon = firstDoc.expired
      - 查询剩余次数
        - remaining = await this.Model.count({packUser, status: 0})
      - const post: any = {$inc: {total: times}}
      - const $set: any = {expireSoon}
      - if (payMethod === 'cash') $set.payMethod = payMethod
      - Lecture 包补买/复购/订单取消逻辑
        - 存在 packUserDoc.pid 和 packUserTasks
          - $set.tasks = this.app.service('service-pack-user').taskInsert(packUserDoc, packUserTasks)
          - type === 'order' 取消该 lecture 包下已经预约的课
            await this.app.service('service-booking').lectureCancelByOrder({packUserDoc}, params)
          - 如果服务包过期了（!packUserDoc.status），需要激活
            $set.status = true
    - 更新服务包统计
      - await this.app.service('service-pack-user').Model.updateOne({\_id: packUser}, {$set, ...post})
  - 如果存在状态变化 $set.status
    - 如果子服务包状态变化，同时去检查主服务包的状态
      - await this.app.service('service-pack-user').checkMaterPackUser(packUserDoc.pid)
  - 如果本身是主服务包，则更新服务包有效统计
    - await this.app.service('service-pack').incCount(packId, {'count.valid': 1})
- 同时将次数变化记录到日志
  ```
      const logs: any = {packUser, times, type, updatedAt: new Date(), expireSoon, remaining, packUserData: rs}
    if (start) logs.start = start
    if (servicer) logs.servicer = await this.app.service('users').uidToInfo(servicer)
    if (oldSession?.name) logs.name = oldSession.name
    await this.app.service('service-pack-user-logs').create(logs)
  ```

-   销售跟踪列表数据处理,根据次数,付费等数据,更新销售跟踪列表数据
    ```js
    this.app.service('sales-follow-up').handleFollowUpPaid(packUser);
    ```
-   同步 ticket 可用次数
    ```js
    if (!isClaim) {
        this.app.service('service-pack-ticket').updateCount({ userData: rs });
    }
    ```
### service-pack-user-data:used

```js
// 扣取次数, 同时更新最近过期的卡
this.app.service('service-pack-user-data').used({booking, packUser, order, times = 1, type, servicer, oldSession, start, serviceTicket, isClaim = false})
```
