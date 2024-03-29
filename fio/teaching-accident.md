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
      media: {type: Array}, //图片/视频
    },
  ],
  // 老师申诉
  evidencesTeacher: [
    {
      content: {type: String}, //申诉文本
      media: {type: Array}, //图片/视频
    },
  ],
  status: {type: String, default: 'pending', enum: ['pending', 'approved', 'rejected']}, // 审核状态
  checkReason: {type: String}, // 审核理由
  read: {type: Boolean, default: false}, // 已读
}
```

### teaching-accident api

```js
// 创建
await App.service('teaching-accident').create({
    student: user._id,
    teacher: user._id,
});

//添加一条申诉
await App.service('teaching-accident').patch(_id, {
    $addToSet: {
        evidencesStudent: {
            content: '文本内容',
            media: ['url'],
        },
    },
});

// 更新某条申诉的文本内容
await App.service('teaching-accident').patch('_id', { 'evidencesStudent.$.content': 'new content' }, { query: { 'evidencesStudent._id': evidencesStudent._id } });

// 更新某条申诉的图片/视频
await App.service('teaching-accident').patch('_id', { 'evidencesStudent.$.media': ['url1', 'url2'] }, { query: { 'evidencesStudent._id': evidencesStudent._id } });

// 审核 enum: ['pending', 'approved', 'rejected']
await App.service('teaching-accident').patch('_id', { status: 'approved', checkReason: '审核理由' });

// 已读
await App.service('teaching-accident').get('unreadCount');
// 获取未读数量
await App.service('teaching-accident').patch('_id', { read: true });
```
