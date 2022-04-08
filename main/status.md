### session 状态

| 名称 | Upcoming<br>(未开始)  | Ongoing<br>(进行中) | Expired<br>(过期)  | Ending<br>(结束) |
| :---  | :---  | :--  | :--: | :--: |
| 学生课堂端 | × | √ | × | × |
| 老师课堂端 | √ | √ | √ | √ |

```mermaid
erDiagram

school }o--o{ user : "many to many"

```