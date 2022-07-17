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

- 状态翻译：
Applied 申请中
Created 创建
Trial 试用中
School Plan 开通中
Expired 套餐过期

| 类型 | 状态 | 操作人 | 内容 | 操作逻辑 |
| :-- | :-- | :-- | :-- | --: |
| ~~Create school~~ | 创建 | -- | {nickname} create "{schoolName}" | 仅通过后台管理员创建 |
| ~~注册关联学校 <br>User registered~~ | 创建 | -- |  | 用户注册的时候关联学校，<br>记录太多，无需记录 |
| 推荐校长<br>Refer principal | 创建 | -- | Refer principal {firstname lastname}<br> Contact: {code}+{phone}, {email}; | 由用户推荐 |
| 获取报价<br>Quote | 申请中  | -- | Contact: {code}+{phone}, {email};<br>Form {country},{city},{address};<br>For: {School or Group}; Mark: {备注} | 官网提交 |
| 领取学校<br>Claimed | 不更新状态 | -- | Claimed | 仅通过后台操作 |
| 释放学校<br>Released | 不更新状态 | -- | Expired release | 过期未跟进自动释放 |
| 释放学校<br>Released | 不更新状态 | -- | Manually release from {nickname} | 后台人工主动释放 |
| 沟通记录<br>Communicate | 不更新状态 | -- | {沟通内容} | 仅通过后台操作 |
| 开通试用<br>Open trial | 试用中 | -- | Open trial | 仅通过后台操作 |
| 开通正式<br>Fully paid | 开通中 | -- | Successfully paid | 仅通过后台操作 |
| 自助付费开通<br>Self paid | 开通中 | -- | Self-service payment activation | 由用户自行操作 |
| 套餐过期<br>Expired | Expired | -- | Plan Expired  | 计划任务判断是否过期 |

#### 接口逻辑
- ~~Create school~~
  - 创建操作日志
    - 类型：Create school
    - 操作人：操作人昵称
  - 后台创建学校，名称不重复
- Refer principal
  - 创建操作日志
    - 类型：Refer principal
    - 扩展数据：提交的学校JSON对象
  - 学校存在，则不更新
  - 学校不存在，更新学校的数据
- Quote
  - 创建操作日志
    - 类型：Create school
    - 扩展数据：提交的学校JSON对象
  - 学校存在，只更新操作时间
  - 学校不存在，更新学校的数据
- 领取学校 / 沟通记录
  - 创建操作日志
    - 类型：Claimed / Communicate
  - 更新操作时间，释放倒计时重新计算
- 释放学校
  - 创建操作日志
    - 类型：Released
  - 更新操作时间
  - 



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
