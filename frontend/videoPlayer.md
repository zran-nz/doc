
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

### State Variables

#### Non-Reactive Variables
- `player`: Video.js player instance
- `currentTooltip`: Currently displayed tooltip element
- `isTooltipVisible`: Whether any tooltip is visible
- `currentMarker`: Currently active marker element
- `trimmedOverlay`: DOM element for trimmed overlay
- `isSeekDragging`: Whether seek bar is being dragged
- `isTrimDragging`: Whether trim controls are being dragged
- `isMarkerDragging`: Whether a marker is being dragged
- `markerClickedTime`: Time when marker was clicked

#### Reactive References

- `trimRange`: Object with start/end trim percentages
- `showTrimmer`: Whether trim controls are visible
- `dragType`: Type of drag operation ('start' or 'end')
- `initialX`: Initial X position for drag operations
- `isAnyMarkerOverlapping`: Whether any marker overlaps playhead
- `resumedFromMarker`: Whether playback resumed from marker
- `videoPlayerRef`: Reference to the video tag in template
- `isCaseStudy`: Whether case study is active
- `isPausedAtMarker`: Whether paused at marker
- `isMarkerClicked`: Whether marker was clicked
- `currentQuiz`: Currently active quiz data

#### Computed Properties

- `isPreview`: Whether in preview mode
- `isViewOnly`: Whether in view-only mode
- `videoAddedFrom`: Source of video from store
- `getQuizIdFromAuth`: Current quiz ID from room store
- `isLandscape`: Whether in landscape mode
- `isSaving`: Whether saving is in progress
- `isEdit`: Whether in edit mode
- `isStudent`: Whether in student mode
- `currentQuiz`: Currently active quiz
- `quizModalVisible`: Whether quiz modal is visible
- `questions`: Array of quiz questions
- `videoData`: Video metadata
- `containerStyle`: Dynamic container styling

### Methods

#### Player Control Methods

- `handleModalOpen()`: Pauses player and opens quiz modal
- `handleModalClose()`: Resumes playback after modal close
- `changeShowTrimmer()`: Toggles trim controls visibility
- `updateTimeOnMarker()`: Advances time slightly after marker
- `updateMarkers()`: Updates marker positions based on questions
- `clearSelectedQuiz()`: Resets current quiz state

#### Time Handling Methods

- `handleTimeUpdate()`: Main time update handler for player
- `secondToTimeFormat()`: Converts seconds to MM:SS format
- `updateCustomTimeDisplay()`: Updates time display during trim

#### Marker Methods

- `clearMarker()`: Removes a specific marker
- `addMarker()`: Adds a new marker with tooltip
- `updateQuizTimeInStore()`: Updates quiz time in Vuex store

#### Trim Methods

- `startTrimDragging()`: Initiates trim drag operation
- `onTrimDrag()`: Handles trim drag movement
- `stopTrimDragging()`: Ends trim drag operation
- `applyTrim()`: Applies trim changes to player
- `updateProgressControl()`: Updates progress bar after trim
- `cancelTrim()`: Cancels trim operation

#### Utility Methods

- `hideAllTooltips()`: Hides all visible tooltips
- `handleResize()`: Handles window resize events

### Events

#### Player Events

- `timeupdate`: Main playback time update
- `playing`: When playback starts
- `play`: When playback begins
- `pause`: When playback pauses
- `loadedmetadata`: When video metadata loads

### Lifecycle Hooks

#### `onMounted()`

- Initializes video player with proper tech (YouTube/HTML5)
- Sets up custom controls and progress bar
- Loads questions from API if needed
- Adds event listeners

#### `onBeforeUnmount()`

- Cleans up player instance
- Removes event listeners
- Performs cleanup of DOM elements

#### Watchers

- `isSaving`: Handles save state changes
- `isMarkerClicked`: Handles marker click state
- `quizModalVisible`: Pauses on modal open
- `questions`: Updates markers when questions change
- `rooms.currentCaseStudy`: Handles case study changes
- `startTrim/endTrim`: Updates markers when trim changes
- `isPausedAtMarker`: Handles marker pause state
- `showTrimmer`: Handles trim UI changes
- `videoData`: Updates trim times
- `rooms.studentPaced`: Handles pacing mode changes
- `rooms.currentQuizId`: Updates current quiz

### APIs Used

- FeathersJS `App.service('questions').find()`: Fetches questions for video
  -{ query: { id: videoData.value.videoId } }
- This sends a GET request to fetch all question records where the id matches the videoId from videoData in OnMounted Lifecycle Hook.

### Stores Used

- `roomStore`: Manages room/quiz state
- `interactiveVideoStore`: Manages video and question state

### Components Used

- `VideoFooter`: Player control footer
- `MainModal`: Quiz modal for instructor
- `MainModalStud`: Quiz modal for student
- `EyesUp`: Case study component
- `CaseStudy`: Case study modal

---
