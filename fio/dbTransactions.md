# Developer Guide: Working with Database Transactions 开发者指南：使用数据库事务

This document outlines the critical conventions for identifying and working with code that operates inside a database transaction.  
本文档概述了识别和使用在数据库事务中运行的代码的关键约定。

Adhering to these rules is essential for maintaining data integrity and preventing bugs.  
遵守这些规则对于维护数据完整性和防止错误至关重要。

## 1. Identifying Transactional Code

## 1. 识别事务性代码

A function or hook is considered "transactional" if it's part of a larger atomic operation, like the `orderComplete` process.  
如果一个函数或钩子是更大原子操作（如 `orderComplete` 流程）的一部分，则被认为是“事务性”的。

You can identify this code in two primary ways:  
您可以通过两种主要方式识别此类代码：

### A. By TypeScript Type (`TxnParams`)

### A. 通过 TypeScript 类型 (`TxnParams`)

If a function's `params` argument is typed as `TxnParams`, it is part of a transaction.  
如果函数的 `params` 参数类型为 `TxnParams`，则表示它是事务的一部分。

This type indicates that a Mongoose session may be present.  
该类型表示可能存在 Mongoose 会话。

```ts
// This type signature signals that the function is transactional.
// 此类型签名表示该函数为事务性的。
async copy(data: any, params: TxnParams) {
  // ...
}

// Type Definition
// 类型定义
type TxnParams = {
  mongoose?: {
    session: ClientSession
  }
}
```

### B. By JSDoc Tag (`@transactional`)

### B. 通过 JSDoc 标签 (`@transactional`)

For Feathers hooks, a special JSDoc tag is used to mark the entire hook chain as transactional.  
对于 Feathers 钩子，可以使用特殊的 JSDoc 标签标记整个钩子链为事务性。

```ts
// This JSDoc tag signals that all hooks in this chain are transactional.
// 此 JSDoc 标签表示该钩子链中的所有钩子都是事务性的。
create: [
  /** @transactional | `params` has a session; all DB calls and new nested functions MUST use it. */
  /** @transactional | `params` 包含 session；所有数据库调用和嵌套函数必须使用它。 */
  authenticate("jwt"),
  // ... other hooks
];
```

> **Rule:** If you are modifying a function identified by either of these methods, you must assume you are inside a transaction.  
> **规则：** 如果您修改了通过上述任一方法标识的函数，必须假设您位于事务中。

## 2. Correct Usage and Best Practices

## 2. 正确使用与最佳实践

When you add or modify code within a transactional boundary, you must use the provided session for all database operations to ensure they are part of the transaction.  
当您在事务边界内添加或修改代码时，必须为所有数据库操作使用提供的 session，以确保它们属于事务的一部分。

### A. Direct Database Updates

### A. 直接的数据库更新

For direct Mongoose calls (`.updateOne`, `.findById`, etc.), use the `Acan.getTxnOptions()` utility to extract the session.  
对于直接的 Mongoose 调用（如 `.updateOne`, `.findById` 等），使用 `Acan.getTxnOptions()` 工具函数提取 session。

```ts
async copy(data: any, params: TxnParams) {
  // Use the helper to get the session options
  // 使用辅助函数获取 session 选项
  const options = Acan.getTxnOptions(params)

  // Pass the options to your Mongoose call
  // 将这些选项传递给 Mongoose 调用
  await this.Model.updateOne({_id: data._id}, {$set: {name: 'John'}}, options)
}
```

### B. Calling Nested Feathers Services

### B. 调用嵌套的 Feathers 服务

When calling another Feathers service, you must pass the transactional context.  
当调用另一个 Feathers 服务时，必须传递事务上下文。

#### Scenario 1: The nested service needs the full `params` object.

#### 情况 1：嵌套服务需要完整的 `params` 对象。

If the nested service (`users.patch` in this case) requires the full context (like `params.user`), pass the entire `params` object.  
如果嵌套服务（如 `users.patch`）需要完整的上下文（例如 `params.user`），则传递整个 `params` 对象。

```ts
async copy(data: any, params: TxnParams) {
  // Pass the full params object to the nested service call
  // 将完整的 params 对象传递给嵌套服务调用
  await this.app.service('users').patch(data._id, {name: 'John'}, params)
}
```

#### Scenario 2: The nested service does NOT need the full `params` object.

#### 情况 2：嵌套服务不需要完整的 `params` 对象。

To avoid passing down unnecessary or conflicting parameters (like `params.query`), use the `Acan.mergeTxnParams()` utility.  
为避免传递不必要或冲突的参数（如 `params.query`），请使用 `Acan.mergeTxnParams()` 工具函数。

This creates a clean `params` object containing only the transactional context.  
这将创建一个仅包含事务上下文的干净 `params` 对象。

```ts
async copy(data: any, params: TxnParams) {
  // Use the helper to create a clean params object with only the session
  // 使用辅助函数创建仅包含 session 的干净 params 对象
  const txnParams = Acan.mergeTxnParams(params);

  // Pass the clean params object to the nested service call
  // 将干净的 params 对象传递给嵌套服务调用
  await this.app.service('users').patch(data._id, {name: 'John'}, txnParams)
}
```

### C. You are adding new functions or hooks

### C.您正在添加新的函数或钩子

If you are creating a new function or Feathers hook that is called within a transaction, you must explicitly tag it to ensure it follows transactional rules.  
如果您创建了一个在事务中调用的新函数或 Feathers 钩子，您必须显式地标记它以确保遵循事务规则。

#### A. For Functions

#### A. 对于函数

Use the `TxnParams` type in the function signature to indicate it receives a transactional context.  
在函数签名中使用 `TxnParams` 类型，以表明它接收事务上下文。

```ts
async myNewFunction(data: any, params: TxnParams) {
  const options = Acan.getTxnOptions(params);
  await this.Model.updateOne({_id: data._id}, {$set: {status: 'done'}}, options);
}
```

#### B. For Feathers Hooks

#### B. 对于 Feathers 钩子

Add the `@transactional` tag to mark the new hook as operating within a transaction.
添加 `@transactional` 标签以标记新钩子在事务中运行。

```ts
// Marking the hook function
create: [
  /** @transactional | `params` 包含 session；所有数据库调用和嵌套函数必须使用它。 */
  authenticate("jwt"),
  // ... other hooks
];
```

## 3. Utility Functions (Reference)

## 3. 工具函数（参考）

These helpers ensure that the session is passed consistently and correctly.
这些辅助函数确保 session 被一致且正确地传递。

```ts
// Extracts only the { session } object for direct Mongoose calls.
// 提取仅包含 { session } 的对象以供 Mongoose 调用使用。
Acan.getTxnOptions(params: TxnParams) => {
  return {
    session: params.mongoose?.session
  };
}

// Creates a clean params object with only the mongoose key.
// 创建仅包含 mongoose 键的干净 params 对象。
Acan.mergeTxnParams(params: TxnParams) => {
  return {
    mongoose: params.mongoose
  };
}
````
