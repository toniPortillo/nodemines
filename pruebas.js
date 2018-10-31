const LogicaBuscaminas = require("./logicaBuscaminas.js");

let logicaBuscaminas = new LogicaBuscaminas();

logicaBuscaminas.crearTablero();
logicaBuscaminas.generarBombas();
logicaBuscaminas.bombasAlrededor();
logicaBuscaminas.mostrarTablero();