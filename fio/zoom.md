# Zoom


## 技术堆栈
- 详细描述应用程序所使用的所有技术、库和 API。
```text
Front-end UI framework: quasar
Backend technology stack: nodejs, redis, mongodb, mqtt.
nodejs lib：feathers, express, jsonwebtoken, mongodb-core, mongoose, googleapis, google-images, mqtt, socket.io, nodemailer, pdfkit-table, node-fetch.
API: googleapi, cloudflare r2, aws s3.
```
## 架构图
- 尽可能提供带有附加流程图的架构图。这包括与 Zoom 交互的任何服务，例如数据库、服务器和应用程序运行所需的第三方应用程序。

### 后端架构
  ![feathersjs](https://feathersjs-offline.github.io/docs/assets/img/architecture-overview.9713b9f4.svg
 "feathersjs")

### zoom相关流程

- Schedule
```mermaid
graph TD
  Tch((Teacher)) --Making courseware--> C(Course)
  C --> Sch[[Schedule a lesson<br> for the class]]
  Z[Zoom] -.Authorize and enable.-> Sch
  ClaStu[Class Student List] -.Select students.-> Sch
  Sch --Create a zoom meeting by the teacher--> SS(Session)
```

- join class room
```mermaid
graph TD
  SS(Session)
  SS --> Tch
  SS --> Stu
  Tch((Teacher)) --Open class room--> TD(Teacher dashboard)
  TD --Open meeting as host link--> Z[[Zoom meeting]]
  Stu((Student)) --Open class room--> SD(Student dashboard)
  SD --Open meeting link--> Z
```


### 应用程序开发
- 如回答“是”，则需提供相应的证据文件和报告供审核。
全都选否

### 安全
- 您的应用是否使用传输层安全性（TLS）并且仅支持所有网络流量（包括 Zoom 用户的数据）的 TLS 1.2 或更高版本？
是的

- 集成是否利用验证令牌或秘密令牌和 x-zm-signature 标头来确认传入的 Webhook 事件来自 Zoom？
不

- 您的应用程序是否收集、存储、记录或保留 Zoom 用户数据，包括 Zoom OAuth 令牌？
是的
