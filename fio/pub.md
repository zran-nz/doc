## Pub store
### Actions
#### pub.userInfo(school = null)
> return {_id, avatar, name, nickname, role, email?, schoolInfo?, ...}
```js
// get personal user info
const userInfo = pub.userInfo()

// get school user info
const userInfo = pub.userInfo(schoolId)
```

#### pub.hasSchool(schoolId)
> return Boolean