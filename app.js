var express = require('express');
var path = require('path');
var logger = require('morgan');
require('./config/database')
var usersRouter = require('./app/routes/users');
var bicicletaRouter = require('./app/routes/bicicleta');
var quadroRouter = require('./app/routes/quadro');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);
app.use('/', bicicletaRouter);  // Use as rotas de bicicletas
app.use('/', quadroRouter);  // Use as rotas de quadros


module.exports = app;

