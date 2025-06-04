
## Component: `<VideoPlayer.vue>`

A feature-rich video player component built with Video.js that supports YouTube/MP4 playback, trimming, interactive markers, and quiz integration.

### Component
- **Image:** ![VideoPlayer Screenshot](https://github.com/zran-nz/doc/blob/master/image.png?raw=true)
- **Path:** `web/src/components/VideoPlayer/VideoPlayer.vue`

### Features

- Video Playback 
- Custom progress bar
- Trimming Tools
- Interactive Markers
- Student Mode

** Dependencies**

- `video.js`: Core video engine
- `videojs-youtube`: YouTube playback

### Props

| Prop Name     | Type    | Default | Description                                   |
| ------------- | ------- | ------- | --------------------------------------------- |
| `isEdit`      | Boolean | false   | Whether the player is in edit mode            |
| `isStudent`   | Boolean | false   | Whether the player is in student mode         |
| `videoData`   | Object  | {}      | Video metadata including ID, type, and timing |
| `isSaving`    | Boolean | false   | Flag indicating if video is being saved       |
| `isPreview`   | Boolean | false   | Whether the player is in preview mode         |
| `startTrim`   | Number  | null    | Start time for trimmed video segment          |
| `endTrim`     | Number  | null    | End time for trimmed video segment            |
| `isLandscape` | Boolean | false   | Whether the player is in landscape mode       |

### APIs Used

- `App.service('questions').find()`: Fetches questions for video
  -{ query: { id: video Id } }

### Stores Used

- `roomStore`: Manages room/quiz state
- `interactiveVideoStore`: Manages video and question state

### Child Components Used

- `VideoFooter`: Player control footer
- `MainModal`: Quiz modal for instructor
- `MainModalStud`: Quiz modal for student
- `EyesUp`: Case study component
- `CaseStudy`: Case study modal

### URL's where this component is used
- https://dev.classcipe.com/v2/video/edit/683d24ccea2b20962e8314f6?back=/home/contents
- https://dev.classcipe.com/v2/video/view/683d24ccea2b20962e8314f6?back=/home/contents
- https://dev.classcipe.com/v2/com/video/edit/683d24ccea2b20962e8314f6?back=/home/contents&format=video
- https://dev.classcipe.com/v2/com/video/view/683d24ccea2b20962e8314f6?back=/home/contents&format=video
- https://dev.classcipe.com/v2/detail/question/683d24ccea2b20962e8314f6?back=/detail/content/me/683d24ccea2b20962e8314f6?back=/home/contents?tab=me%2526mode=video
- https://dev.classcipe.com/v2/s/C007bKe73?back=%252Fdetail%252Fsession%252F681acb7645b6a165643caddb%253Fback%253D%252Fstudy%252Fclass%253Ftab%253Dprivate%252526subtab%253Dongoing
- https://dev.classcipe.com/v2/account/takeaway/68340ba412173b08cc1639e6/view/6809dbfa44a8b73200d6e844

---
