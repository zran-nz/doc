### 学生答案

> 接口: GET /fio/response/list?session_id=&student_uid=

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
