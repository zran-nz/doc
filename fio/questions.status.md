# Question 状态说明

## 模块缩写

| 缩写 | 字段 | 含义 |
| --- | --- | --- |
| LO | `cpa` | Learning Outcome |
| A | `abstract` | Abstract |
| P | `pictorial` | Pictorial |
| C | `concrete` | Concrete |

## status 值定义

| 值 | 状态 | 说明 |
| --- | --- | --- |
| 0 | Processing | 处理中 |
| 1 | Draft | 草稿 |
| 2 | Approved | 已审核通过 |
| 3 | Not Approved | 审核未通过 |
| 4 | Draft Updated / Re-Check | 草稿已更新，待重新审核 |

## 状态选项（过滤 / 显示）

| 状态选项 | 条件 |
| --- | --- |
| Draft | LO/A 任意一个为 1 |
| Draft Updated | LO/A 任意一个为 4 |
| Draft Approved | LO/A 均为 2，且 P/C 均只能为 0 或 1 |
| Approved | LO/A/P/C 均为 2 |
| Not Approved | LO/A/P/C 任意一个为 3 |
| Re-Check | LO/A 均为 2，且 P/C 任意一个为 4 |

## 上传更新处理

| 模块 | 来源文件 | 当前状态 | 更新后状态 |
| --- | --- | --- | --- |
| LO/A | `TestTopicStandard.vue` | 1 | 1（不变） |
| LO/A | `TestTopicStandard.vue` | 3 | 4 |
| P/C | `TestCpaHtml.vue` | 0 | 1 |
| P/C | `TestCpaHtml.vue` | 1 | 1（不变） |
| P/C | `TestCpaHtml.vue` | 3 | 4 |

## `before.patch` 关联处理

| 人工审核操作 | 关联状态更新 |
| --- | --- |
| LO 状态变为 3 | 将 A、P、C 的状态更新为 0 |
| A 状态变为 3 | 将 P、C 的状态更新为 0 |
