const express = require("express");
const consign = require("consign");
const bodyParser = require("body-parser");
//const expressValidator = require('express-validator');
let app = express();
// configurando bodyParser para receber os elementos via post
app.use(bodyParser.urlencoded({ extended: false ,limit:'50mb'}));
app.use(bodyParser.json({limit:'50mb'}));
//app.use(expressValidator());

//configurando o consgin para carregar as rotas
consign()
  .include("routes")
  .include("utils")
  .into(app);

app.listen(4000, "127.0.0.1", () => {
  console.log("servidor rodando");
});