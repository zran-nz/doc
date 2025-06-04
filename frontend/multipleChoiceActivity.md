
## Component: `<MultipleChoiceActivity.vue>`

A quiz builder component used to create and edit multiple choice questions with dynamic options, drag-and-drop support, and answer toggling. Integrated into the interactive video flow.

### Component

* **Image:** ![MCQ Interactive Video](https://github.com/user-attachments/assets/94dee41d-0be5-4315-9243-1f7d1af69a4c)

* **Path:** `web\src\pages\InteractiveVideo\components\ActivityModal\MultipleChoiceActivity.vue`

### Features

* Add/Edit multiple choice questions
* Drag-and-drop for reordering options
* Toggle correct answer visibility
* Quiz deletion and validation

### Props

| Prop Name      | Type    | Default | Description                                         |
| -------------- | ------- | ------- | --------------------------------------------------- |
| `selectedQuiz` | Object  | {}      | The current quiz question being edited or previewed |
| `isPreview`    | Boolean | false   | Whether the quiz is being shown in preview mode     |
| `isLandscape`  | Boolean | false   | Adjusts layout scaling for landscape mode           |
| `readOnly`     | Boolean | false   | If true, disables editing of the quiz               |

### APIs Used

* `videoStore.addQuestion(newQuiz)`: Adds a new question to the video
* `videoStore.updateQuestion(updatedQuiz)`: Updates an existing question
* `videoStore.removeQuestion(quizId)`: Deletes a question by ID

### Stores Used

* `interactiveVideoStore`: Manages video state and interactive questions

### Child Components Used

* `VirtualKeyboard`: Rich input with virtual keyboard and slot-based control icons
* `draggable` (via `vuedraggable`): Enables reordering of answer choices

### URL's where this component is used

* [https://dev.classcipe.com/v2/video/edit/683d24ccea2b20962e8314f6](https://dev.classcipe.com/v2/video/edit/683d24ccea2b20962e8314f6)

