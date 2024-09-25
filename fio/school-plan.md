## school plan

### school-plan model

```js
{
  name: {type: String, trim: true},
  logo: {type: String, trim: true},
  country: {type: String, trim: true},
  city: {type: String, trim: true},
  address: {type: String, trim: true},
  phone: {type: [String], trim: true},
  start: {type: Date},
  end: {type: Date},
  status: {type: Number, default: 0}, // 0: applied, create, unpaid, 1: trial, 2: Paid, -1: Expired, 3: Created
  teacher: {type: Number, default: 1},
  student: {type: Number, default: 10},
  count: {
    teacher: {type: Number, default: 0},
    student: {type: Number, default: 0},
    grade: {type: Number, default: 0},
    class: {type: Number, default: 0},
  },
  space: {type: Number, default: 1000 * 1024 * 1024},
  pilot: {type: Boolean, default: false},
  personal: {type: Boolean, default: false},
  commissionEnable: {type: Boolean, default: false}, //佣金开关
  inviter: {type: String, trim: true}, //邀请我的人
  pipelineEnable: {type: Boolean, default: false}, // 销售渠道 系统开关
  pipelineStatus: {type: Number, default: 0}, // 销售渠道 0: inactive, 1: pending, 2: success
  pipelineAt: {type: Date}, //同意时间
  contentProviderEnable: {type: Boolean, default: false}, // 内容供应商 系统开关
  contentProviderStatus: {type: Number, default: 0}, // 内容供应商 0: inactive, 1: pending, 2: success, 3: apply
  contentProviderAt: {type: Date}, //同意时间
  attachmentsLogo: {
    filename: {type: String, trim: true}, // 文件名
    mime: {type: String, trim: true}, // 文件 MIME
    hash: {type: String, trim: true}, // 文件SHA1, files._id
  },
  attachmentsCurriculum: {
    Certificate: {
      subject: {type: String, trim: true}, // subjects._id
      attachments: [
        {
          filename: {type: String, trim: true}, // 文件名
          mime: {type: String, trim: true}, // 文件 MIME
          hash: {type: String, trim: true}, // 文件SHA1, files._id
        },
      ],
    },
    Foundation: {
      subject: {type: String, trim: true}, // subjects._id
      attachments: [
        {
          filename: {type: String, trim: true}, // 文件名
          mime: {type: String, trim: true}, // 文件 MIME
          hash: {type: String, trim: true}, // 文件SHA1, files._id
        },
      ],
    },
    Master: {
      subject: {type: String, trim: true}, // subjects._id
      attachments: [
        {
          filename: {type: String, trim: true}, // 文件名
          mime: {type: String, trim: true}, // 文件 MIME
          hash: {type: String, trim: true}, // 文件SHA1, files._id
        },
      ],
    },
    Bachelor: {
      subject: {type: String, trim: true}, // subjects._id
      attachments: [
        {
          filename: {type: String, trim: true}, // 文件名
          mime: {type: String, trim: true}, // 文件 MIME
          hash: {type: String, trim: true}, // 文件SHA1, files._id
        },
      ],
    },
    Diploma: {
      subject: {type: String, trim: true}, // subjects._id
      attachments: [
        {
          filename: {type: String, trim: true}, // 文件名
          mime: {type: String, trim: true}, // 文件 MIME
          hash: {type: String, trim: true}, // 文件SHA1, files._id
        },
      ],
    },
  },
  feedback: {
    // 留言反馈
    message: {type: String}, // 用户留言内容
    date: {type: Date}, // 留言时间
    read: {type: Boolean, default: false}, // read status
    reply: {type: String}, // 后台回复内容
    replyDate: {type: Date},
    replyRead: {type: Boolean, default: false}, // read status
  },
}
```

### school-plan API

```js
// 向学校管理员发送pipeline邀请加入销售渠道的邮件
App.service('school-plan').get('pipelineEmail', { query: { id: 'school-plan._id' } });

// 向学校管理员发送Content provider邀请成为内容供应商的邮件
App.service('school-plan').get('contentEmail', { query: { id: 'school-plan._id' } });

// 销售渠道/内容供应商
// 关闭销售渠道,关闭会自动发送邮件
App.service('school-plan').patch(_id, { pipelineStatus: 0, pipelineEnable: false });
// 通过销售渠道
App.service('school-plan').patch(_id, { pipelineStatus: 2, pipelineEnable: true });

// 关闭内容供应商,关闭会自动发送邮件
App.service('school-plan').patch(_id, { contentProviderStatus: 0, contentProviderEnable: false });
// 通过内容供应商
App.service('school-plan').patch(_id, { contentProviderStatus: 2, contentProviderEnable: true });

// 文件 添加
App.service('school-plan').patch(_id, {
    $push: {
        attachmentsTeaching: {
            filename: '',
            mime: '',
            hash: '',
        },
    },
});
// 文件 删除
await App.service('school-plan').patch(_id, {
    $pull: {
        attachmentsTeaching: {
            _id: attachmentsTeaching._id,
        },
    },
});
```
