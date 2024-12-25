## Service

### 查找可预约的老师列表
> 生成认证项的查询条件
  - 获取用户已购服务包的数据, 支付方式/父级pid/快照
    - packUser = db.getCollection('servicepackusers').findOne({'_id': ObjectId('packUserId')}, {payMethod: 1, pid: 1, snapshot: 1})
    - 是否免费服务包
      - isFree = doc.payMethod === 'cash'
    - 不存在pid, 则直接取快照数据
      packDoc = packUser.snapshot
    - 如果存在pid 则是Lecture服务包,还需要再次查询父级的服务包
      - pdoc = db.getCollection('servicepackusers').findOne({'_id': ObjectId('packUserId')}, {payMethod: 1, snapshot: 1})
      - 是否免费服务包
        - isFree = pdoc.payMethod === 'cash'
      - topic要取Lecture服务包的数据
        - pdoc.snapshot.topic = packUser.snapshot.topic
      - 改为使用父级的条件
        - packDoc = pdoc.snapshot
  - 根据服务包条件生成匹配条件
    - query.status = 2 // 状态必须是通过认证的
    - query.mentoringType = packDoc.mentoringType
    - 如果存在 packDoc.countryCode
      - query.countryCode = {$in: packDoc.countryCode}
    - 如果存在 packDoc.curriculum
      - query.curriculum = packDoc.curriculum
    - 如果存在 packDoc.subject
      - query.subject = {$in: packDoc.subject}
    - 如果存在 packDoc.gradeGroup
      - query.gradeGroup = {$in: packDoc.gradeGroup}
    - 如果存在 packDoc.qualification
      - query.qualification = packDoc.qualification
    - query.serviceRoles = packDoc.serviceRoles
      - 如果是免费的服务包则要多匹配 consultant 角色
        - query.serviceRoles = {$in: [packDoc.serviceRoles, 'consultant']}
      - 如果packDoc.serviceRoles 是['mentoring', 'substitute', 'correcting'] 中的一种,则要多匹配 consultant 角色
        - query.serviceRoles = {$in: [packDoc.serviceRoles, 'consultant']}
    - query['topic._id'] = {$in: packDoc.topic}
      - 如果 packDoc.mentoringType === 'academic', 则不能匹配topic条件
        delete query['topic._id']
> 查询匹配的认证项, 获取所有不重复的uid
  - uids = db.getCollection('serviceauths').distinct('uid', query)
  - 如果uids中包含自己, 需要排除自己
  - 取出被拉黑的老师的uid, 进行排除
    - blocks = db.getCollection('suspendclasses').distinct('uid')
    - 循环uids将在blocks里的uid排除掉, 不能参与匹配
> 根据uids过滤可以预约的老师
  - 生成老师批评条件
    - query._id = {$in: uids}
    - query.['hours.0'] = {$exists: true} // 只匹配设置过时间段的老师
    - query.hoursMax = {$gte: packDoc.duration + packDoc.break} // 匹配上课时长是否达标
    - 如果指定查询时间段
      - 匹配可用时间段内
        - query.hoursIndex = {
            $elemMatch: {
              0: {$lte: getUTCHour(hours[0])},
              1: {$gte: getUTCHour(hours[1])}
            }
          }
      - 排除假日
        - query.holiday = {
          $not: {
            $elemMatch: {
              0: {$lte: new Date(hours[0])},
              1: {$gte: new Date(hours[1])},
            },
          },
        }
  - 匹配可用老师
    - teachers = db.getCollection('serviceconfs').find(query)
> 置顶逻辑
  - 找出自己收藏过的老师
    - fans = db.getCollection('servicefans').Model.findById(user._id)
    - 循环找出teachers中的_id 包含 fans.servicer中的老师进行置顶
  - 如果是免费服务包 consultant角色置顶
    - 查询认证项里包含 consultant 的 uid
      - uids = db.getCollection('serviceauths').distinct('uid', query: {认证项的条件, uid: {$in: teachers.map(v => v._id)}})
      - 循环找出teachers中的_id 包含 uids 中的老师进行置顶
> 排除自己不可用时间段
  - 排除所有未开始的预订的时间段
  - 排除所有未开始的公开课的时间段
> 匹配老师的时候再次查询是否有冲突
  - 排除所有未开始的预订的时间段
    - sessions = db.getCollection('sessions').find({
      $or: [{'reg._id': uid, school: null}, {uid}],
      start: {$gt: new Date()},
      sessionType: 'live',
      booking: null,}, {uid: 1, start: 1, end: 1})
    - 如果与 sessions 中的起始时间有冲突不能进行匹配
  - 排除所有未开始的公开课的时间段
    - bookings = db.getCollection('servicebookings').find({servicer: uid, cancel: null, start: {$gt: new Date()}}, {servicer: 1, start: 1, end: 1})
    - 如果与 bookings 中的起始时间有冲突不能进行匹配



```js
// 可预约的老师列表 通过服务包查找
const {
  total, limit, skip,
  data: [{
    rating,
    introduction,
    audio,
    audioTime,
    hours,
    holiday,
    enable,
    owner: {_id, name, avatar, email},
    auths: [{ // 已认证的服务项目
      type, mentoringType, countryCode, curriculum, subject, gradeGroup
    }, ...]
  }, ...]
} = await App.service('service-conf').get('teachersByPack', {query: {
  search: 'xxx', // users.name 老师名称
  packUserId: 'servive-pack-user._id',
  subject?: [],
  hours?: [start, end], // 按指定时间段查询老师
  gradeGroup?: ['', ...], // 按年级段过滤老师，不传则以服务包限制为准
  $sort: { // 排序, 值为 1 或 -1
    fans?, // 按粉丝
    'count.rate'? // 按好评比率
  }
}})
```

### 批量查询多个老师最近几天，每日可预约的次数

```js
// 批量查询多个老师最近几天的冲突时间段
const {
  booking: [{
    servicer, start, end
  }],
  session: [{
    uid, start, end
  }]
} = await App.service('service-conf').get('recentDaysHours', query: {uid: ['xxx', ...], days: 14})

// 批量计算多个老师的最近几日可预约次数
confStore.getRecentDays(data: 找老师接口列表的数据, days: 天数, blockTime: 预订多少分钟的课)
data: [{_id, hoursIndex, ...}, ...]

// 这里是例子，实际需要通过找老师接口获取老师列表
const rs = await App.service('service-conf').find({query: {$sort: {_id: -1}}})
// 批量计算可用次数
const list = await confStore.getRecentDays(rs.data, 10, 60)
console.log(list)
list: {[uid]: {[day]: count, ...}, ...}
```
