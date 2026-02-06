
## questions model
```js
      uid: {type: String}, // user id
      id: {type: String, trim: true}, // slides id or video.id
      page: {type: String, trim: true}, // page id or video.time HH:mm:ss
      type: {type: String, trim: true, enum: Agl.questionsTypes}, // type:
      multi: {type: Boolean, default: false}, // text/choice multi
      bloom: {type: [Number]}, // [Evaluate, Analyze, Apply, Understand, Remember, Create]
      dimension: {type: Number}, // [Factual, Conceptual, Procedural, Megacognitave]
      verb: [{type: String}], // command verb
      tags: [{type: String}], // knowledge tags
      tips: {type: String, trim: true},
      data: {type: String, trim: true}, // url or video question desc
      center: {
        subject: {type: String}, // 中央学科
        grade: {type: String}, // 中央年级
      },
      cpa: {
        status: {type: Number, default: 0}, // 0: 生成中，1：生成成功待确认，2: 已经确认
        curriculum: {type: String}, // 大纲代码
        curriculumName: {type: String, trim: true},
        subject: {type: String}, // 学科id
        subjectName: {type: String, trim: true},
        grade: {type: String, trim: true},
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
        outline: {type: Schema.Types.Mixed}, // ppt outlines
        assess: {type: Schema.Types.Mixed}, // ppt assess
        pd: {type: Schema.Types.Mixed}, // pd
        goal: {type: Schema.Types.Mixed}, // ppt assess
        skills: {type: Schema.Types.Mixed}, // skills
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

## 生成 learnOutcome 接口

> 请求的参数
```js
{
    "curriculum": "au",
    "subject": "695dfd4d0a1fc83c747b4e80",
    "grade": "Year 2",
    "curriculumName": "AU curriculum",
    "subjectName": "Mathematics F-6",
    "type": "choice",
    "multi": true,
    "bloom": [
        "Understand",
        "Analyze",
        "Evaluate"
    ],
    "outlines": {
        "outline": {
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
        },
        "assess": {
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
        }
    },
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

## cpa 离线生成后需要的字段
- status: 0 的数据是需要生成的，生成后改为 1
```js
cpa: {
    status: {type: Number, default: 0}, // 0: 生成中，1：生成成功待确认，2: 已经确认
    a: {type: String, trim: true}, // 文本题
    c: {type: String, trim: true}, // sagemath 代码在r2存储的sha1
    p: {type: String, trim: true}, // sagemath 代码在r2存储的sha1
}
```