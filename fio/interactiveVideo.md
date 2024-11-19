## Unit

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
    videoDetails: {
        thumbnail: {type: Schema.Types.Mixed}, //video thumbnail
        title: {type: String, trim: true}, //video title
    },
    quizes: [ //interactive question
        {
            id: {type: String, trim: true}, // quiz id
            type: {type: String, trim: true}, // quiz type (text/multiple)
            time: {type: Number, trim: true}, // quiz appearance time
            question: { //question string
                type: String,
                trim: true,
            },
            score: { //score
                outline: {
                    val: {type: Number, default: 0}, // total score
                    enable: {type: Boolean, default: false}, // score enable
                    rubric: {type: Boolean, default: false}, // rubric enable
                    criteria: {type: Schema.Types.Mixed}, // criteria data
                },
                assess: {
                    val: {type: Number},
                    enable: {type: Boolean, default: false},
                    rubric: {type: Boolean, default: false},
                    criteria: {type: Schema.Types.Mixed},
                },
                goal: {
                    val: {type: Number, default: 0},
                    enable: {type: Boolean, default: false},
                    rubric: {type: Boolean, default: false},
                    criteria: {type: Schema.Types.Mixed},
                },
                skills: {
                    val: {type: Number, default: 0},
                    enable: {type: Boolean, default: false},
                    rubric: {type: Boolean, default: false},
                    criteria: {type: Schema.Types.Mixed},
                },
            },
            outlines: { // outlines
                outline: {type: Schema.Types.Mixed}, // outlines
                assess: {type: Schema.Types.Mixed}, // assess
                goal: {type: Schema.Types.Mixed}, // assess
                skills: {type: Schema.Types.Mixed}, // skills
            },
            options: {type: Schema.Types.Mixed}, // quize choices [array]
        },
    ],
}
```

### unit api

```js
// create unit data
App.service('interactive-videoes').create({data}) // data is the object holds the schema data

// patch
App.service('interactive-videoes').patch(_id, data) // _id is the id of the document and data will be the object with the key/value to update the data for that id

// remove video
 App.service('interactive-videoes').remove(_id) // remove the video with particular id
```

