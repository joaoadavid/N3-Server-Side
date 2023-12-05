const mongoose = require("mongoose");

const QuadroSchema = new mongoose.Schema({
  tamanho_quadro: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

QuadroSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id_quadro = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Quadro', QuadroSchema);
