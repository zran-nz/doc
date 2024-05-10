### session takeaway model

```js
uid: {type: String, required: true}, // users._id
session: {type: String, required: true}, // session._id
page: {type: String}, // page._id
question: {type: String}, // questions._id
score: {type: Number}, // total score
outlines: {
  outline: {type: Schema.Types.Mixed}, // ppt outlines
  assess: {type: Schema.Types.Mixed}, // ppt assess
  pd: {type: Schema.Types.Mixed}, // pd
  goal: {type: Schema.Types.Mixed}, // ppt assess
  skills: {type: Schema.Types.Mixed}, // skills
},
```

### 大纲数据嵌套结构

```js
const outline = {
  name: {type: String, trim: true},
  grade: {type: [String]},
  tags: {type: [String], trim: true},
  code: {type: String, trim: true},
  mark: {type: String, trim: true},
  score: {type: Number}, // 设置的分值
  point: {type: Number}, // 学生实际得分
  child: [outline, ...],
}
```
