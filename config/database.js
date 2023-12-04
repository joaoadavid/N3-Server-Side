const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1/n3')
  .then(() => {
    console.log('Conexão realizada com sucesso');
  })
  .catch((err) => {
    console.error('Erro na conexão:', err);
  });
