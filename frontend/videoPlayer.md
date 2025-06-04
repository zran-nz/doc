
## Component: `<VideoPlayer.vue>`

A feature-rich video player component built with Video.js that supports YouTube/MP4 playback, trimming, interactive markers, and quiz integration.

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

---
