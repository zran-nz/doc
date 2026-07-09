
## questions model
```js
uid: {type: String}, // user id
id: {type: String, trim: true}, // slides id or video.id
page: {type: String, trim: true}, // page id or video.time HH:mm:ss
type: {type: String, trim: true, enum: Agl.questionsTypes}, // 'text', 'choice', 'comment', 'draw', 'media', 'website', 'matching', 'filling', 'graph', 'video'
multi: {type: Boolean, default: false}, // text/choice multi
bloom: {type: [Number]}, // [Evaluate, Analyze, Apply, Understand, Remember, Create]
dimension: {type: Number}, // [Factual, Conceptual, Procedural, Megacognitave]
verb: [{type: String}], // command verb
tags: [{type: String}], // knowledge tags
tips: {type: String, trim: true},
data: {type: String, trim: true}, // url or video question desc
center: {
  subject: {type: String}, // 中央学科 cpa-subjects.code
  grade: {type: [String]}, // 中央年级 zran-nz/web:/src/boot/grades.js
},
cpa: {
  status: {type: Number, default: 0}, // 0: 生成中，1：生成成功待确认，2: 已经确认
  curriculum: {type: String}, // 大纲代码
  curriculumName: {type: String, trim: true},
  subject: {type: String}, // 学科id
  subjectName: {type: String, trim: true},
  grade: {type: String, trim: true},
  topic: {type: String}, // outlines.outline....child._id 最后一层 child._id
  standard: {type: String}, // outlines.assess....child._id 最后一层 child._id
  outcome: {type: String, trim: true},
  reason: {type: String, trim: true}, //  learning outcome AI推荐理由
  feedback: {type: [String], trim: true}, // learning outcome 反馈标签 zran-nz/web:/src/boot/const.js CPAFeedbackOutcome
},
abstract: {
  cover: {type: String, trim: true}, // PPT 封面, 用来插入google slide, 课堂上课, 1280*720
  reason: {type: String, trim: true}, // AI推荐理由
  data: {type: String, trim: true}, // 题目文本内容 格式参考 https://mathlive.io/mathfield/
  status: {type: Number, default: 0}, // 0: 生成中，1：生成成功待确认，2: 已经确认，3: 有反馈
  feedback: {type: [String], trim: true}, // 反馈标签 zran-nz/web:/src/boot/const.js CPAFeedbackAbstract
},
pictorial: {
  cover: {type: String, trim: true}, // 封面, 320*180, 比例：16:9
  reason: {type: String, trim: true}, // AI推荐理由
  script: {type: String, trim: true}, // 出题脚本
  data: {type: String, trim: true}, // html代码上传r2存储的sha1
  status: {type: Number, default: 0}, // 0: 生成中，1：生成成功待确认，2: 已经确认，3: 有反馈
  feedback: {type: [String], trim: true}, // 反馈标签 zran-nz/web:/src/boot/const.js CPAFeedbackOptions
},
concrete: {
  cover: {type: String, trim: true}, // 封面
  reason: {type: String, trim: true}, // AI推荐理由
  script: {type: String, trim: true}, // 出题脚本
  data: {type: String, trim: true}, // html代码上传r2存储的sha1
  status: {type: Number, default: 0}, // 0: 生成中，1：生成成功待确认，2: 已经确认，3: 有反馈
  feedback: {type: [String], trim: true}, // 反馈标签 zran-nz/web:/src/boot/const.js CPAFeedbackOptions
},
score: {
  // score config
  outline: {
    val: {type: Number}, // total score
    enable: {type: Boolean, default: false}, // score enable
    rubric: {type: Boolean, default: false}, // rubric enable
    criteria: {type: Schema.Types.Mixed}, // criteria data
  },
  assess: {
    val: {type: Number},
    enable: {type: Boolean, default: false},
    rubric: {type: Boolean, default: false},
    criteria: {type: Schema.Types.Mixed},
  },
  pd: {
    val: {type: Number},
    enable: {type: Boolean, default: false},
    rubric: {type: Boolean, default: false},
    criteria: {type: Schema.Types.Mixed},
  },
  goal: {
    val: {type: Number},
    enable: {type: Boolean, default: false},
    rubric: {type: Boolean, default: false},
    criteria: {type: Schema.Types.Mixed},
  },
  skills: {
    val: {type: Number},
    enable: {type: Boolean, default: false},
    rubric: {type: Boolean, default: false},
    criteria: {type: Schema.Types.Mixed},
  },
},
outlines: {
  outline: [outlineSchema], // subjects.snapshot.topic
  assess: [outlineSchema], // subjects.snapshot.standard
  pd: [outlineSchema], // pd
  goal: [outlineSchema], // ppt assess
  skills: [outlineSchema], // skills
},
options: [
  {
    // options
    val: {type: String, trim: true},
    on: {type: Boolean, default: false}, // choice answer
  },
],
list: [
  {
    // multi questions for new text
    bloom: {type: Number},
    dimension: {type: Number},
    verb: [{type: String}], // command verb
    tags: [{type: String}], // knowledge tags
  },
],
```

