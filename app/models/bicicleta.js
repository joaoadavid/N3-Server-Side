const mongoose = require("mongoose");
const BikeSchema = new mongoose.Schema({

  marca_bicicleta: { type: String, required: true },
  cor_bicicleta: { type: String, required: true },
  quadro: { type: mongoose.Schema.Types.ObjectId, ref: 'Quadro', required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

BikeSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.codigo_bicicleta = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});


module.exports = mongoose.model('Bicicleta', BikeSchema);
