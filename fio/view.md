## VIEW

### service-teachers

```js
db.createView("serviceteachers", "serviceconfs", [
  {
    $lookup: {
      from: "users",
      let: {
        uid: "$_id",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$$uid", "$_id"],
            },
          },
        },
      ],
      as: "usersDoc",
    },
  },
  {
    $project: {
      _id: 1,
      rating: 1,
      fans: 1,
      name: "$usersDoc.name",
      avatar: "$usersDoc.avatar",
      email: "$usersDoc.email",
      lang: "$usersDoc.lang",
      hoursIndex: 1,
      hoursMax: 1,
      audio: 1,
      audioTime: 1,
    },
  },
  { $unwind: "$name" },
  { $unwind: "$avatar" },
  { $unwind: "$email" },
  { $unwind: "$lang" },
]);
```