https://github.com/zran-nz/web/blob/magic/src/boot/const.js

- outlineSchema model
```js
outlineSchema = {
  name: {type: String, trim: true},
  grade: {type: [String]},
  tags: {type: [String], trim: true},
  code: {type: String, trim: true},
  mark: {type: String, trim: true},
  child: [outlineSchema], // 递归引用自身
}
```


> 返回格式
```js
[
  {outcome: 'test a', bloom: ["Understand", "..."]},
  {outcome: 'test b', bloom: ["Analyze"]},
  ...
]
```

## r2存储上传接口

> 请求方式 将html文件转为 base64 格式
```bash
# 开发环境
curl -X POST -F "file=@./index.html" https://dev.classcipe.com/fio/tool/upfileTmp
# 产线
curl -X POST -F "file=@./index.html" https://classcipe.com/fio/tool/upfileTmp
```
> 返回结果取 _id 即可
```json
{
    "_id":"8b3861a7c59d33f651ee90629bf5d2a045e3638b",
    "mime":"text/html",
    "title":{},
    "ext":"html",
    "size":8889,
    "createdAt":"2026-01-30T06:39:15.862Z"
}
```

> 访问：
- 开发环境: https://r2dev.classcipe.com/8b3861a7c59d33f651ee90629bf5d2a045e3638b
- 产线: https://r2.classcipe.com/8b3861a7c59d33f651ee90629bf5d2a045e3638b

## cpa 离线生成后需要更新的字段
- status: 0 的数据是需要生成的，生成后改为 1
```js
cpa: {
  status: {type: Number, default: 0}, // 0: 生成中，1：生成成功待确认，2: 已经确认
  outcome: {type: String, trim: true},
  feedback: {type: [String], trim: true}, // learning outcome 反馈标签
},
abstract: {
  cover: {type: String, trim: true}, // PPT 封面, 用来插入google slide, 课堂上课
  reason: {type: String, trim: true}, // AI推荐理由
  data: {type: String, trim: true}, // 题目文本内容
  status: {type: Number, default: 0}, // 0: 生成中，1：生成成功待确认，2: 已经确认，3: 有反馈
  feedback: {type: [String], trim: true}, // 反馈标签
},
pictorial: {
  cover: {type: String, trim: true}, // 封面
  reason: {type: String, trim: true}, // AI推荐理由
  script: {type: String, trim: true}, // 出题脚本
  data: {type: String, trim: true}, // html代码上传r2存储的sha1
  status: {type: Number, default: 0}, // 0: 生成中，1：生成成功待确认，2: 已经确认，3: 有反馈
  feedback: {type: [String], trim: true}, // 反馈标签
},
concrete: {
  cover: {type: String, trim: true}, // 封面
  reason: {type: String, trim: true}, // AI推荐理由
  script: {type: String, trim: true}, // 出题脚本
  data: {type: String, trim: true}, // html代码上传r2存储的sha1
  status: {type: Number, default: 0}, // 0: 生成中，1：生成成功待确认，2: 已经确认，3: 有反馈
  feedback: {type: [String], trim: true}, // 反馈标签
},
```

## cpa题库匹配搜索接口
### AI图文解析接口:
- file 可以是 image, word, pdf 文件
- 接口返回分析后的 prompt 内容

```js
// 通过图片url分析
const formData = new FormData()
formData.append('file', file)
const rs = await fetch('/fio/urlAnalyze', {
  method: 'POST',
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({url: 'https://xxxxxx'}),
}).then((r) => r.json())

// 通过文件上传分析
const formData = new FormData()
formData.append('file', file)
const rs = await fetch('/fio/fileAnalyze', {
  method: 'POST',
  body: formData,
}).then((r) => r.json())
// 返回
rs = {prompt: 'xxxxx'}
```


