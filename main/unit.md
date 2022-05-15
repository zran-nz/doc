### Unit Plan

| 名称\关系 | UnitPlan | Task | Session | AssessmentTool | Video |
| :---  | :---  | :--  | :--: | :--: | :--: |
| UnitPlan | db | link | / | / | / | / |
| Task | link | db | snapshot | link | link |
| Session | / | snapshot | db | db | link |
| AssessmentTool | / | link | db | db | / |
| Video | / | link | link | / | S3 |



| 功能\名称 | 免费老师 | 收费老师 | 学校老师 | 班主任 | 学科组长 | 学校管理员 | 备注 |
| :---  | :---  | :--  | :--: | :--: | :--: | :--: | :--: |
| 存储空间 | 1G | 5G | 1000G | 1000G | 1000G | 1000G | 按学生计算出对应容量，可以额外增加 |
| 公开课堂 | Y | Y | Y | Y | Y | Y |
| 班级课堂 | / | Y | Y | Y | Y | Y |
| 学生附件 | / | 100Mb | 200Mb | | | | comment, mdeia题型下音视频图片附件大小 |
| 班级管理 | / | 10个 | 不限 | 不限 | 不限 | 不限 |
| 课堂数据保留 | 7天 | 3个月 | 1年 | 1年 | 1年 | 1年 |
| 课堂评估 | / | Y | Y | Y | Y | Y |
| Feedback | / | Y | Y | Y | Y | Y |
| LockScreen | / | Y | Y | Y | Y | Y |
| 学生管理 | / | 500个 | | | | | 学校身份由收费的时候设置 |
| 学生报告 | / | / | Y | Y | Y | Y |
| 课件下载 | / | / | / | / | / | Y | 数据部分json存储，将所有附件都打包为Zip，可以后期导入 |
| 出勤管理 | / | / | Y | Y | Y | Y |
| 老师管理 | / | / | / | / | / | Y |
| 发布公告 | / | / | / | 发布给该班级<br>关联所有老师 | 发布给自己<br>学科下老师 | 可发布给全校<br>任何老师 |
| Insight权限 | / | / | 只对自己教<br>的Unit做点评 | 只对自己教<br>的Unit做点评 | 该学科下所有<br>Unit做reflection<br>环节点评 | 全校所有<br>Unit做点评 |


> 付费老师、学校空间不够可以升级空间，单独计算费用和账单

### 存储空间计算
- 课件里的所有附件数据需要统计大小，计算在老师的空间上
- 课堂里学生产生的所有附件数据需要统计大小，都计算在开课老师的空间上
- 学校老师之间，共享学校总空间

### PPT原件
```mermaid
flowchart
T[Task] --Edit--> GS(Google slides)
GS --Save to Classcipe--> Tl>保存为图片]
GS --google driver copy to--> To{{公司谷歌driver}}
T --Copy--> Auth[Google Auth]
Auth --google driver copy--> GS2[Google slides]
Auth --Save to Classcipe--> Tl2>保存为图片]

```
```mermaid
flowchart
T[Task] --Edit--> GS(Google slides)
GS --Save to Classcipe--> Tl>保存为图片]
GS --> Cs{{学校老师创建课堂}}
GS --> Pub{{发布}}
Cs --google driver to S3--> To{{PPT格式原件}}
Pub --google driver to S3--> To{{PPT格式原件}}
T --Copy--> Auth[Google Auth]
Auth --s3 upload to google driver--> GS2[Google slides]
Auth --Save to Classcipe--> Tl2>保存为图片]

```

### session保存
```mermaid
flowchart
T[Task] --Edit--> Te(课件编辑)
T[Task] --create--> Ss(Session + PPT快照)
Ss --Edit--> Te
Te --task进来--> Sv1{保存}
Te --session进来--> Sv2{保存}
Sv1 --不更新--> SsS0[更新Task]
Sv2 --不更新--> SsS0[更新Task]
Sv2 --Session更新--> S2[Session多选列表 当前Session默认选中]
S2 --选择完毕--> SsS1[更新Task 和 已选Session PPT快照 同时清空互动答案]

```

```mermaid
flowchart LR
A[Teacher] --> C{create}
C -->|create| U[Unit Plan]
U -..-|view| Uc>Unit Calendar]
C -->|create| T[Task]
T -.->|link| G[Slide]
C -->|create| As[Assessment Tool]
T -->|link| As
U <-->|link| T
T -.->|import| Cd
U -.->|import| Cd
  subgraph class
    Sc[Class]
    Cd{Calendar}
    S[Session]
    Sc -->|create| Cd
    Cd -->|create| S
  end
```

```mermaid
erDiagram

Unit }o--o{ Task : "many to many"
Task ||--o{ Assessment : "one to many"
Task ||--o{ Session : "one to many"

```