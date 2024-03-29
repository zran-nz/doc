## Poster

### Poster model

```js
{
  image: {type: String, trim: true}, //海报
  imageCover: {type: String, trim: true}, //海报前景图
  content: {type: String}, //文案
  type: {type: String, default: 'image', enum: ['image', 'text']}, //类型
  style: {type: String, default: 'educator', enum: ['educator', 'non_educator']}, //板块
  customize: {type: Boolean, default: false}, //海报是否自定义
}
```

### Poster api

```js
// 海报创建
await App.service('poster').create({
    image: 'url',
    imageCover: 'url',
    type: 'image',
    style: 'educator',
});
// 文案创建
await App.service('poster').create({
    content: '文案内容',
    type: 'text',
    style: 'educator',
});

// 海报列表
await App.service('poster').find({ type: 'image' });
// 文案列表
await App.service('poster').find({ type: 'text' });

// 获取合并海报,url不传则不生成二维码
await App.service('poster').get('mergeImage', { query: { image: 'url', imageCover: 'url', url: url } });
```
