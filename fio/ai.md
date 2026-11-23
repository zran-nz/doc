## AI

### batchPolish

```js
const {
  id: 'requestId',
  action: 'batchPolish',
  data: [
    {polished: 'xxxx'},
    ...
  ]
} = await App.service('ai').create({
  action: 'batchPolish',
  prompts:[
    'I built a simple project that helps organize and present what we learned in class. It includes the key ideas and examples we discussed during the lesson.'
  ],
  subjects?: ['Math', ...], // 可选
  grades?: ['Grade 1', ...], // 可选
})
```

### understandImage

传入 base64 编码的图片，调用 Google AI 返回图片理解结果。

```js
const {
  id: 'requestId',
  action: 'understandImage',
  data: '图片内容的描述文本...'
} = await App.service('ai').create({
  action: 'understandImage',
  image: 'data:image/png;base64,iVBORw0KGgo...', // 必填，支持带 dataURL 前缀或纯 base64 字符串
  prompt?: '请描述这张图片的内容', // 可选，自定义提示词，默认为 'Please describe the content of this image in detail.'
  mimeType?: 'image/png', // 可选，图片 MIME 类型，默认 'image/png'；若 image 带 dataURL 前缀会自动解析
  model?: 'gemini-2.5-flash', // 可选，默认 'gemini-2.5-flash'
  thinking?: false, // 可选，是否启用思考模式，默认 false
})
```

### ocrImage

传入 base64 编码的图片，调用 Google Cloud Vision API 进行 OCR 文字识别。

```js
const {
  id: 'requestId',
  action: 'ocrImage',
  data: {
    text: '识别出的完整文本...',
    locale: 'zh',            // 识别到的语言
    blocks: [                // 每个识别片段的文本与位置
      {text: 'xxx', boundingPoly: {vertices: [{x, y}, ...]}},
      ...
    ]
  }
} = await App.service('ai').create({
  action: 'ocrImage',
  image: 'data:image/png;base64,iVBORw0KGgo...', // 必填，支持带 dataURL 前缀或纯 base64 字符串
  mimeType?: 'image/png',    // 可选，图片 MIME 类型，默认 'image/png'；若 image 带 dataURL 前缀会自动解析
  languageHints?: ['zh', 'en'], // 可选，语言提示，字符串数组或逗号分隔字符串，用于提升识别准确率
})
```

### parseStudentInfo

从任意自由文本（可能是粘贴的通讯录、名单、OCR 识别结果等）中抽取学生与家长信息，返回结构化字段，用于自动填充「Add student」表单。

```js
const {
  id: 'requestId',
  action: 'parseStudentInfo',
  data: {
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    dob: '',        // YYYY/MM/DD
    gender: '',     // 'male' | 'female' | 'other' | ''
    parentFirstName: '',
    parentLastName: '',
    parentEmail: '',
    parentPhone: '',
  }
} = await App.service('ai').create({
  action: 'parseStudentInfo',
  text: '张小明，zhangxm@example.com，2015/03/12，家长 138********', // 必填，待识别的原始文本
  model?: 'gemini-3.5-flash-lite', // 可选，默认 'gemini-3.5-flash-lite'
  thinking?: false, // 可选，是否启用思考模式，默认 false
})


// 示例：
Student: John Smith (Johnny)
DOB: March 12, 2015
Gender: Male
Email: john.smith@school.edu
Parent: Sarah Smith
Phone: +1 (415) 555-0132
Email: sarah.smith@gmail.com
```

**字段说明**：
- 保持原语言，不翻译。
- 无法可靠识别的字段返回空字符串。
- `dob` 强制归一化为 `YYYY/MM/DD`。
- `gender` 只输出 `male` / `female` / `other` 或空字符串。
- 如整名无法拆分，姓名整体放入 `firstName`，`lastName` 为空。

### checkAnswer

对比用户答案与正确答案，判断是否正确。对于简单答案（无空格）直接进行字符串比对，复杂答案调用 AI 进行语义比对。

```js
const {
  id: 'requestId',
  action: 'checkAnswer',
  data: {
    result: 1  // 1 表示正确，0 表示错误
  }
} = await App.service('ai').create({
  action: 'checkAnswer',
  problem_a?: '题目内容', // 可选，题目描述
  answer: '正确答案',     // 必填，正确答案
  user_answer: '用户答案', // 必填，用户提交的答案
})
```

