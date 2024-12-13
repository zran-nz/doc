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
questionsTypes: ['text', 'choice', 'comment', 'draw', 'media', 'website', 'matching', 'filling', 'graph', 'video'],
templateTab: ['Teaching scenario', 'Interview for enrolment(Students)', 'Interview for thesis defense', 'Interview for enrolment(Teachers)'],
// templateCategory: ['Beginning of the session', 'During the session', 'End of the session', 'General purpose'], 改为前端定义
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
  uid: {type: String}, // user id
  id: {type: String, required: true, trim: true}, // slides id or video.id
  page: {type: String, required: true, trim: true}, // page id or video.time HH:mm:ss
  type: {type: String, trim: true, enum: Agl.questionsTypes}, // type:
  multi: {type: Boolean, default: false}, // text/choice multi
  bloom: {type: Number}, // [Evaluate, Analyze, Apply, Understand, Remember, Create]
  dimension: {type: Number}, // [Factual, Conceptual, Procedural, Megacognitave]
  verb: [{type: String}], // command verb
  tags: [{type: String}], // knowledge tags
  tips: {type: String, trim: true},
  data: {type: String, trim: true}, // url or video question desc
  score: { // score config
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
}
```

#### questions outline example
```js
// 大纲数据例子
outlines.outline: [{
  "code": "au:668910baca15935009e0a126",
  "curr": "AU",
  "name": "Math",
  "child": [{
    "_id": "6524cebc443ec5abf20606c3",
    "name": "Nature of Science",
    "enable": true,
    "score": 8,
    "readonly": true,
    "child": [{
      "_id": "6524cebc443ec5abf20606c4",
      "name": "Understanding about science",
      "enable": true,
      "score": 8,
      "readonly": true,
      "child": [{
        "_id": "6524cebc443ec5abf20606c5",
        "name": "Appreciate that science is a way of explaining the world and that science knowledge changes over time.",
        "enable": true,
        "score": 3,
        "readonly": false,
        "child": [],
        criteria: [{
          _id: {type: String, required: true}, // criteria.standard._id
          code: {type: String, required: true, maxLength: 4}, // 缩略词
          name: {type: String, required: true}, // 名称
          desc: {type: String, required: true}, // 描述
          weight: {type: Number}, // 权重
          point: {type: Number},
        }, ...]
      }, {
        "_id": "6524cebc443ec5abf20606c6",
        "name": "Identify ways in which scientists work together and provide evidence to support their ideas.",
        "enable": true,
        "readonly": false,
        "score": 5,
        "child": []
      }]
    }]
  }]
}]
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
tab: {type: String, required: true, enum: Agl.templateTab}, // Tab
category: {type: String, required: true}, // 分类，改为前端定义
default: {type: Boolean, default: false}, // 每个tab下可以设置为默认值 https://github.com/zran-nz/bug/issues/5560
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

### 谷歌幻灯片相关接口, 需要谷歌 ppt 权限逻辑

```js
// 创建ppt
App.service("slides").get("createSlide", { query: { task, name, sid } });
// 下载ppt原件
App.service("slides").get("slideToS3", { query: { id, uid, google } });
// 同步ppt
App.service("slides").get("syncSlide", { query: { id, taskId, google } });
// 复制课件
App.service("unit").patch("copy", { _id, orderId, name, isLink });
// 发布课件
App.service("unit").patch("publish", { _id });
// 排课
App.service("session").create({...});
// 拉新课程
App.service("session").get('pull', {_id});
```
