
## cpa-subjects model
```js
uid: {type: String, index: true, required: true}, // school._id or user._id
name: {type: String, required: true, trim: true}, // User-defined subject name
code: {type: String, required: true, trim: true}, // User-defined subject code (required)
order: {type: Number, default: 0}, // display order in the table
del: {type: Boolean, default: false}, // soft delete flag
au: {type: [String]}, 
nz: {type: [String]}, 
..., 
```

