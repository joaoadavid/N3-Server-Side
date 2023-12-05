const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let userSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telefone: String,
  altura: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
//mongose permite criar pré esquemas que modificam as informações antes de salvar no banco de dados
userSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("password")) {
    const document = this;
    bcrypt.hash(
      this.password,10, //sountround, gerando o hash com 10 caracteres
      (err, hashedPassword) => {
        if (err) next(err);
        else {
          this.password = hashedPassword;
          next();
        }
      }
    )
  }
});

userSchema.methods.isCorrectPassword = function(password,callback){
  bcrypt.compare(password, this.password, function(err, same){
    if(err)
    callback(err);
  else{
    callback(err,same);
  }
  })
}

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id_usuario = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});




module.exports = mongoose.model("User", userSchema);