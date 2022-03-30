### 班级UML

```mermaid
erDiagram
  class ||--o{ class_members : "has many"
  class {
    string id PK
    string revision_id "slide_id"
    int page "redis.get 'class_id:$class_id:control:go_page'"
    int mode "redis.get 'class_id:$class_id:mode'"
    int response_limit_time "redis.get'class_id:$class_id:user_id:$user_id:time_down'"
    int response_limit_mode
  }
  class_members {
    int id
    string class_id PK Session ID
    string email "邮箱"
    string user_name "？？"
    string nickname "昵称"
    string avatar "头像"
    int role
    date create_time
    string sid
    string block
  }
  class ||--o{ groups : is
  groups {
    int id PK
    int name "组名"
  }
  groups ||--o{ group_members : extend
  class_members ||--|| group_members : join
  group_members {
    int id PK
  }
```
