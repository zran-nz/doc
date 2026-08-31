# 客服会话与消息收发逻辑


## 离线消息通知规划（草案）

### 背景与现状

- **客服 → 客户**：`chat.create` / `aiReply` 中已有 `wabaOut`：客户离线（`online(uid)=false`）时把回复发回 WhatsApp。
  - 24h 窗口内：走自由文本，逐条发实际内容。
  - 24h 窗口外：走 Utility 事务模板，**只发提醒通知（如「客服给您发了新消息，点击查看」），不携带实际消息内容**，客户需点链接打开页面才能查看。
  - 频率/次数限制：避免被 WhatsApp 判定为骚扰拉黑。建议每客户每会话每天最多 N 次（如 3 次），两次提醒间隔 ≥ X 小时（如 2h）；超限仅记日志，不再发送。
- **客户 → 客服**：客户消息经 `wabaIn` / `chat.create` 落库后，仅靠网页红点+未读提醒；客服离线时**无任何主动通知**，可能漏看新消息。

> 离线判定复用 `chat-list.online(uid)`；服务时间复用 `inServiceHours`；定时调度挂在每分钟 `cron1`。


### 离线通知流程图 — 客户侧（WhatsApp）

```mermaid
flowchart TD
    Start[客服/AI 发消息给客户] --> C1[检测 online uid]
    C1 -- 在线 --> C2[跳过, 网页已收到]
    C1 -- 离线 --> C3{在 24h 窗口内?}
    C3 -- 否 --> Freq{未达频率上限? 每会话每天≤3次 间隔≥2h}
    Freq -- 否 --> Skip[跳过, 防骚扰拉黑 仅记日志]
    Freq -- 是 --> C4[Utility 事务模板发提醒 不带实际内容 附网页链接]
    C3 -- 是 --> C5[wabaOut 逐条发自由文本 实际内容]
    C4 --> End[结束]
    C5 --> End
    Skip --> End
```

### 离线通知流程图 — 客服侧（邮件）

```mermaid
flowchart TD
    Start[客户发消息给客服] --> S1[检测 online staff]
    S1 -- 在线 --> S2[跳过, 网页已收到]
    S1 -- 离线 --> S3{在服务时间内?}
    S3 -- 是 --> S4{该会话今日已通知?}
    S4 -- 否 --> S5[首条: 立即发邮件]
    S4 -- 是 --> S6{距上次摘要 ≥15min 且 未达日上限20封?}
    S6 -- 是 --> S7[聚合摘要发邮件]
    S6 -- 否 --> S8[攒着, 等下一轮]
    S3 -- 否 --> S9[缓存, 等下个服务时段发早报]
    S5 --> End[结束]
    S7 --> End
    S8 --> End
    S9 --> End
```

### 4. 待确认点

1. `email` 服务是否已注册？是否已有邮件模板？
2. 客服邮箱取自 `users.email` 还是 `StaffSetting.notifyEmail`？
3. 聚合窗口（15min？）与每日上限（20 封？）的具体数值。
4. 非服务时间「早报」机制是否需要。
5. Utility 事务模板用哪个 `contentSid`？是否已在 `WHATSAPP_TEMPLATES` 注册？（现有 `user_account_routing_utility` 是已注册的 Utility 模板）
6. 窗口外 Utility 提醒的频率上限具体数值（每天 3 次、间隔 2h 是否合适）？



## 流程图（Mermaid）

### 1. WhatsApp 客户消息入站

```mermaid
flowchart TD
    A[Twilio Webhook] --> B[/waba-reply/]
    B --> C{是 /dev 命令?}
    C -- 是 --> D[处理环境切换 on/off/status]
    C -- 否 --> E{env=dev 且本机=生产?}
    E -- 是 --> F[转发到 WABA_DEV_ORIGIN]
    F -- 失败 --> G[降级 prod 本机处理]
    F -- 成功 --> H[返回 TwiML]
    E -- 否 --> I{客户已注册 cid?}
    I -- 否 --> J[注册/跳转模板流程]
    J --> H
    I -- 是 --> K{命中 END_TRIGGERS?}
    K -- 是 --> L[wabaEnd 结束会话] --> H
    K -- 否 --> M{命中咨询类型 且未在会话?}
    M -- 是 --> N[wabaStart type] --> H
    M -- 否 --> O{命中 human 或已在会话?}
    O -- 是 --> P[wabaIn 落库] --> H
    O -- 否 --> J
```

### 2. 网页端发送 / WhatsApp 出站

```mermaid
flowchart TD
    A[网页 chat.create] --> B[checkMember 成员校验]
    B --> C[super.create 落库 + emit created]
    C --> D[chatList.touch 更新摘要/未读 + emit patched]
    D --> E{发送方是客服?}
    E -- 否 --> F[仅返回消息]
    E -- 是 --> G[wabaOut]
    G --> H{是 WhatsApp 会话?}
    H -- 否 --> F
    H -- 是 --> I{在 24h 窗口内?}
    I -- 否 --> F
    I -- 是 --> J{客户正开着网页?}
    J -- 是 --> F
    J -- 否 --> K[wabaText 译成客户语言]
    K --> L[waba.sendTextMessage 发回 WhatsApp]
    L --> F
```

### 3. AI 托管与自动关闭（每分钟 cron1）

```mermaid
flowchart TD
    A[cron1 每分钟] --> B[aiReply]
    B --> C[查 lastUid=uid 且 5min~1h 未回复的进行中会话]
    C --> D{客服开了 AI 托管?}
    D -- 否 --> E[跳过]
    D -- 是 --> F[aiReplyText 取最近 10 条 + AI 生成]
    F --> G[addMsg AI_UID, side=staff, keepUnread=true]
    G --> H[wabaOut 发回 WhatsApp 客户]
    A --> I[autoClose]
    I --> J[查超 1h 无沟通的进行中会话]
    J --> K{最后一条是真人客服?}
    K -- 否 --> L[保持进行中]
    K -- 是 --> M[置 active=false + emit patched]
    M --> N{是 WhatsApp 会话?}
    N -- 是 --> O[wabaOut 超时结束提示]
    N -- 否 --> P[结束]
```

### 4. 会话生命周期

```mermaid
stateDiagram-v2
    [*] --> 创建: chat-list.create\npickStaff 自动分配
    创建 --> 进行中: active=true
    进行中 --> 已结束: patchClose sys手动\nwabaEnd 客户endchat\nautoClose 超1h
    已结束 --> 进行中: patchReopen 重开\n刷新 lastAt
    进行中 --> [*]: remove sys删除
    已结束 --> [*]: remove sys删除

    note right of 进行中
        - 客户消息: wabaIn / chat.create
        - 客服回复: chat.create → wabaOut
        - AI 代回: aiReply (5min)
        - 24h 窗口: wabaAt 计时
    end note
```

### 5. 客服分配优先级

```mermaid
flowchart TD
    A[pickStaff type, uid] --> B[按类型定角色]
    B --> C{type?}
    C -- sale/fee --> D[campus_partner]
    C -- support/complaint/human --> E[staff]
    D --> F[排除客户本人 + 已删除]
    E --> F
    F --> G[第一档: 在服务时间段内]
    G --> H{有人?}
    H -- 是 --> I[取 active 会话数最少]
    H -- 否 --> J[第二档: 开了 AI 托管]
    J --> K{有人?}
    K -- 是 --> I
    K -- 否 --> L[第三档: 全部客服]
    L --> I
    I --> M[返回 staff]
```
