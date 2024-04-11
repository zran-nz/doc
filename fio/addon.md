### Addon test

测试地址：https://dev.classcipe.com/v2/test/testAddon/${slideId}

### Addon store

```js
// import store
import { addonStore } from "stores/addon";
const addon = addonStore();

// get outline
await addon.getOutline(unit._id);

// get questions
await addon.getQuestions();
// add question
await addon.addQuestion();
// remove question
await addon.rmQuestion(_id);
// update question
await addon.upQuestion(post, query);

// add material
await addon.addMaterial(pageId, data);
// get material
await addon.getMaterials();
// remove material
await addon.rmMaterial(o, pageId);
// set material
addon.setMaterial();

// switch to page
addon.toPage(pageId);
// copy slide to task
await addon.copy(sid, pages, postData);
```

### addon enum

```js
questionsTypes: ['text', 'choice', 'comment', 'draw', 'media', 'website', 'matching', 'filling', 'graph'],
templateCategory: ['Beginning of the session', 'During the session', 'End of the session', 'General purpose'],
```

### addon api

#### addonFind 插件端获取带有 ppt 的课件列表

```js
await App.service('unit').get('addonFind', { query: { $sort, $skip = 0, $limit = 10 }})
```

### slides model

```js
{
  createdAt: Date, // create time
  updatedAt: Date, // update time
  uid: String, // user id
  task: String, // view_content.id
  id: String, // slides id
  rev: String, // revision
  pages: [{
    _id: String, // page_id
    url: String, // url need download to s3
    outline: [String], // ppt outlines
    assess: [String], // ppt assess
    pic: String, // ppt snapshot s3 hash
    size: Number // pic size
  }],
  hash: String, // pptx file s3 key
}
```

### questions model

```js

{
  createdAt: Date, // create time
  updatedAt: Date, // update time
  uid: String, // user id
  id: String, // slides id
  page: String, // page id
  type: String, // type: ['text', 'choice', 'comment', 'draw', 'media', 'website']
  multi: Boolean, // text/choice multi
  bloom : Number, // const.BloomLabels, [Evaluate, Analyze, Apply, Understand, Remember, Create]
  dimension: Number, // const.KnowledgeLabels, [Factual, Conceptual, Procedural, Megacognitave]
  verb: [String], // command verb
  tags: [String], // knowledge tags
  data?: String, // website url
  options: [{ // options
    val: String,
    on: Boolean, // choice answer
  }],
  score: Number,
  scoreEnable: Boolean,
  tips: String,
  outlines: { //
    outline: [Mixed],
    assess: [Mixed],
    pd: [Mixed],
    skills: [Mixed],
    goal: [Mixed],
  }
  list: [{ // multi questions for new text
    bloom: Number,
    dimension: Number,
    verb: [String], // command verb
    tags: [String], // knowledge tags
  }],
}

```

### materials model

```js
{
  createdAt: Date, // create time
  updatedAt: Date, // update time
  uid: String, // user id
  id: String, // slides id
  page: String, // slides.pages._id
  list: [{
    question: String, // questions._id
    type: String, // iframe, video, audio, image, pdf
    url: String, // url or youtube id
    key: String, // s3 files key
    size: Number, // s3 file size
    desc: String, // youtube title or desc
    ext: Mixed // video: { start, end }
  }],
}
```

### materials api

```js
// 创建页面和素材
const doc = await App.service("materials").create({
  id: "slides.id",
  page: "slides.pages._id",
  list: [{
    question, type, url, key, size, desc, ext
  }, ...]
});

// 向已经存在页面中添加素材
const doc = await App.service("materials").patch(doc._id, {
  $addToSet: {list: {
    question, type, url, key, size, desc, ext
  }}
});
```

### template model

```js
sid: {type: String, required: true, trim: true}, // slides id 谷歌幻灯片id
cover: {type: String, trim: true}, // 幻灯片图片地址
unitName: {type: String, trim: true}, // 课件名称
type: {type: String, required: true, enum: Agl.questionsTypes}, // 互动题类型
category: {type: String, required: true, enum: Agl.templateCategory}, // 分类
```

#### 通过谷歌幻灯片 id 创建模板

```js
// 查询幻灯片数据
const slides = await App.service("slides").get("slides.id");
// 查询课件数据
const unit = await App.service("unit").get("slides.id");
// 查询互动题数据列表
const questions = await App.service("questions").find({
  query: { id: "slides.id" },
});
// 创建模板
const questions = await App.service("template").create({
  id: "slides.id",
  cover: slides.pages[0].pic,
  type: quetions.data.find((v) => v.page === slides.pages[0]._id).type,
  unitName: unit.name,
  category: "$templateCategory",
});
```
