## 课堂接口
- id为 session的真实id, 纯数字

> End session  
`App.service('class2').patch(id, {status: 'close'})`

> Reopen session  
`App.service('class2').patch(id, {status: 'live'})`

