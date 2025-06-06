
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