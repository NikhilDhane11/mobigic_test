const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  code: { type: String, required: true },
  path: { type: String, required: true },
});

fileSchema.statics.deleteFileByCode = async function (code) {
  return this.deleteOne({ code });
};

const File = mongoose.model('File', fileSchema);

module.exports = File;
