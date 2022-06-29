### 课件课堂数据

| 项目 | 数据库-old | 数据库-new | 表单端 | 课堂端 | 插件端 |
| -- | -- | -- | -- | -- | -- |
| task-信息 | 表单储存 |  | Y | / | / | / |
| task-PPT图片快照 | 课堂.slide_page_thumbnails | 课堂.slides | / | / | Y |
| task-materials | 课堂.elements  | 课堂.materials | / | / | Y |
| task-互动题 | 课堂.items | 课堂.questions | / | / | Y |
| task-互动题-大纲 | 课堂.elements | 课堂.questions | / | / | Y |
| task-tips | 课堂.elements | 课堂.tips | / | / | Y |
| -- | -- | -- | -- | -- | -- |
| session-task信息 | 课堂.class |  | / | Y | / |
| session-PPT图片快照 | 课堂.slide_page_thumbnails  | 课堂.slides | / | Y | / |
| session-互动题 | 课堂.his_items  | 课堂.slides>questions | / | Y | / |
| session-materials | 课堂.his-elements | 课堂.slides>materials | / | Y | / |
| session-tips | 课堂.his-elements | 课堂.slides>tips | / | Y | / |