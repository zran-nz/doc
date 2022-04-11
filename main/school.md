### 学校管理

```mermaid
graph TD
A[学校管理员] --> C{添加员工}
A --> Ac(班级)
A --> Tg(Tags)
A --> P(Planning)
  subgraph invite
    direction TB
    C -->|站内信+邮箱通知| D[注册用户]
    C -->|邮箱通知| E[新用户]
    C -->|链接邀请| E2[登录接受后]
    D -->|同意邀请| Z[成功]
    E -->|注册邮箱==邀请邮箱| Z
    E -->|注册邮箱!=邀请邮箱??| A2{审核}
    E2 --> A2
    A2 -->|通过| Z
    A2 -->|拒绝| Z2[失败]
  end
  subgraph class
    direction TB
    Ac --> Tc[关联老师]
    Ac --> St[导入学生]
  end
```

```mermaid
erDiagram

school }o--o{ user : "many to many"
school ||--o{ invite : "one to many"
user ||--o{ invite : "one to many"
school ||--o{ class : "one to many"
class ||--o{ students : "one to many"

invite {
  int id PK
  string code "邀请码，用于生成邀请地址, 只有状态==0时有效，除非重新邀请"
  string name "用户姓名"
  string uid "用户ID"
  int school_id "学校ID"
  int status "状态, 0:pedding, 1:success, 2:review, 3:reject, 4:resigned"
  string invite_email "邀请邮箱"
  string reg_email "注册邮箱"
}

```