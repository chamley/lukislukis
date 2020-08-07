const mongoose = require('mongoose');

const CanvasSchema = new mongoose.Schema({
  dateCreated: {
    type: Date,
    required: true,
    default: new Date(),
  },
  dateModified: {
    type: Date,
    required: true,
    default: new Date(),
  },
  canvasData: {
    type: Object,
    required: true,
    index: true,
    unique: true,
    default: null,
  },
  isMainCanvas: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model('Canvas', CanvasSchema);
