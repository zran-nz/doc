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
  page: String, // page id
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