**返回值说明**：
- `result`: `1` 表示用户答案与正确答案语义一致，`0` 表示不一致
- 若 `answer` 不包含空格，将直接进行大小写不敏感的字符串比对，不调用 AI
- 若 `answer` 包含空格，将调用 AI 进行语义比对

### upfileZip

上传 ZIP 文件，服务端将文件保存到 R2 `zip/{datetime}` 路径，并在 `zippres` 集合创建一条记录（记录文件路径、purpose、文件大小 `size`，`status` 默认为 0）。

```
for dev:
POST https://dev.classcipe.com/fio/tool/upfileZip
for prod:
POST https://classcipe.com/fio/tool/upfileZip
Content-Type: multipart/form-data
```

**请求参数**：

| 参数 | 类型 | 必填 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| purpose | string | 是 | curriculum、feedback、compare、html | 指定处理目的（html 仅记录标记，不触发 LO/A 更新） |
| zip | file | 是 | ZIP 文件 | ZIP 压缩文件 |

**成功响应**：`200 OK`

```json
{
  "code": 0
}
```

- `code = 0`：表示请求处理成功。

**错误响应**：返回对应的 HTTP Status Code，并在响应 JSON 中返回业务错误码。统一格式：

```json
{
  "code": 10001,
  "message": "Invalid purpose"
}
```

| code | message | 说明 |
| --- | --- | --- |
| 10001 | Invalid purpose | purpose 缺失或不在可选值内 |
| 10002 | Missing zip file | 缺少 zip 文件 |
| 10003 | Invalid content type | 非 multipart/form-data 请求 |
| 10004 | Internal server error | 文件上传或数据写入失败 |

**调用示例**：

```js
const form = new FormData()
form.append('purpose', 'curriculum')
form.append('zip', zipFile) // File / Blob

const {code} = await fetch('/fio/tool/upfileZip', {
  method: 'POST',
  body: form,
}).then((r) => r.json())
// code === 0 表示成功
```

### getFeedbackForAi

查询存在反馈的题目：通过 `scope` 参数获取 `LO/A` 或 `P/C` 两种情况下的数据（对应内容块 `status === 3`），不传时默认 `loa`。

返回结构参考反馈导入 JSON（可直接配合 `upfileZip` 的 `purpose=feedback` 使用），并根据 `scope` 只返回对应内容块的反馈标签、补充反馈原因和状态，便于 AI 修正题目。

```js
// feathers 服务调用
const rs = await App.service('questions').get('feedbackForAi', {
  query: {
    // 可选：默认 loa，仅返回 LO/A 反馈；scope=pc 仅返回 P/C 反馈
    scope: 'loa', // 'loa' | 'pc'，默认 loa
    // scope: 'pc',

    // 可选：透传任意 questions 过滤条件，如 curriculum/subject/grade/topic/standard 等
    'cpa.curriculum': 'au',
    'cpa.subject': '695dfd4d0a1fc83c747b4e80',
    'cpa.grade': 'Year 2',

    // 可选：分页、排序、字段选择
    $limit: 100,
    $skip: 0,
    $sort: {updatedAt: -1},
    $select: ['_id', 'cpa', 'bloom', 'abstract', 'pictorial', 'concrete'],
  },
})

// HTTP 调用（前缀 https://test.classcipe.com/fio）
// 默认 LO/A：GET https://test.classcipe.com/fio/questions/feedbackForAi
// 仅 LO/A：  GET https://test.classcipe.com/fio/questions/feedbackForAi?scope=loa
// 仅 P/C：   GET https://test.classcipe.com/fio/questions/feedbackForAi?scope=pc
// GET https://test.classcipe.com/fio/questions/feedbackForAi?scope=loa&cpa.curriculum=au&cpa.subject=<subjectId>&$limit=100
```

**scope 参数**：

| scope | 说明 | 返回的 feedback 分组 |
| --- | --- | --- |
| `loa` / 不传 | 仅返回 `cpa.status === 3` 或 `abstract.status === 3` 的题目 | `LO` / `A` |
| `pc` | 仅返回 `pictorial.status === 3` 或 `concrete.status === 3` 的题目 | `P` / `C` |

**返回示例**（数组）：

