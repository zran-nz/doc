## 学校管理


### 老师管理逻辑
<img width="870" alt="a7490ba30657a399f7cf9f172d12fdb" src="https://user-images.githubusercontent.com/1272280/174215231-61eb726a-96a9-4d80-b07f-2a7001678ad6.png">

- 老师加入学校的方法
  - 1、注册账号的时候关联学校（需要审核，来源: 注册关联）
  - 2、管理员后台添加邮箱账户（如果是已经注册的用户，同时发送站内信邀请）
    - 老师点击邮件链接进行加入, 需要判断 登录邮箱与邀请邮箱是否一致
    - 一致则无需审核，自动加入成功
    - 不一致（需要审核，来源: 邮箱邀请）
  - 3、邀请链接加入（需要审核，来源: 链接邀请）

### 学校-记录
> 学校销售跟进记录

| 类型 | 操作人 | 时间 | 内容 | 操作逻辑 | 逻辑备注 |
| :-- | :-- | :-- | :-- | --: | --: |
| Create school | -- | -- | -- | 仅通过后台管理员创建 |
| Quotation | -- | -- | --  | 官网提交 |
| Refer principal | -- | -- | -- | 由用户推荐 |
| 注册关联学校 | -- | -- | --  | 用户注册 |
| 自助付费开通 | -- | -- | -- | 由用户自行操作 |
| 开通试用 | -- | -- | -- | 仅通过后台操作 |
| 试用延期 | -- | -- | -- | 仅通过后台操作 |
| 开通正式 | -- | -- | -- | 仅通过后台操作 |
| 沟通记录 | -- | -- | -- | 仅通过后台操作 |

#### 接口逻辑
- Create school
  - 创建操作日志
    - 类型：Create school
    - 操作人：操作人昵称
    - 内容格式：{nickname} create "{schoolName}"
  - 后台创建学校，名称不重复
- Quotation
  - 创建操作日志
    - 类型：Create school
    - 操作人：{nickname}
    - 内容格式：{nickname} create "{schoolName}"
    - 扩展数据：提交的学校JSON对象
  - 学校存在，则不更新
  - 学校不存在，更新学校的数据
- Refer principal
  - 创建操作日志
    - 类型：Refer principal
    - 操作人：{nickname}
    - 内容格式：{nickname} Refer principal "{schoolName}"
    - 扩展数据：提交的学校JSON对象
  - 学校存在，则不更新
  - 学校不存在，更新学校的数据



```mermaid
graph TD
A[创建学校] --> A1(后台创建)
A --> A2(老师注册时填写)
A --> A3(提交quotation)
A --> A4(refer principal)

  subgraph adminCreated
    direction TB
    A1 --> A1_1[维护学校信息]
    A1 --> A1_2[维护联系人]
    A1 --> A1_3[维护管理员/老师]
  end

  subgraph addPreference
    direction TB
    A2 -->|学校不存在| A2_1[创建学校] 
    A2_1 --> A2_B[关联学校员工]
    A2 -->|学校已存在| A2_B
  end

  subgraph 提交quotation
    direction TB
    A3 -->|学校不存在| A3_1[创建学校] 
    A3_1 --> A3_B[保存quotation信息]
    A3 -->|学校已存在| A3_B
    A3_B -->|提交人自动绑定为学校员工| A3_C[关联学校员工]
    A3_1 --> |管理员审核| A3_D[学校创建成功]
  end
  
  subgraph refer principal
    direction TB
    A4 -->|学校不存在| A4_1[创建学校] 
    A4_1 --> A4_B[保存principal信息]
    A4 -->|学校已存在| A4_B
    A4_B -->|提交人自动绑定为学校员工| A4_C[关联学校员工]
    A4_B -->|principal绑定为学校管理员| A4_C[关联学校员工]
    A4_B -->|发消息通知principal| A4_D[发送邮件/站内信]
    A4_1 --> |管理员审核| A4_E[学校创建成功]
  end
```

### acdemic

```mermaid
graph TD
A[acdemic] --> B(绑定curriculum)
B --> C(绑定subject)
A --> D(年级设置)
C --> E(绑定teach content)
B --> F(上传大纲条)

```


### Year&Term

```mermaid
graph TD
A[Year&Term] --> B(创建Year)
B --> C(创建Term)
C --> |保存/Term最大跨度起止时间作为year的起止时间| D(数据入库)


```
