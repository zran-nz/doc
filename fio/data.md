
### 获取系统公共学科大纲数据
/fio/data/academic/1
### 获取用户的大纲数据 (curric, grades, skills, tags, subjects)
/fio/data/academic/:uid


### 获取session列表
- 昨天的
  - /fio/data/session
- 指定日期范围
  - /fio/data/session?start=2026-01-01&end=2026-01-10

### 获取session所有关联数据 (rooms, response, comments, journals, session-snapshot, session-takeaway, session-takeaway-snapshot)
/fio/data/session/:_id

- session 文档：
  - https://github.com/zran-nz/doc/blob/master/fio/session.md
  - https://github.com/zran-nz/doc/blob/master/fio/rooms.md

- takeaway 相关文档： https://github.com/zran-nz/doc/blob/master/fio/session-takeaway.md

- academic 相关文档：
  - subjects：https://github.com/zran-nz/doc/blob/master/fio/academic.md#subjects-model
  - skills: https://github.com/zran-nz/doc/blob/master/fio/academic.md#skills-model
  - tags: https://github.com/zran-nz/doc/blob/master/fio/academic.md#tags-model