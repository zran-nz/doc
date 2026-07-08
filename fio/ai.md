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