```json
[
  {
    "year_group": "Year 3",
    "curriculum": "Victorian",
    "subject": "Math",
    "topic": "Number",
    "content": "add and subtract two- and three-digit numbers...\nVC2M3N04",
    "elaboration": "choosing between standard and non-standard place value partitions...",
    "standard": "Students extend and use single-digit addition and related subtraction facts...",
    "bloom": [
      {
        "learning_outcome": "Students will be able to identify three-digit parts using blocks.",
        "learning_outcome_generate_reason": "At Year 3, recalling and identifying basic place value components...",
        "bloom_dimension": "Remembering",
        "problem_A": "State the hundreds, tens, and ones parts of 485.",
        "answer": "4 hundreds, 8 tens, and 5 ones (or 400, 80, 5).",
        "problem_P_function": "A visual part-whole cherry model displaying the number 485...",
        "problem_P_playscript": "Look at the model. Name the missing numbers for 485.",
        "problem_C_function": "An interactive industrial bakery simulator...",
        "problem_C_playscript": "Look at the bakery inventory. State the number of pallets, boxes, and bags for 485kg."
      }
    ],
    "feedback": {
      "LO": {"status": 3, "feedback": ["Off-Bloom"], "additionalFeedback": "Learning outcome 与 Bloom 层级不一致"},
      "A": {"status": 2, "feedback": [], "additionalFeedback": ""}
    },
    "_id": {"$oid": "6a55b7be990628f268dd9cfa"}
  }
]
```

**字段说明**：

| 字段 | 说明 |
| --- | --- |
| `year_group` | `cpa.grade` |
| `curriculum` | `cpa.curriculumName`，缺失时回退 `cpa.curriculum` |
| `subject` | `cpa.subjectName`，缺失时回退 `cpa.subject` |
| `topic` / `content` / `elaboration` | 按 `cpa.topic` 在 `subjects.snapshot.topic` 树中的路径解析 |
| `standard` | 按 `cpa.standard` 在 `subjects.snapshot.standard` 树中解析出的名称 |
| `bloom` | 题目当前的 Bloom 数据，字段名与反馈导入 JSON 一致 |
| `feedback` | 按 `scope` 返回对应内容块的反馈：`loa` 返回 `LO/A`，`pc` 返回 `P/C` |
| `feedback.<LO/A/P/C>.status` | 对应内容块的状态，对应 `cpa/abstract/pictorial/concrete.status` |
| `feedback.<LO/A/P/C>.feedback` | 反馈标签数组，对应 `cpa/abstract/pictorial/concrete.feedback` |
| `feedback.<LO/A/P/C>.additionalFeedback` | 补充反馈原因，对应 `cpa/abstract/pictorial/concrete.additionalFeedback` |
| `_id` | 以 `{"$oid": "<id>"}` 形式返回，可直接作为反馈导入 JSON 的题目 ID |

### getPubList（subjects）

获取系统已发布的公共学科列表（目前仅返回 `Math`、`Science`），供 AI 选择 `cpa.subject` 时使用。**无需 JWT 认证**，无请求参数。

接口固定过滤条件：

- `uid = '1'`：系统公共数据
- `del = false`：未删除
- `publish` 数组非空：已发布
- `subtitle` 存在且非空
- `name` 属于 `['Math', 'Science']`

结果按 `curriculum` → `name` → `subtitle` 升序排列，仅返回 `_id`、`name`、`subtitle`、`curriculum` 四个字段。

```js
// feathers 服务调用（无需登录）
const rs = await App.service('subjects').get('pubList')

// HTTP 调用（前缀 https://test.classcipe.com/fio）
// GET https://test.classcipe.com/fio/subjects/pubList
```

**返回示例**（数组）：

```json
[
  {
    "_id": "695dfd4d0a1fc83c747b4e80",
    "name": "Math",
    "subtitle": "Mathematics F-6",
    "curriculum": ["au"]
  },
  {
    "_id": "695dfd4d0a1fc83c747b4e81",
    "name": "Science",
    "subtitle": "Science F-6",
    "curriculum": ["au"]
  }
]
```

**字段说明**：

