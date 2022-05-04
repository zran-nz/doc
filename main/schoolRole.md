## 学校权限管理

### Session删除
- 未开始的Session
  - 老师可以直接删除
- 已经开始的Session
  - 老师不允许删除，有权限的才能删除

### 课件删除
- 发布的课件
  - 强制删除提示，询问删除同时会下架课件
- 创建过Session的课件
  - 未开始的Session，强制删除提示，询问删除同时会删除相关所有的Session
  - 已经开始的Session，无权限不允许删除
- 默认课件，直接删除


```mermaid
flowchart
S[PPT原件] --> T2
S[PPT原件] --> T
T2[Task个人] --import--> T[Task学校]
T2 --> D2>只删除个人下的数据\n不影响学校下的数据]
T --> D>只删除学校下的数据\n不影响个人下的数据]
```

```mermaid
flowchart
S[GoogleSlide] --> T
T[Task学校] --> Ts(Session)
Ts --download to S3--> Td(PPT原件)
Td --auto publish--> Lib(School Library)
Lib --> Tc(Task Copy)
Ts --> Ts0([未开始])
Ts --> Ts1([已开始])
class Ts1 bgwarn
class Ts bgwarn
class T bgwarn
```

```mermaid
flowchart
S[Google slide] --> T
T[Task个人] --> Ts(Session)
T --download to S3--> Td(PPT原件)
Td --publish--> Lib(Library)
Td --unPublish--> Tdd(删除PPT原件)
Lib --> Tc(Task Copy)
Tc --S3 to Google Driver--> TcG(Google slide)
Ts --> Ts0([未开始])
Ts --> Ts1([已开始])
class Ts1 bgwarn
class Ts bgwarn
class T bgwarn
```

|  | Slide快照图片 | PPT原件 | 学生互动数据 | 合计 |
| :---  | :---  | :--  | :--: | :--: |
| Task | 1Mb | 2Mb | | 3Mb |
| Task Session | 1Mb | / | 100Mb | 101Mb |
| Task Copy | 1Mb | 2Mb | | 3Mb |
| Task Copy Session | 1Mb | / | 50Mb | 51Mb |
