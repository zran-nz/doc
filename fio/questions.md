
## questions model
```js
uid: {type: String}, // user id
id: {type: String, trim: true}, // slides id or video.id
page: {type: String, trim: true}, // page id or video.time HH:mm:ss
type: {type: String, trim: true, enum: Agl.questionsTypes}, // type:
multi: {type: Boolean, default: false}, // text/choice multi
bloom: {type: Number}, // [Evaluate, Analyze, Apply, Understand, Remember, Create]
dimension: {type: Number}, // [Factual, Conceptual, Procedural, Megacognitave]
verb: [{type: String}], // command verb
tags: [{type: String}], // knowledge tags
tips: {type: String, trim: true},
data: {type: String, trim: true}, // url or video question desc
cpa: {
    status: {type: Number, default: 0}, // 0: 生成中，1：生成成功待确认，2: 已经确认
    curriculum: {type: String},
    curriculumName: {type: String},
    subject: {type: String},
    subjectName: {type: String},
    grade: {type: String},
    outcome: {type: String},
    a: {type: String, trim: true}, // 文本题
    c: {type: String, trim: true}, // sagemath 代码在r2存储的sha1
    p: {type: String, trim: true}, // sagemath 代码在r2存储的sha1
    coverc: {type: String, trim: true}, // 封面
    coverp: {type: String, trim: true}, // 封面
},
outlines: {
    outline: {type: Schema.Types.Mixed}, // ppt topics
    assess: {type: Schema.Types.Mixed}, // ppt stanard
    pd: {type: Schema.Types.Mixed}, // pd
    goal: {type: Schema.Types.Mixed}, // ppt assess
    skills: {type: Schema.Types.Mixed}, // skills
},
options: [{
    // options
    val: {type: String, trim: true},
    on: {type: Boolean, default: false}, // choice answer
}],
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
list: [{
    // multi questions for new text
    bloom: {type: Number},
    dimension: {type: Number},
    verb: [{type: String}], // command verb
    tags: [{type: String}], // knowledge tags
}],
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
  {outcome: 'test a', bloom: "Understand"},
  {outcome: 'test b', bloom: "Analyze"},
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