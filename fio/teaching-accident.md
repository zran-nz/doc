## teaching-accident

### teaching-accident model

```js
{
    student: {type: String, required: true}, //user_id
    teacher: {type: String, required: true}, //user_id
    serviceType: {type: String},
    session: {type: String}, // 关联session
    sessionName: {type: String}, // 关联session.name
    // 学生申诉
    evidencesStudent: [
      {
        content: {type: String}, //申诉文本
        attachments: [
          {
            // 图片/视频证据
            filename: {type: String, trim: true}, // 文件名
            mime: {type: String, trim: true}, // 文件 MIME
            hash: {type: String, trim: true}, // 文件SHA1, files._id
          },
        ],
      },
    ],
    // 老师申诉
    evidencesTeacher: [
      {
        content: {type: String}, //申诉文本
        attachments: [
          {
            // 图片/视频证据
            filename: {type: String, trim: true}, // 文件名
            mime: {type: String, trim: true}, // 文件 MIME
            hash: {type: String, trim: true}, // 文件SHA1, files._id
          },
        ],
      },
    ],
    status: {type: String, default: 'pending', enum: ['pending', 'approved', 'rejected']}, // 审核状态
    checkReason: {type: String}, // 审核理由
    read: {type: Boolean, default: false}, // 已读
    tag: {type: String}, //标签
}
```

### teaching-accident api

```js
// 查询
await App.service('teaching-accident').find({
    teacher: user._id,
    tag: tag,
});

// 创建
await App.service('teaching-accident').create({
    student: user._id,
    teacher: user._id,
    serviceType: serviceType,
    session: session._id,
    sessionName: session.name,
    // 学生申诉
    evidencesStudent: [
        {
            content: '学生申诉文本内容', //申诉文本
            attachments: [
                {
                    filename: 'peer-avater.png',
                    mime: 'image/png',
                    hash: '1ac8b6c019ceacb23317bcc72fd6d02a46db04a7',
                },
                {
                    filename: 'self-avatar.png',
                    mime: 'image/png',
                    hash: '38cdc8b09b689f9e63a66d912004e3758c6143ab',
                },
            ],
        },
    ],
    // 老师申诉
    // evidencesTeacher: [
    //     {
    //         content: '老师申诉文本内容',
    //         attachments: [
    //             {
    //                 filename: 'peer-avater.png',
    //                 mime: 'image/png',
    //                 hash: '1ac8b6c019ceacb23317bcc72fd6d02a46db04a7',
    //             },
    //         ],
    //     },
    // ],
    tag: tag,
});

//添加一条申诉
await App.service('teaching-accident').patch(_id, {
    $addToSet: {
        evidencesStudent: {
            content: '文本内容',
            attachments: [],
        },
    },
});

// 更新某条申诉的文本内容
await App.service('teaching-accident').patch('_id', { 'evidencesStudent.$.content': 'new content' }, { query: { 'evidencesStudent._id': evidencesStudent._id } });

// 更新某条申诉的图片/视频
await App.service('teaching-accident').patch('_id', { 'evidencesStudent.$.attachments': [] }, { query: { 'evidencesStudent._id': evidencesStudent._id } });

// 审核 enum: ['pending', 'approved', 'rejected']
await App.service('teaching-accident').patch('_id', { status: 'approved', checkReason: '审核理由' });

// 已读
await App.service('teaching-accident').get('unreadCount');
// 获取未读数量
await App.service('teaching-accident').patch('_id', { read: true });
```
