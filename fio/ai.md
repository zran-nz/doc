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

查询存在反馈的题目：`LO(cpa)`、`A(abstract)`、`P(pictorial)`、`C(concrete)` 任意一个 `status === 3` 即返回。可通过 `scope` 参数单独获取 `LO/A` 或 `P/C` 两种情况下的数据，不传时默认 `loa`。

返回结构参考反馈导入 JSON（可直接配合 `upfileZip` 的 `purpose=feedback` 使用），并根据 `scope` 只返回对应内容块的反馈标签、补充反馈原因和状态，便于 AI 修正题目。

```js
// feathers 服务调用
const rs = await App.service('questions').get('feedbackForAi', {
  query: {
    // 可选：默认 loa，仅返回 LO/A 反馈；scope=pc 仅返回 P/C 反馈；scope=all 返回全部
    scope: 'loa', // 'loa' | 'pc' | 'all'，默认 loa
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

// HTTP 调用
// 默认 LO/A：GET /questions/feedbackForAi
// 仅 LO/A：  GET /questions/feedbackForAi?scope=loa
// 仅 P/C：   GET /questions/feedbackForAi?scope=pc
// 全部：     GET /questions/feedbackForAi?scope=all
// GET /questions/feedbackForAi?scope=loa&cpa.curriculum=au&cpa.subject=<subjectId>&$limit=100
```

**scope 参数**：

| scope | 说明 | 返回的 feedback 分组 |
| --- | --- | --- |
| `loa` / 不传 | 仅返回 `cpa.status === 3` 或 `abstract.status === 3` 的题目 | `LO` / `A` |
| `pc` | 仅返回 `pictorial.status === 3` 或 `concrete.status === 3` 的题目 | `P` / `C` |
| `all` | 上述任意一个状态为 3 即返回 | `LO` / `A` / `P` / `C` |

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
| `feedback` | 按 `scope` 返回对应内容块的反馈：`loa` 返回 `LO/A`，`pc` 返回 `P/C`，`all` 返回全部 |
| `feedback.<LO/A/P/C>.status` | 对应内容块的状态，对应 `cpa/abstract/pictorial/concrete.status` |
| `feedback.<LO/A/P/C>.feedback` | 反馈标签数组，对应 `cpa/abstract/pictorial/concrete.feedback` |
| `feedback.<LO/A/P/C>.additionalFeedback` | 补充反馈原因，对应 `cpa/abstract/pictorial/concrete.additionalFeedback` |
| `_id` | 以 `{"$oid": "<id>"}` 形式返回，可直接作为反馈导入 JSON 的题目 ID |