### AI搜题接口:
- 请求提供 中央学科与年级用于过滤数据, prompt 或者 知识点+考核项 来匹配题库
- 返回所有匹配中的quetions 题库中的数据

```js
const rs = await fetch('/fio/questionsMatch', {
  method: 'POST',
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({
    center: {
      subject: 'math', // 中央学科的代码
      grade: 'Grade 1'
    },
    prompt: 'xxxx',
    outlines: {
      outline: {...}, // 知识点
      assess: {...}, // 考核项
    }
  }),
}).then((r) => r.json())
// 返回
rs = {total: 14, limit: 10, skip: 0, data: [...quetions model]}
```

### AI生成outcomes接口:
- 请求提供 大纲, 学科, 年级, 知识点, 考核项
- 返回多套 outcomes + bloom 给老师选择

```js
const rs = await fetch('/fio/outcomesCreate', {
  method: 'POST',
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({
    cpa: {
      curriculum: "au",
      curriculumName: "AU curriculum",
      subject: "695dfd4d0a1fc83c747b4e80",
      subjectName: "Mathematics F-6",
      grade: "Year 2",
      topic: '695dfde20a1fc83c747b51e1', // outlines.outline....child._id 最后一层 child._id
      standard: '695dfd8d0a1fc83c747b4f5e', // outlines.assess....child._id 最后一层 child._id
    },
    outlines: {
      outline: {...}, // 知识点
      assess: {...}, // 考核项
    }
  }),
}).then((r) => r.json())
// 返回
rs = [{outcome: 'xxx', bloom: [2,4]}, ...]
```

### AI生成题目接口:
- 请求提供 大纲, 学科, 年级, 知识点, 考核项, outcome
- 返回实时生成的cpa quetions 数据本身
- 写入quesion数据的时候还需要将 学科和年级 转为中央大纲 保存起来

```js
const rs = await fetch('/fio/questionCreate', {
  method: 'POST',
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({
    type: 'choice', // QuestionTypes
    multi: true,
    bloom: [1,2],
    cpa: {
      curriculum: "au",
      curriculumName: "AU curriculum",
      subject: "695dfd4d0a1fc83c747b4e80",
      subjectName: "Mathematics F-6",
      grade: "Year 2",
      topic: '695dfde20a1fc83c747b51e1', // outlines.outline....child._id 最后一层 child._id
      standard: '695dfd8d0a1fc83c747b4f5e', // outlines.assess....child._id 最后一层 child._id
      outcome: 'xxxxx',
    },
    outlines: {
      outline: {...}, // 知识点
      assess: {...}, // 考核项
    }
  }),
}).then((r) => r.json())
rs = {...questions model}
```


```json
// outlines.outline 知识点数据demo
"outline": [{
    "code": "au:695dfd4d0a1fc83c747b4e80",
    "name": "Mathematics F-6",
    "curr": "AU curriculum",
    "child": [
        {
            "name": "Number",
            "grade": [
                "Foundation",
                "Year 1",
                "Year 2",
                "Year 3",
                "Year 4",
                "Year 5",
                "Year 6"
            ],
            "tags": [],
            "code": "",
            "mark": "Foundation, Level 1, Level 2, Level 3, Level 4, Level 5, Level 6",
            "child": [
                {
                    "name": "recognise, represent and order numbers to at least 1000 using physical and virtual materials, numerals and number lines\nVC2M2N01",
                    "grade": [
                        "Year 2"
                    ],
                    "tags": [],
                    "code": "",
                    "mark": "Level 2",
                    "child": [
                        {
                            "name": "reading and writing numerals, and saying and ordering two-, three- and four-digit numbers using patterns in the number system, including numbers with zeros in different places and numbers that look and sound similar (such as 808, 880, 818 and 881)",
                            "grade": [
                                "Year 2"
                            ],
                            "tags": [],
                            "code": "",
                            "mark": "Level 2",
                            "child": [],
                            "_id": "695dfde20a1fc83c747b51e1",
                            "bloom": null,
                            "deminsion": null
                        }
                    ],
                    "_id": "695dfde20a1fc83c747b51de"
                }
            ],
            "_id": "695dfde20a1fc83c747b51a5"
        }
    ]
}]


// outlines.assess 考核点数据demo
"assess": [{
    "code": "au:695dfd4d0a1fc83c747b4e80",
    "name": "Mathematics F-6",
    "curr": "AU curriculum",
    "child": [
        {
            "name": "Number",
            "grade": [
                "Foundation",
                "Year 1",
                "Year 2",
                "Year 3",
                "Year 4",
                "Year 5",
                "Year 6"
            ],
            "tags": [],
            "code": "",
            "mark": "Foundation, Level 1, Level 2, Level 3, Level 4, Level 5, Level 6",
            "child": [
                {
                    "name": "They use mathematical modelling to solve practical additive and multiplicative problems, including money transactions, representing the situation and choosing calculation strategies.",
                    "grade": [
                        "Year 2"
                    ],
                    "tags": [],
                    "code": "",
                    "mark": "Level 2",
                    "child": [],
                    "_id": "695dfd8d0a1fc83c747b4f5e",
                    "bloom": null,
                    "deminsion": null
                }
            ],
            "_id": "695dfd8d0a1fc83c747b4f53"
        }
    ]
}]
```



