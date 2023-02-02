# service client

## Create data
```js
const rs = await App.service(model).create({...})
console.log('Create ok', rs)
```

## Patch data
```js
const rs = await App.service(model).patch(_id, {...})
console.log('Patch ok', rs)
```

## Remove data
```js
const rs = await App.service(model).remove(_id)
console.log('Remove ok', rs)
```

## support channels 
```js
// for classroom
`class/${session.sid}`

// for collab edit
`collab/${unit._id/task.id/pd.id}`

// example: join classroom
App.service('auth').get('join', {query:{key:'class/C135deQA'}})
// example: join Unit
App.service('auth').get('join', {query:{key:'collab/1111111'}})
// example: leave Unit
App.service('auth').get('leave', {query:{key:'collab/1111111'}})

```
## Subscribe to events
```js
App.service(model).on('created', (json) => {
  console.log('Created a message', json)
}).on('patched', (json) => {
  console.log('Patched a message', json)
}).on('removed', (json) => {
  console.log('Removed a message', json)
})

// Edit task: [task, task-outline]
// Edit Unit: [unit, task-outline]
// Edit PD: [content]
// classroom : [session, rooms, response, comments, auth, materials]

```



## support model 
```js

// for new db
session, rooms, response
task-outline
unit
unit-tpl

// for old db, need upgrade
task => content
content => content

```
