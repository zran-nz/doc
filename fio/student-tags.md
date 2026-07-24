## student-tags

老师维度的学生标签服务：老师可以给自己名下的学生打专属标签；学校管理员可以维护学校下的中央标签，全校老师可见。

### student-tags model

```js
{
  center: { type: Boolean, default: false }, // 是否学校中央标签, true 时该标签对所在 school 下所有老师可见，仅学校管理员可维护
  school: { type: String, trim: true },      // school-plan._id, 中央标签必填；老师私有标签可为空
  uid:    { type: String, required: true },  // users._id, 标签所有者(创建者)
  name:   { type: String, required: true },  // 标签名称
  color:  { type: String, required: true },  // 标签颜色
  students: { type: [String], trim: true },  // 学生列表, 存 students._id
  // timestamps: createdAt, updatedAt
}
```

### 可见性 / 权限规则

- **可见范围（find/get）**
  - 非 sys/admin 用户：`{ uid: 当前用户 }`（自己的私有标签） 或 `{ center: true, school: 传入的 school }`（该学校的中央标签）
  - 未传 `school` 时只能看到自己的私有标签
  - sys/admin：不做可见性限制，可按参数自由查询

- **创建（create）**
  - `uid` 强制覆盖为当前登录用户，前端不需要（也不允许）传
  - `center: true` 时必须提供 `school`，且当前用户必须是该学校的管理员（`school-user.role` 包含 `admin`）
  - 普通老师创建的标签为私有标签（center 保持默认 false）

- **修改（patch / update）**
  - 中央标签：仅所在学校的管理员可改
  - 私有标签：仅 owner (`uid == 当前用户`) 可改
  - 不允许通过 patch 修改 `uid`（owner 不可转移）
  - 不允许普通老师把自己的私有标签升级为 `center: true`，只有学校管理员可以

- **删除（remove）**：同 patch 的写权限
- **学生联动清理**：students 服务在软删（`patch { del: true }`）或物理删除学生时，会自动 `$pull` 掉所有 student-tags 中对该学生的引用，无需前端处理

### GET:/student-tags

```js
// 老师查询自己在某学校下可用的标签（自己的私有 + 该学校的中央）
await App.service('student-tags').find({
  query: { school: 'school_id' }
})

// 只查自己的私有标签
await App.service('student-tags').find({
  query: { uid: 'self_uid' } // 或不传 school
})

// 只查某学校的中央标签
await App.service('student-tags').find({
  query: { school: 'school_id', center: true }
})

// 按 name 模糊过滤（示例）
await App.service('student-tags').find({
  query: { school: 'school_id', name: { $search: 'Red' } }
})
```

### GET:/student-tags/:id

```js
await App.service('student-tags').get('tag_id')
```

### POST:/student-tags

```js
// 老师创建自己的私有标签（uid 会被后端强制填为当前用户）
await App.service('student-tags').create({
  school: 'school_id',        // 可选
  name: 'Focus group',
  color: '#FF0000',
  students: ['studentId1', 'studentId2'],
})

// 学校管理员创建学校中央标签
await App.service('student-tags').create({
  center: true,
  school: 'school_id',        // 必填
  name: 'Red',
  color: '#F44336',
  students: [],
})
```

### PATCH:/student-tags/:id

```js
// 更新标签名 / 颜色
await App.service('student-tags').patch('tag_id', {
  name: 'New name',
  color: '#00BCD4',
})

// 给标签追加学生
await App.service('student-tags').patch('tag_id', {
  $addToSet: { students: 'studentId' },
})

// 批量追加学生
await App.service('student-tags').patch('tag_id', {
  $addToSet: { students: { $each: ['s1', 's2'] } },
})

// 从标签移除学生
await App.service('student-tags').patch('tag_id', {
  $pull: { students: 'studentId' },
})

// 管理员把私有标签升级为中央标签（普通老师无权限）
await App.service('student-tags').patch('tag_id', {
  center: true,
  school: 'school_id',
})
```

### DELETE:/student-tags/:id

```js
await App.service('student-tags').remove('tag_id')
```

### 错误码

- `403 Forbidden`
  - 非 owner 尝试改私有标签
  - 非学校管理员尝试改/删中央标签
  - 非学校管理员创建中央标签，或把私有标签升级为中央
- `400 BadRequest`
  - `center: true` 但未提供 `school`
