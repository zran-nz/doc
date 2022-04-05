### 学校 UML

```mermaid
erDiagram

Task {
  String id PK
  String name "task name"
  String presentationId "ppt id"
  String revisionId "ppt version"
  int status "发布状态"
  String copyFromSlide "原ppt"
  Boolean fileDeleted "ppt原件删除"
  
}
Task ||--|{TaskClass : "bind school class"
Task ||--|{Class : "start a new session"
TaskClass{
 String id PK
  String taskId "taskId id"
  String classId FK "class id"
  Date startDate "schedule start date"
  Date endDate "schedule end date"
  int classType "班级类型"
}
TaskClass ||--||SchoolClass : "ref"
TaskClass ||--||PersonalClass : "ref"
PersonalClass{
  String id PK
  String userId FK "User.id"
  String name "班级名称"
  Date startDate "schedule start date"
  Date endDate "schedule end date"
  int classType "班级类型"
}
SchoolClass{
   String id PK
   String name "班级名称"
   String schoolId FK "School.id"
   String gradeId "年级ID"
   String headTeacherId "班主任ID"
   String subject "学科"
   int classType "学校ID"
}

Class{
  String id PK
  String classId "class id"
  String date "开课时间"
  String sessionName "课程名"
  String className "班级名"
  String slideId "ppt id"
  String taskClassId "课程班级id"
  String taskClassType "班级类型"
  String revisionId "课程版本"
}

Class ||--||SlideRevisionId : "关联ppt和版本"
Class ||--|{SlidePageThumbnails : "关联ppt图片"
Class ||--|{HisElements : "关联ppt elements"
Class ||--|{HisItems : "关联ppt items"
SlideRevisionId{
	String slideId "ppt id"
 	String revisionId "ppt 版本"
}

SlidePageThumbnails{
	String id PK
	String presentationId "ppt id"
	String pageId "ppt page id"
 	String revisionId "ppt 版本"
 	String fileName "图片地址"
}
HisElements{
  String id PK
  Integer elementsId "原elements id"
  String classId FK "Class.id"
  String slideId "ppt id"
  String pageId "ppt page id"
}

HisItems{
  String id PK
  String classId FK "Class.id"
  String itemsId "原item id"
  String slideId "ppt id"
  String pageId "ppt page id"
}


```
