## materials

### materials model
```js
{
  _id: ObjectId, // Doc ObjectId, Automatically generated
  id: String, // slides id
  page: String, // slides.pages._id
  list: [{
    type: String, // iframe, video, audio, image, pdf
    url: String, // url or youtube id
    key: String, // s3 files key
    size: Number, // s3 file size
    desc: String, // youtube title or desc
    ext: Mixed // video: { start, end }
    position: {type: Schema.Types.Mixed}, // position of the material in the
    slideMatrerial: {type: Boolean}, // flag to check the material is inserted from slides or not
    dimensions: {type: Schema.Types.Mixed}, // dimention of added material
    slideWidth: {type: Number}, // slide width
    slideHeight: {type: Number}, // slide height
  }],
}
```

### POST:/materials

```js
// 创建页面和素材
const doc = await App.service("materials").create({
  id: "slides.id",
  page: "slides.pages._id",
  list: [{
    type, url?, key?, size, desc, ext
  }, ...]
});
```

### PATCH:/materials
```js
// 向已经存在页面中添加素材
const doc = await App.service("materials").patch(doc._id, {
  $addToSet: {list: {
    type, url, key, size, desc, ext
  }}
});
```

### Addon -> save to classcipe Logic
- code in [api3](https://github.com/zran-nz/api3), file in routes/slide.js
- use `slides.presentations.get` download google slides
- parse materials data from each slides page
- delete all old materials documents via slides.id use `mongoMaterials.deleteMany({id: slides.id})`
- Insert new materials on each all page. use `mongoMaterials.insertOne({id: slides.id, page, list: [...]})`