### questions 创建接口
```js
const rs = await fetch('/fio/questions', {
  method: 'POST',
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({
    type: 'choice', // QuestionTypes
    multi: true,
    bloom: [1,2],
    uid: '1',
    cpa: {
      curriculum: "au",
      curriculumName: "AU curriculum",
      subject: "695dfd4d0a1fc83c747b4e80",
      subjectName: "Mathematics F-6",
      grade: "Year 2",
      topic: '695dfde20a1fc83c747b51e1', // outlines.outline....child._id 最后一层 child._id
      standard: '695dfd8d0a1fc83c747b4f5e', // outlines.assess....child._id 最后一层 child._id
      outcome: 'xxxxx',
    },
    outlines: {
      outline: {...}, // 知识点
      assess: {...}, // 考核项
    },
    abstract: {...},
    pictorial: {...},
    concrete: {...},
  }),
}).then((r) => r.json())
```

### 后台过滤接口
- 通过过滤条件搜题
```js
await App.service('questions').find({
  query: {
    uid: '1',
    'cpa.status': 2,
    'abstract.status': 2,
    'pictorial.status': 2,
    'concrete.status': 2,
    'cpa.curriculum': '',
    'cpa.subject': '',
    'cpa.grade': '',
    'cpa.topic': '',
    'cpa.standard': '',
    bloom: '',
  }
})
```

### 按学科年级获取 topic+standard 组合接口
- 传入 `subject`（学科 id）+ `grade`（年级）过滤 questions 中的 `cpa.subject` + `cpa.grade`
- 返回该学科年级下所有出现过的 `{topic, standard}` 不重复组合
- 排序按 `topic` 在 `subjects.snapshot.topic` 树中"最后一层叶子节点 `_id`"的先后顺序输出；未在快照中命中的 topic 排到末尾

```js
// feathers 服务调用
const rs = await App.service('questions').get('cpaTopics', {
  query: {
    subject: '695dfd4d0a1fc83c747b4e80', // subjects._id (即 cpa.subject)
    grade: 'Year 2',                     // cpa.grade
  },
})

// HTTP 调用
// GET /questions/cpaTopics?subject=<subjectId>&grade=<grade>

// 返回
rs = [
  {topic: '695dfde20a1fc83c747b51e1', standard: '695dfd8d0a1fc83c747b4f5e'},
  {topic: '695dfde20a1fc83c747b51e2', standard: '695dfd8d0a1fc83c747b4f60'},
  // ...
]
```

### 按 topic+standard 搜索相似题目接口
- 传入 `topic`（知识点 id）+ `standard`（考核项 id）
- 内部流程：
  1. 根据 `topic` 通过 `knowledge-tag-mapping` 查询关联的知识标签，再扩散得到相关的 `topicIds`（当 `useTags=false` 时跳过此步）
  2. 根据 `topic + standard` 从 `questions`（`uid: '1'`）中收集所有已存在的 `cpa.outcome`
  3. 依次以每个 `outcome` 作为 prompt 调用 `question-vector.getDataByPrompt` 进行向量匹配，按 `score` 保留每个题目的最高得分并记录 `matchedOutcome`
  4. 按 `score` 从高到低排序后，回查 `questions` 获取完整题目数据
- 结果会以 `topic+standard+score+limit+useTags` 作为 key 缓存到 redis（TTL 3600s）

