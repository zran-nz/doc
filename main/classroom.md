### 学生答案

> 接口: GET /fio/response/list?sid=&student_uid=
- 请求参数
- sid: session id
- student_uid: 学生 uid

### 课堂空间占用统计

> 接口: GET /fio/response/space?sid=
- 请求参数
- sid: session id

- 接口返回
- { sid: '', size: 1000 }


### 通知复制PPT

> 接口: GET /fio/slides/copy?id=&rev=&id2=&rev2=
- 请求参数
- id: new slide id
- rev: new revision_id
- id2: old slide id
- rev2: old revision_id


### 通知更新PPT快照

> 接口: POST /fio/slides

```json
{
  "id": "slide id",
  "rev": "revision_id",
  "pages": [{
    "_id": "page_id",
    "url": "ppt snapshot url"
  }, {
    "_id": "page_id",
    "url": "ppt snapshot url"
  }, ...]
}
```

```curl
curl -H "Content-Type: application/json" -H "Authorization: <your access token>" -X POST -d '{"id": "test","rev":"123","pages":[{"_id":"456","url":"https://dev.tget.top/v2/src/assets/img/logo2.png"}]}' https://dev.classcipe.com/fio/slides
```

### 获取PPT大纲与标签

> 接口: GET /fio/
