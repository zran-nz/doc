## 课堂接口
- id为 session的真实id, 纯数字

> End session  
`App.service('class2').patch(id, {status: 'close'})`

> Reopen session  
`App.service('class2').patch(id, {status: 'live'})`

> Archive session  
`App.service('class2').patch(id, {del_flag: 1})`

> Restore session  
`App.service('class2').patch(id, {del_flag: 0})`

> Delete session  
`App.service('class2').remove(id)`