| 字段 | 说明 |
| --- | --- |
| `_id` | 学科 id，即 questions 中的 `cpa.subject` |
| `name` | 学科名称，仅 `Math` / `Science` |
| `subtitle` | 学科副标题（具体版本/学段说明） |
| `curriculum` | 所属课程体系代码数组，对应 questions 的 `cpa.curriculum` |

### getOfficialMapping（topic-standard）

按 `subjectId` 返回该学科的**官方 topic ↔ standard 匹配数据**，供 AI 在出题或修正题目时确定 topic 对应的官方 standard 组合。**无需 JWT 认证**。

数据来源于 `topicStandard` 集合（官方匹配；增广数据在 `topicStandardExt`，用户上传数据在 `topicStandardUploaded`，均不在本接口范围）。结果按 `createdAt` 升序返回，每条对应一个 topic 叶子节点，并结合 `subjects.snapshot.topic` / `subjects.snapshot.standard` 树解析为与反馈导入 JSON 对齐的扁平字段。

```js
// feathers 服务调用（无需登录）
const rs = await App.service('topic-standard').get('officialMapping', {
  query: {
    subjectId: '65a0e4a13a7176431c2c84e2', // 必填，subjects._id
  },
})

// HTTP 调用（前缀 https://test.classcipe.com/fio）
// GET https://test.classcipe.com/fio/topic-standard/officialMapping?subjectId=65a0e4a13a7176431c2c84e2
```

**请求参数**：

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `subjectId` | 是 | `subjects._id`，缺失时抛 `BadRequest: subjectId is required` |

**返回示例**（数组，topic 为 3 层时）：

```json
[
  {
    "year_group": "Year 2",
    "curriculum": "AU curriculum",
    "subject": "Victorian F-6 V2",
    "topic": "Number",
    "content": "recognise, represent and order numbers to at least 1000 using physical and virtual materials, numerals and number lines\nVC2M2N01",
    "elaboration": "recognising missing numbers on different number lines, for example, a number line with 1800 on one end and 2200 on the other, with every decade numbered",
    "standard": [
      "By the end of Level 2, students order and represent numbers to at least 1000; apply knowledge of place value to partition, rearrange and rename two- and three-digit numbers in terms of their parts; and regroup partitioned numbers to assist in calculations."
    ]
  }
]
```

当 topic 树为 **4 层**时，额外返回 `strand`（第 2 层节点名称），`content` 取第 3 层：

```json
{
  "year_group": "Grade 9",
  "curriculum": "IGCSE",
  "subject": "Business Studies 0450",
  "topic": "1 Understanding business activity",
  "strand": "1.1 Business activity",
  "content": "1.1.1 The purpose and nature of business activity:",
  "elaboration": "Concepts of needs, wants, scarcity and opportunity cost",
  "standard": ["..."]
}
```

**字段说明**（按 topic 树路径层级解析）：

| 字段 | 说明 |
| --- | --- |
| `year_group` | topic 叶子节点的 `grade`，数组时以 `, ` 拼接 |
| `curriculum` | 大纲名称，按 `subjects.curriculum` 代码在 `curriculum` 集合解析 `code → name`（与 questions 的 `cpa.curriculumName` 同源，如 `au` → `AU curriculum`、`nz` → `NZ National`）；查不到时回退代码本身 |
| `subject` | `subjects.subtitle`（如 `Victorian F-6 V2`），为空时回退 `subjects.name` |
| `topic` | 第 1 层（索引 0，根节点）名称 |
| `strand` | 仅 topic 为 4 层时返回，取第 2 层（索引 1）节点名称（带 `code` 时追加 `\n` + code） |
| `content` | 叶子的上一层节点名称（3 层取 L2、4 层取 L3），带 `code` 时追加 `\n` + code；topic 仅 2 层时无该层级，返回空字符串 |
| `elaboration` | 叶子（最后一层）节点名称，缺失时回退匹配记录的 `topicName` |
| `standard` | 该 topic 匹配的官方 standard 名称**数组**，顺序与 mapping 表一致；名称缺失时用 `subjects.snapshot.standard` 树解析，再缺失回退 standard id |

各深度的层级对应关系：

| topic 深度 | `topic` | `strand` | `content` | `elaboration` |
| --- | --- | --- | --- | --- |
| 2 层 | L1 | — | 空 | L2 |
| 3 层 | L1 | — | L2 | L3 |
| 4 层 | L1 | L2 | L3 | L4 |


