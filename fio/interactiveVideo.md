## Interactive video

### Interactive video model

```js
{
    uid: {type: String}, // user id
    tid: {type: String}, // task id
    videoId: {type: String, index: true}, //youtube_id/uploaded video id
    startTime: {type: Number, trim: true}, //video start time
    endTime: {type: Number, trim: true}, //video end time
    trimOptions: {
        startTime: {type: Number, trim: true}, //start trim time
        endTime: {type: Number, trim: true}, //end trim time
    },
    type: {type: String, trim: true}, //youtube/uploaded
    thumbnail: {type: Schema.Types.Mixed}, //video thumbnail
    name: {type: String, trim: true}, //video title
}
```

### interactive-video api

```js
// create video data
App.service('interactive-videoes').create({data}) // data is the object holds the schema data

// patch
App.service('interactive-videoes').patch(_id, data) // _id is the id of the document and data will be the object with the key/value to update the data for that id

// remove video
 App.service('interactive-videoes').remove(_id) // remove the video with particular id
```