```js
// feathers 服务调用
const rs = await App.service('questions').get('searchCpaByTopic', {
  query: {
    topic: '695dfde20a1fc83c747b51e1',    // 知识点 id (cpa.topic)
    standard: '695dfd8d0a1fc83c747b4f5e', // 考核项 id (cpa.standard)
    score: 0.8,                            // 可选，向量匹配最低分，默认 0.8
    limit: 200,                            // 可选，向量匹配返回条数上限，默认 200
    useTags: true,                         // 可选，是否使用 knowledge-tag-mapping 扩散 topicIds，默认 true
  },
})

// HTTP 调用
// GET /questions/searchCpaByTopic?topic=<topicId>&standard=<standardId>&score=0.8&limit=200&useTags=true

// 返回（数组，按 score 降序）
rs = [
  {
    _id: '...',
    score: 0.92,
    matchedOutcome: 'xxxx',
    cpa: {...},
    abstract: {cover, data},
    pictorial: {cover, data},
    concrete: {cover, data},
    createdAt: '...',
    // ...其他 selectCpa 中的字段
  },
  // ...
]
```

### 查询老师是否使用过某些题目接口
- 需要 JWT 认证，`params.user._id` 即当前老师 id
- 传入题目 id 列表（支持 `_ids` 或 `ids`，字符串数组或单个字符串均可）
- 可选传入 `school`，存在时会额外过滤 `session.school = school`
- 内部会在 `session`（`uid = 当前用户 id`）中匹配 `questions._id`，取每个题目最近一次的 `session.createdAt`
- 只返回被当前老师使用过的题目

```js
// feathers 服务调用（需登录）
const rs = await App.service('questions').get('usedByTeacher', {
  query: {
    ids: ['695dfde20a1fc83c747b51e1', '695dfde20a1fc83c747b51e2'],
    school: '695dfd4d0a1fc83c747b4e80', // 可选，存在时按学校过滤
  },
})

// HTTP 调用
// GET /questions/usedByTeacher?ids[]=<id1>&ids[]=<id2>&school=<schoolId>
// Header: Authorization: Bearer <jwt>

// 返回（只包含被使用过的题目，按传入顺序）
rs = [
  {_id: '695dfde20a1fc83c747b51e1', createdAt: '2026-01-30T06:39:15.862Z'},
  // ...
]
```

### 查询学生是否使用过某些题目接口
- 需要 JWT 认证，`params.user._id` 即当前学生 id
- 传入题目 id 列表（支持 `_ids` 或 `ids`，字符串数组或单个字符串均可）
- 内部会在 `session`（`students` 数组包含当前用户 id）中匹配 `questions._id`，取每个题目最近一次的 `session.createdAt`
- 只返回被当前学生使用过的题目

```js
// feathers 服务调用（需登录）
const rs = await App.service('questions').get('usedByStudent', {
  query: {
    ids: ['695dfde20a1fc83c747b51e1', '695dfde20a1fc83c747b51e2'],
  },
})

// HTTP 调用
// GET /questions/usedByStudent?ids[]=<id1>&ids[]=<id2>
// Header: Authorization: Bearer <jwt>

// 返回（只包含被使用过的题目，按传入顺序）
rs = [
  {_id: '695dfde20a1fc83c747b51e1', createdAt: '2026-01-30T06:39:15.862Z'},
  // ...
]
```

### 查询全平台近 7 天是否使用过某些题目接口
- **无需认证**，不区分用户
- 传入题目 id 列表（支持 `_ids` 或 `ids`，字符串数组或单个字符串均可）
- 内部会在 `session` 中匹配 `questions._id`，且 `session.createdAt >= 当前时间 - 7 天`
- 取每个题目最近一次的 `session.createdAt`
- 只返回近 7 天在全平台被使用过的题目

```js
// feathers 服务调用
const rs = await App.service('questions').get('usedByPlatform', {
  query: {
    ids: ['695dfde20a1fc83c747b51e1', '695dfde20a1fc83c747b51e2'],
  },
})

// HTTP 调用
// GET /questions/usedByPlatform?ids[]=<id1>&ids[]=<id2>

// 返回（只包含近 7 天在全平台被使用过的题目，按传入顺序）
rs = [
  {_id: '695dfde20a1fc83c747b51e1', createdAt: '2026-01-30T06:39:15.862Z'},
  // ...
]
```
