### session

> 只要课件安排过考试作业，就标记为适合自学习
> 发布的时候自动勾选为自学习课件

| 名称 | Upcoming<br>(未开始)  | Ongoing<br>(进行中) | Expired<br>(过期)  | Ending<br>(结束) |
| :---  | :---  | :--  | :--: | :--: |
| 学生课堂端 | × | √ | × | × |
| 老师课堂端 | √ | √ | √ | √ |

```mermaid
flowchart TB
U[UnitPlan]
S[Session课堂]
St[学生点名册]
Sa[出勤记录]
CdU>教学计划表\nX:当前学期日视图 Y:UnitPlan\n类似甘特图]
CdS>课程日历表\nX:周视图 Y:小时列表\n课堂时间排版]
CdAt>出勤日历表\nX:周视图 Y:学生列表\n出勤统计列表]

U --聚合统计\n班级下所有老师的\nUnitPlan列表--> CdU
S --> Sa
S --聚合统计\n班级下所有老师的课程列表--> CdS
St --> Sa
Sa --聚合统计\n每个学生出勤次数\n按周,月,年--> CdAt

```

```mermaid
flowchart TB
subgraph class1
  T1[老师A] --- S1[课堂1]
end
subgraph class2
T2[老师B] --- S2[课堂2]
end

S1 -.-|邀请老师B| R{关联课堂}
S2 -.-|-| R
style R fill:#bbf,stroke:#f66,stroke-width:2px,color:#fff,stroke-dasharray: 5 5

R --> Stu[两个班级的学生列表\n一起上课]
```

> 班级出勤表  
按周、月、年统计  
Overall Presence 87.15%,  
1 student with perfect attendance,  
8 student with more than 90% presence,  
10 student with less than 90% presence

| Students | Present | Absent | Late | Presence (in %) |
| :--  | :-- | :-- | :-- | :--: |
| Anaisha | 49 | 7 | 0 | 87.5 |
| Arham | 53 | 4 | 0 | 93 |
| Jack | 50 | 4 | 3 | 93 |

```mermaid
gantt
    title 班级教学计划表
    dateFormat  YYYY-MM-DD
    section Teacher
    UnitPlan1      :a1, 2022-03-01, 20d
    UnitPlan2      :after a1, 30d
    section Tom
    UnitPlan3   :2022-03-06, 22d
    UnitPlan4      : 14d
    UnitPlan5   :2022-03-16, 22d
    section Jack
    Unit Math Plan      :2022-03-02, 22d
    Unit Math2 Plan      : 14d
```

```mermaid
erDiagram

school }o--o{ user : "many to many"

```