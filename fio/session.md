## 详情获取接口
> 获取unit 详情
`App.service('unit').get(id)`

> 获取task 详情
`App.service('task').get(id)`

> 获取content 详情 (PD, video)
`App.service('content').get(id)`



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
