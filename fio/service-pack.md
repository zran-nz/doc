## 服务包

### service-pack model

```js
name: {type: String, trim: true}, // 服务包名称
cover: {type: String, trim: true}, // files._id
coverName: {type: String, trim: true}, // 图片名称
points: {type: [String], trim: true}, // selling points
type: {type: String, required: true, enum: Agl.ServiceType}, // 服务类型
serviceRoles: {type: String, enum: Agl.ServiceRoles}, // 服务角色
mentoringType: {type: String, enum: Agl.MentoringType}, // 辅导类型
countryCode: {type: [String], trim: true}, // 国家代码
curriculum: {type: String, trim: true}, // curriculum.code
subject: {type: [String], trim: true}, // subjects._id
topic: [{ // 用于 essay, teacherTraining等大纲层级 认证项, subjects.topic..._id || topic._id
  _id: {type: String, trim: true}, // subjects.topic..._id
  label: {type: [String], trim: true}, // subjects.topic...name
}],
gradeGroup: {type: [String], trim: true}, // 年级组
qualification: {type: String, trim: true}, // 服务包需要的资质
// 主题服务包 支持关联多个课件 https://github.com/zran-nz/bug/issues/4861
contentOrientatedEnable: {type: Boolean, default: false}, // type === 'mentoring' 专用
contentOrientatedConfig: {
  price: {type: Number}, // 主题服务包的价格
  schoolPrice: {type: Number, trim: true}, // 给机构的价格 单次价格 *100，cc，美分
},
contentOrientated: [
  {
    premium: {type: String, trim: true}, // contentOrientated === true 才有，取认证过的精品课 service-auth._id
    subject: {type: String, trim: true}, // 学科_id https://github.com/zran-nz/bug/issues/5344
    times: {type: Number}, // 最少授课次数，必须大于0
    price: {type: Number, trim: true}, // 单次价格 *100，cc，美分
    schoolPrice: {type: Number, trim: true}, // 给机构的价格 单次价格 *100，cc，美分
    servicePack: {type: String}, // 捆绑的服务包, service-pack._id 服务包id
    message: {type: String}, // 认证课不正常的时候提示
  },
],
consultant: {
  // 顾问配置
  type: {type: String, enum: Agl.ConsultantType}, // 顾问类型
  carerService: {type: String},
  servicePack: {type: String}, // 捆绑的服务包, service-pack._id 服务包id
},
interviewPack: {
  _id: {type: String}, // 面试捆绑的服务包, service-pack._id 服务包id
  times: {type: Number}, // 次数
},
carerPack: {
  _id: {type: String}, // 管家捆绑的服务包, service-pack._id 服务包id
  times: {type: Number}, // 次数
},
price: {type: Number, trim: true}, // 单次价格 *100，cc，美分
discount: [
  {
    count: {type: Number}, // 数量
    discount: {type: Number}, // 折扣 %
    gifts: {type: Number, default: 0}, // 免费赠送的次数
  },
],
discountConfig: {
  // 折扣配置
  enable: {type: Boolean, default: false}, // 是否启用折扣
  end: {type: Date}, // 折扣截止时间
  discount: {type: Number}, // 主题服务包 统一折扣 %
},
freq: {type: Number, enum: [7, 14, 30, 120]}, // 每张的可用多少天
duration: {type: Number}, // session duration 单位：分钟
break: {type: Number}, // session break 单位：分钟
status: {type: Boolean, default: false}, // 发布状态
lastPublished: {type: Date}, // 上次发布时间
count: {
  // 统计
  sold: {type: Number}, // 已售
  valid: {type: Number}, // 有效数量
  ticket: {type: Number}, // 有效代金券数量
},
attachments: [
  {
    // 图片/视频，附件，推广素材, 插入到课堂的时候，显示在素材中
    filename: {type: String, trim: true}, // 文件名
    mime: {type: String, trim: true}, // 文件 MIME
    hash: {type: String, trim: true}, // 文件SHA1, files._id
    videoType: {type: String, enum: Agl.ServicePackVideoType}, // 视频的类型
  },
],
income: {type: Number, default: 0}, //收入总计,单位分
statistic: [
  {
    count: {type: Number}, // 数量 服务包次数
    orderCount: {type: Number, default: 0}, // 订单购买次数
    income: {type: Number, default: 0}, //收入总计,单位分
    isSchool: {type: Boolean, default: false}, // 学校/个人购买
    type: {type: String, enum: ['lecture', 'mentor', 'all']}, // 购买类型
    city: {type: String}, // 线下 城市
  },
],
salesTarget: {type: [String], enum: Agl.ServiceSalesTarget}, // 销售目标
backgroundCheck: {type: Boolean, default: false}, // academic 是否启用背景审查
requirements: {type: String, default: false}, // academic 是否启用背景审查描述
requirementsItems: {type: [String]}, // academic requirements 二级数据
interview: {type: Boolean, default: false}, // 是否启用面试
splitSale: {type: Boolean, default: false}, // 是否可以分拆卖
filled: {type: Boolean, default: false}, // All forms have been filled
reason: {type: String}, // 下架原因
keywords: {type: [String]}, // 关键词搜索用，[subject, topic, ...]

isOnCampus: {type: Boolean, default: false}, // 线上/线下
country: {type: String, trim: true},
onCampusPrice: [
  {
    hash: {type: String, trim: true},
    city: {type: String, trim: true},
    price: {type: Number, trim: true}, // 单次价格 *100，cc，美分
    discount: [
      {
        count: {type: Number}, // 数量
        discount: {type: Number}, // 折扣 %
        gifts: {type: Number, default: 0}, // 免费赠送的次数
      },
    ],
  },
],
```

### 服务包接口

```js
// 发布服务
await App.service('service-pack').patch(doc._id, { status: true });
// 下架服务
await App.service('service-pack').patch(doc._id, { sta.tus: false });
// 服务包列表（后台）
await App.service('service-pack').find({ query: {} });

// 服务包列表（featured）
await App.service('service-pack').find({ query: { status: true } });

// 服务包列表 拼接service-pack-school-price数据 判断是否显示buy按钮
await App.service('service-pack').find({ query: { $school: 'school-plan._id' } });
```

### 老师自己可用的服务包列表

```js
const {
    data: [
        {
            // 参考 service-pack model
            _id,
            name,
            cover,
            type,
            mentoringType,
            countryCode,
            curriculum,
            subject,
            topic,
            gradeGroup,
            qualification,
            serviceRoles,
        },
    ],
} = await App.service('service-pack').get('TeacherSideViewData');
```

### 服务包统计

```js
const {
  mentoringType: {
    'mentoringType': 3, ....
  }
  curriculum: {
    'curriculum': 2, ...
  },
  subject: {
    'subject._id': 4, ...
  }
} = await App.service('service-pack').get('groups')
```

### 服务包视频

```js
// 单个添加
await App.service('service-pack').patch(doc._id, {
    $addToSet: { attachments: { filename, mime, hash, videoType } },
});

// 单个删除
await App.service('service-pack').patch(doc._id, {
    $pull: { attachments: { _id: doc.attachments[x]._id } },
});
```

### 服务包推荐

```js
// 老师取 "teacherTraining"的数据, 学生取非"teacherTraining"的数据
await App.service('service-pack').get('index');
// 学校下
await App.service('service-pack').get('index', { query: { salesTarget: 'school' } });
```
