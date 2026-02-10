
## topic-standard model
```js
subjectId: {type: String, index: true, required: true}, // subjects._id
topic: [outline], // 单个topic的完整的结构
standard: [outline], // 选中的完整的结构
selected: {type: [String]}, // AI 匹配的 + 人工选择的 standard
approved: {type: [String]}, // 认可选中的 standard
reasons: [{_id: {type: String}, reason: {type: String, trim: true}}], // AI 推荐standard的原因列表
status: {type: Number, default: 0}, // 审核状态 0: 生成中，1：生成成功待确认，2: 已经确认，
```

## outline model
```js
const outline = new Schema({
  name: {type: String, trim: true},
  grade: {type: [String]},
  tags: {type: [String], trim: true},
  code: {type: String, trim: true},
  mark: {type: String, trim: true},
  child: [outline],
})
```


